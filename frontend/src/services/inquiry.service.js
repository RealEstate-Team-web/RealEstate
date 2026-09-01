import api from './api';

export const getInquiries = (params = {}) =>
  api.get('/inquiries', { params }).then((r) => r.data);

export const getInquiryById = (id) =>
  api.get(`/inquiries/${id}`).then((r) => r.data.data);

export const submitInquiry = (payload) =>
  api.post('/inquiries', payload).then((r) => r.data.data);

export const replyToInquiry = (inquiryId, message) =>
  api.post(`/inquiries/${inquiryId}/messages`, { message }).then((r) => r.data.data);

export const getAgentInquiries = (params = {}) =>
  api.get('/inquiries/agent/received', { params }).then((r) => r.data);

export const markInquiryRead = (id) =>
  api.patch(`/inquiries/${id}/read`).then((r) => r.data.data);

export default {
  getInquiries,
  getInquiryById,
  submitInquiry,
  replyToInquiry,
  getAgentInquiries,
  markInquiryRead,
};
