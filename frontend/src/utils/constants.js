export const ROLE_DASHBOARDS = {
  buyer: '/buyer',
  agent: '/agent',
  admin: '/admin',
}

export const STORAGE_KEY = 'auth_token'

export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const ROUTES = {
  login: '/login',
  register: '/register',
  registerAgent: '/register-agent',
  completeAgentProfile: '/agent/complete-profile',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  buyer: '/buyer',
  agent: '/agent',
  admin: '/admin',
}