import api from "./api";

// Get landing page data
export const getLanding = async () => {
  const { data } = await api.get("/landing");
  return data.data;
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

export default api;