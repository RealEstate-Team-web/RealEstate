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

// Get dashboard KPIs for the authenticated agent
export const getAgentDashboardStats = async () => {
  const { data } = await api.get("/agent/dashboard");

  return data.data;
};

// Get the authenticated agent's profile (user fields + agent_profiles fields)
export const getAgentProfile = async () => {
  const { data } = await api.get("/agent/profile");
  return data?.data?.profile ?? null;
};

// Update the authenticated agent's profile
export const updateAgentProfile = async (payload) => {
  const { data } = await api.put("/agent/profile", payload);
  return data?.data?.profile ?? null;
};

// Get analytics summary for the authenticated agent
export const getAgentAnalytics = async () => {
  const { data } = await api.get("/agent/analytics");
  return data?.data ?? null;
};