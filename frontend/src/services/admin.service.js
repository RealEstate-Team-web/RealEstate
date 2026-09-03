import api from './api';

export const getDashboardStats = () => api.get('/admin').then((r) => r.data.data);

export const getAnalytics = ({ range } = {}) =>
  api
    .get('/admin/analytics', { params: range ? { range } : {} })
    .then((r) => r.data.data);

export const getAgents = ({ status, q } = {}) =>
  api
    .get('/admin/agents', { params: { ...(status ? { status } : {}), ...(q ? { q } : {}) } })
    .then((r) => r.data.data);

export const approveAgent = (id) =>
  api.patch(`/admin/agents/${id}/approve`).then((r) => r.data.data);

export const rejectAgent = (id) =>
  api.patch(`/admin/agents/${id}/reject`).then((r) => r.data.data);

export const suspendAgent = (id) =>
  api.patch(`/admin/agents/${id}/suspend`).then((r) => r.data.data);

export const searchEntities = (q) =>
  api.get('/admin/search', { params: { q } }).then((r) => r.data.data);
