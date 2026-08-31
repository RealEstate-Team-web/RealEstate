const propertyModel = require("../models/property.model");

const assertOwner = (property, agentId) => {
  if (agentId != null && Number(property.agent_id) !== Number(agentId)) {
    const error = new Error("You can only manage your own properties");
    error.statusCode = 403;
    throw error;
  }
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


 const getPropertyById = async (
  id
) => {
  const property =
    await propertyModel.findPropertyById(
      id
    );

  if (!property) {
    const error = new Error(
      "Property not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return property;
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

  return propertyModel.createProperty(
    data
  );
};


 const updateProperty = async (
  id,
  data,
  agentId
) => {
  const property =
    await propertyModel.findPropertyById(
      id
    );

  if (!property) {
    const error = new Error(
      "Property not found"
    );

    error.statusCode = 404;

    throw error;
  }

  assertOwner(property, agentId);

  return propertyModel.updateProperty(
    id,
    data
  );
};


 const deleteProperty = async (
  id,
  agentId
) => {
  const property =
    await propertyModel.findPropertyById(
      id
    );

  if (!property) {
    const error = new Error(
      "Property not found"
    );

    error.statusCode = 404;

    throw error;
  }

  assertOwner(property, agentId);

  return propertyModel.deleteProperty(
    id
  );
};
module.exports = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
};