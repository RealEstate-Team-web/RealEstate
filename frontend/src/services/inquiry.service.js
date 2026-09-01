import api from './api';

// Returns full response envelope with pagination metadata: { success: true, data: [...], pagination: { ... } }
export const getInquiries = (params = {}) =>
  api.get('/inquiries', { params }).then((r) => r.data);

// Returns unwrapped single inquiry object with full message history: data.data
export const getInquiryById = (id) =>
  api.get(`/inquiries/${id}`).then((r) => r.data.data);

// Returns unwrapped created inquiry record: data.data
export const submitInquiry = (payload) =>
  api.post('/inquiries', payload).then((r) => r.data.data);

// Returns unwrapped refreshed inquiry record with new message: data.data
export const replyToInquiry = (inquiryId, message) =>
  api.post(`/inquiries/${inquiryId}/messages`, { message }).then((r) => r.data.data);

// Returns full response envelope with pagination metadata for agent inquiries: { success: true, data: [...], pagination: { ... } }
export const getAgentInquiries = (params = {}) =>
  api.get('/agent/inquiries', { params }).then((r) => r.data);

// Returns unwrapped affected rows count or status: data.data
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
