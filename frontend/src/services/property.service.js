import api from "./api";

// Get landing page data
export const getLanding = async () => {
  const { data } = await api.get("/properties/featured?limit=8");
  const featured = data?.data ?? [];
  return {
    properties: Array.isArray(featured) ? featured : [],
  };
};

// Get paginated / filtered properties
export const getProperties = async (params = {}) => {
  const { data } = await api.get("/properties", {
    params,
  });

  return data.data;
};

// Get a single property
export const getPropertyById = async (id) => {
  const { data } = await api.get(`/properties/${id}`);
  return data.data;
};

// Get featured / latest properties
export const getFeaturedProperties = async (limit = 6) => {
  const { data } = await api.get("/properties/featured", {
    params: { limit },
  });

  return data.data;
};

// Search properties by keyword
export const searchProperties = async (query) => {
  const { data } = await api.get("/properties/search", {
    params: {
      q: query,
    },
  });

  return data.data;
};

// Get the authenticated agent's own listings
export const getMyProperties = async (params = {}) => {
  const { data } = await api.get("/properties/my-properties", {
    params,
  });

  return data.data;
};

// Create a property (status determines draft vs published)
export const createProperty = async (payload) => {
  const { data } = await api.post("/properties", payload);
  return data.data;
};

// Update a property the agent owns
export const updateProperty = async (id, payload) => {
  const { data } = await api.patch(`/properties/${id}`, payload);
  return data.data;
};

// Delete a property the agent owns
export const deleteProperty = async (id) => {
  const { data } = await api.delete(`/properties/${id}`);
  return data.data;
};

// Create a copy of an owned property (starts as a draft)
export const duplicateProperty = async (id) => {
  const { data } = await api.post(`/properties/${id}/duplicate`);
  return data.data;
};

// Upload images for an owned property
export const uploadPropertyImages = async (propertyId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const { data } = await api.post(`/properties/${propertyId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
};

export default api;