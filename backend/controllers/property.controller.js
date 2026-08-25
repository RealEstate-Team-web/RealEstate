const propertyService = require("../services/property.service");
 const getProperties = async (
  req,
  res,
  next
) => {
  try {
    const {
      city,
      location,
      minPrice,
      maxPrice,
      categoryId,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      furnishingStatus,
      constructionStatus,
      parking,
      listingType,
      sort = "newest",
    } = req.query;


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
        city,
        location,
        minPrice,
        maxPrice,
        categoryId,
        bedrooms,
        bathrooms,
        minArea,
        maxArea,
        furnishingStatus,
        constructionStatus,
        parking,
        listingType,
        sort,
        page,
        limit,
      });


    res.status(200).json({
      success: true,
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

    res.status(200).json({
      success: true,
      data: property,
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
      await propertyService.createProperty(
        req.body
      );

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
      req.body
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
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};
module.exports = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
};