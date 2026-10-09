import api from './api'

export const checkout = (planId) =>
  api
    .post('/subscriptions/checkout', { planId })
    .then((response) => response.data.data)

export const getCurrentSubscription = () =>
  api.get('/subscriptions/current').then((response) => response.data.data)