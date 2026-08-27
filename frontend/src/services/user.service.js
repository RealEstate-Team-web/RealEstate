import api from './api';

export const getAdminUsers = (params = {}) =>
  api.get('/admin/users', { params }).then((r) => ({
    users: r.data.data,
    pagination: r.data.pagination,
    stats: r.data.stats,
  }));

export const suspendUser = (id) =>
  api.patch(`/admin/users/${id}/suspend`).then((r) => r.data.data);

export const activateUser = (id) =>
  api.patch(`/admin/users/${id}/activate`).then((r) => r.data.data);
