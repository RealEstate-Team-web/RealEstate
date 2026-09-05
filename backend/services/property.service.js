const propertyModel = require("../models/property.model");
const { withTransaction } = require("../config/db.config");
const { uploadPropertyImage, destroyImage } = require("./upload.service");

// Wrap a transactional connection so callers can `await executor(sql, params)`
// and get back the first result array — matches mysql2's `pool.execute` shape.
const makeExecutor = (connection) => async (sql, params) => {
  const [rows] = await connection.execute(sql, params);
  return rows;
};

const assertOwner = (property, agentId) => {
  if (agentId != null && Number(property.agent_id) !== Number(agentId)) {
    const error = new Error("You can only manage your own properties");
    error.statusCode = 403;
    throw error;
  }
};

const notFoundError = () => {
  const error = new Error("Property not found");
  error.statusCode = 404;
  return error;
};

 const getProperties = async (
  filters
) => {
  const result =
    await propertyModel.findProperties(
      filters
    );

  return {
    properties: result.properties,

    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: result.total,

      totalPages: Math.ceil(
        result.total / filters.limit
      ),
    },
  };
};


 const getFeaturedProperties = async (
  { limit } = {}
) => {
  const properties =
    await propertyModel.findFeatured(
      { limit }
    );

  return properties;
};


 const getPropertyById = async (
  id
) => {
  const property =
    await propertyModel.findPropertyById(
      id
    );

  if (!property) {
    throw notFoundError();
  }

  return property;
};


 const getMyProperties = async (
  agentId,
  filters
) => {
  const result =
    await propertyModel.findPropertiesByAgent({
      agentId,
      ...filters,
    });

  return {
    properties: result.properties,

    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: result.total,

      totalPages: Math.ceil(
        result.total / filters.limit
      ),
    },
  };
};


 const createProperty = async (
  data
) => {
  if (data.price <= 0) {
    const error = new Error(
      "Property price must be greater than zero"
    );

    error.statusCode = 400;

    throw error;
  }

  return withTransaction(async (connection) => {
    const executor = makeExecutor(connection);

    const propertyId =
      await propertyModel.createProperty(
        data,
        executor
      );

    await propertyModel.syncPropertyAmenities(
      propertyId,
      data.amenities,
      executor
    );

    return propertyId;
  });
};


 const updateProperty = async (
  id,
  data,
  agentId
) => {
  const property =
    await propertyModel.findPropertyOwner(
      id
    );

  if (!property) {
    throw notFoundError();
  }

  assertOwner(property, agentId);

  const { amenities, ...fields } = data;

  return withTransaction(async (connection) => {
    const executor = makeExecutor(connection);

    const updated =
      await propertyModel.updateProperty(
        id,
        fields,
        executor
      );

    if (data.amenities !== undefined) {
      await propertyModel.syncPropertyAmenities(
        id,
        data.amenities,
        executor
      );
    }

    return updated;
  });
};


 const duplicateProperty = async (
  id,
  agentId
) => {
  const property =
    await propertyModel.findPropertyById(
      id
    );

  if (!property) {
    throw notFoundError();
  }

  assertOwner(property, agentId);

  return withTransaction(async (connection) => {
    const executor = makeExecutor(connection);

    const copyId =
      await propertyModel.createProperty(
        {
          agentId,
          categoryId: property.category_id,
          title: `${property.title} (Copy)`,
          description: property.description,
          listingType: property.listingType || property.listing_type,
          price: Number(property.price),
          bedrooms: property.bedrooms ?? null,
          bathrooms: property.bathrooms ?? null,
          parkingSpaces:
            property.parking ?? property.parking_spaces ?? null,
          area: property.area ?? null,
          country: property.country,
          city: property.city,
          address: property.address ?? null,
          latitude: property.latitude ?? null,
          longitude: property.longitude ?? null,
          status: "draft",
        },
        executor
      );

    await propertyModel.syncPropertyAmenities(
      copyId,
      property.amenities,
      executor
    );

    return copyId;
  });
};


 const MAX_TOTAL_IMAGES = 10;

const uploadPropertyImages = async (
  propertyId,
  files,
  agentId
) => {
  if (!files || files.length === 0) {
    const error = new Error(
      "At least one image is required"
    );
    error.statusCode = 400;
    throw error;
  }

  const [existingImages, property] = await Promise.all([
    propertyModel.countPropertyImages(propertyId),
    propertyModel.findPropertyOwner(propertyId),
  ]);

  if (!property) {
    throw notFoundError();
  }

  assertOwner(property, agentId);

  if (existingImages + files.length > MAX_TOTAL_IMAGES) {
    const error = new Error(
      `A property can have at most ${MAX_TOTAL_IMAGES} images`,
    );
    error.statusCode = 400;
    throw error;
  }

  const results = await Promise.allSettled(
    files.map((file) =>
      uploadPropertyImage(file.buffer, {
        folder: `real-estate/properties/${propertyId}`,
      }),
    ),
  );

  const uploadedImages = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const failed = results.find((result) => result.status === "rejected");
  if (failed) {
    // Roll back every successfully uploaded Cloudinary asset so a partial
    // batch never leaks orphan files.
    await Promise.all(
      uploadedImages.map((image) => destroyImage(image.publicId)),
    );
    throw failed.reason;
  }

  try {
    await propertyModel.insertPropertyImages(propertyId, uploadedImages);
  } catch (error) {
    // Roll back the successfully uploaded Cloudinary assets so we don't
    // leak orphan files when the DB insert fails.
    await Promise.all(
      uploadedImages.map((image) => destroyImage(image.publicId)),
    );
    throw error;
  }

  return uploadedImages;
};


 const deleteProperty = async (
  id,
  agentId
) => {
  const property =
    await propertyModel.findPropertyOwner(
      id
    );

  if (!property) {
    throw notFoundError();
  }

  assertOwner(property, agentId);

  // Capture Cloudinary public ids before the property row / image rows are
  // removed so no orphan assets leak in the media library.
  const publicIds = await propertyModel.findPropertyImages(id);

  const deleted = await propertyModel.deleteProperty(id);

  if (publicIds.length > 0) {
    await Promise.all(publicIds.map((publicId) => destroyImage(publicId)));
  }

  return deleted;
};
module.exports = {
    getProperties,
    getFeaturedProperties,
    getPropertyById,
    getMyProperties,
    createProperty,
    updateProperty,
    duplicateProperty,
    uploadPropertyImages,
    deleteProperty,
};