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

export const getProfile = () =>
  api.get('/profile').then((r) => r.data.data.user);

export const updateProfile = ({ firstName, lastName, phone }) =>
  api
    .put('/profile', { firstName, lastName, phone })
    .then((r) => r.data.data.user);

export const uploadProfileImage = (image) => {
  const formData = new FormData();
  formData.append('image', image);
  return api
    .post('/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data.data.user);
};
