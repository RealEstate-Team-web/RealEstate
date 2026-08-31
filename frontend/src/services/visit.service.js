import api from './api';

export const getVisits = (params = {}) =>
  api.get('/visits', { params }).then((r) => r.data);

export const bookVisit = (payload) =>
  api.post('/visits', payload).then((r) => r.data.data);

export const cancelVisit = (visitId) =>
  api.patch(`/visits/${visitId}/cancel`).then((r) => r.data.data);

export const rescheduleVisit = (visitId, payload) =>
  api.patch(`/visits/${visitId}/reschedule`, payload).then((r) => r.data.data);

export default {
  getVisits,
  bookVisit,
  cancelVisit,
  rescheduleVisit,
};
