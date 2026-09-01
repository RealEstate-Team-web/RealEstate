import api from './api';

export const getDashboardStats = () => api.get('/admin').then((r) => r.data.data);

export const getAnalytics = ({ range } = {}) =>
  api
    .get('/admin/analytics', { params: range ? { range } : {} })
    .then((r) => r.data.data);

export const getAgents = (status) =>
  api
    .get('/admin/agents', { params: status ? { status } : {} })
    .then((r) => r.data.data);

export const approveAgent = (id) =>
  api.patch(`/admin/agents/${id}/approve`).then((r) => r.data.data);

export const rejectAgent = (id) =>
  api.patch(`/admin/agents/${id}/reject`).then((r) => r.data.data);

export const suspendAgent = (id) =>
  api.patch(`/admin/agents/${id}/suspend`).then((r) => r.data.data);
