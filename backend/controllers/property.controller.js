const propertyService = require("../services/property.service");
 const getProperties = async (
  req,
  res,
  next
) => {
  try {
    const {
      q,
      city,
      location,
      minPrice,
      maxPrice,
      categoryId,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      parking,
      listingType,
      sort = "newest",
    } = req.query;


    if (q !== undefined && typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameter: q must be a string",
        errors: ["q must be a string"],
      });
    }


    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );


    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 12,
        1
      ),
      50
    );


    const result =
      await propertyService.getProperties({
        q,
        city,
        location,
        minPrice,
        maxPrice,
        categoryId,
        bedrooms,
        bathrooms,
        minArea,
        maxArea,
        parking,
        listingType,
        sort,
        page,
        limit,
      });


    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: result,
    });

  } catch (error) {
    next(error);
  }
};


 const getFeaturedProperties = async (
  req,
  res,
  next
) => {
  try {
    if (req.query.limit !== undefined) {
      const parsed = Number(req.query.limit);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 50) {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameter: limit must be an integer between 1 and 50",
          errors: ["limit must be an integer between 1 and 50"],
        });
      }
    }

    const result =
      await propertyService.getFeaturedProperties({
        limit: req.query.limit,
      });

    res.status(200).json({
      success: true,
      message: "Featured properties fetched successfully",
      data: result,
    });

  } catch (error) {
    next(error);
  }
};


 const getPropertyById = async (
  req,
  res,
  next
) => {
  try {
    const property =
      await propertyService.getPropertyById(
        req.params.id
      );

    if (property.status === "draft") {
      const isOwner =
        req.user &&
        req.user.role === "agent" &&
        Number(req.user.id) === Number(property.agent_id);
      const isAdmin =
        req.user && req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Property fetched successfully",
      data: property,
    });

  } catch (error) {
    next(error);
  }
};


 const getMyProperties = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
      listingType,
    } = req.query;

    const validStatuses = ["draft", "available", "sold", "rented"];
    const validListingTypes = ["sale", "rent"];

    if (status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameter: status",
        errors: [`status must be one of: ${validStatuses.join(", ")}`],
      });
    }

    if (listingType !== undefined && !validListingTypes.includes(listingType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameter: listingType",
        errors: [`listingType must be one of: ${validListingTypes.join(", ")}`],
      });
    }

    const q =
      typeof req.query.q === "string" ? req.query.q : undefined;
    const location =
      typeof req.query.location === "string" ? req.query.location : undefined;
    const sort =
      typeof req.query.sort === "string" ? req.query.sort : "newest";

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 8,
        1
      ),
      50
    );

    const result =
      await propertyService.getMyProperties(
        req.user.id,
        {
          status,
          q,
          listingType,
          location,
          sort,
          page,
          limit,
        }
      );

    res.status(200).json({
      success: true,
      message: "My properties fetched successfully",
      data: result,
    });

  } catch (error) {
    next(error);
  }
};


 const createProperty = async (
  req,
  res,
  next
) => {
  try {
    const propertyId =
      await propertyService.createProperty({
        ...req.body,
        agentId: req.user.id,
      });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: {
        id: propertyId,
      },
    });

  } catch (error) {
    next(error);
  }
};


 const updateProperty = async (
  req,
  res,
  next
) => {
  try {
    await propertyService.updateProperty(
      req.params.id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
    });

  } catch (error) {
    next(error);
  }
};


 const deleteProperty = async (
  req,
  res,
  next
) => {
  try {
    await propertyService.deleteProperty(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};


 const duplicateProperty = async (
  req,
  res,
  next
) => {
  try {
    const propertyId =
      await propertyService.duplicateProperty(
        req.params.id,
        req.user.id
      );

    res.status(201).json({
      success: true,
      message: "Property duplicated successfully",
      data: {
        id: propertyId,
      },
    });

  } catch (error) {
    next(error);
  }
};


 const uploadPropertyImages = async (
  req,
  res,
  next
) => {
  try {
    const images =
      await propertyService.uploadPropertyImages(
        req.params.id,
        req.files,
        req.user.id
      );

    res.status(201).json({
      success: true,
      message: "Property images uploaded successfully",
      data: {
        images,
      },
    });

  } catch (error) {
    next(error);
  }
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