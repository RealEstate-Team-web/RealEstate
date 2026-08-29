import api from './api';

export const getFavorites = () =>
  api.get('/favorites').then((r) => r.data.data);

export const addFavorite = (propertyId) =>
  api.post('/favorites', { propertyId }).then((r) => r.data.data);

export const removeFavorite = (propertyId) =>
  api.delete(`/favorites/${propertyId}`).then((r) => r.data.data);

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
};
