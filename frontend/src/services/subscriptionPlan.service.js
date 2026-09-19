import api from './api';

export const getSubscriptionPlans = () =>
  api.get('/subscription-plans').then((r) => r.data.data);

export const getAdminSubscriptionPlans = () =>
  api.get('/admin/subscription-plans').then((r) => r.data.data);

export const createSubscriptionPlan = (payload) =>
  api.post('/admin/subscription-plans', payload).then((r) => r.data.data);

export const updateSubscriptionPlan = (id, payload) =>
  api.put(`/admin/subscription-plans/${id}`, payload).then((r) => r.data.data);

export const updateSubscriptionPlanStatus = (id, isActive) =>
  api.patch(`/admin/subscription-plans/${id}/status`, { is_active: isActive }).then((r) => r.data.data);

export const deleteSubscriptionPlan = (id) =>
  api.delete(`/admin/subscription-plans/${id}`).then((r) => r.data.data);