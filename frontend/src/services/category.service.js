import api from './api';

export const getCategories = () => api.get('/categories').then((r) => r.data.data);

export const getAdminCategories = () =>
  api.get('/admin/categories').then((r) => r.data.data);

export const createCategory = (payload) =>
  api.post('/admin/categories', payload).then((r) => r.data.data);

export const updateCategory = (id, payload) =>
  api.put(`/admin/categories/${id}`, payload).then((r) => r.data.data);

export const deleteCategory = (id) =>
  api.delete(`/admin/categories/${id}`).then((r) => r.data.data);
