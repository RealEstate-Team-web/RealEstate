import api from "./api";

// Get approved agents for the public site
export const getPublicAgents = async (limit = 30) => {
  const { data } = await api.get("/agents", {
    params: { limit },
  });

  return {
    agents: Array.isArray(data?.data?.agents) ? data.data.agents : [],
    total: data?.data?.total ?? 0,
  };
};

export default api;