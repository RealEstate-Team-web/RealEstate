import api, { STORAGE_KEY } from './api'

const toUser = (payload) => (payload.data ? payload.data.user : payload.user)

const register = async ({ firstName, lastName, email, phone, password, role }) => {
  const { data } = await api.post('/auth/register', {
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
  })
  const user = toUser(data)
  if (data.token) {
    localStorage.setItem(STORAGE_KEY, data.token)
    return { token: data.token, user }
  }
  return { user }
}

const registerAgent = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  agencyName,
  licenseNumber,
  experience,
}) => {
  const { data } = await api.post('/auth/register-agent', {
    firstName,
    lastName,
    email,
    phone,
    password,
    agencyName,
    licenseNumber,
    experience,
  })
  return { user: toUser(data) }
}

const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password })
  const result = data.data
  localStorage.setItem(STORAGE_KEY, result.token)
  return { token: result.token, user: result.user }
}

const logout = async () => {
  try {
    await api.post('/auth/logout')
  } finally {
    localStorage.removeItem(STORAGE_KEY)
  }
}

const getMe = async () => {
  const { data } = await api.get('/auth/me')
  return { user: data.data.user }
}

const completeAgentProfile = async ({
  agencyName,
  licenseNumber,
  experience,
  officeAddress,
  bio,
  profilePhoto,
}) => {
  const formData = new FormData()
  formData.append('agencyName', agencyName)
  formData.append('licenseNumber', licenseNumber)
  formData.append('experience', String(experience))
  formData.append('officeAddress', officeAddress)
  formData.append('bio', bio)
  if (profilePhoto) {
    formData.append('profilePhoto', profilePhoto)
  }

  const { data } = await api.post('/auth/complete-agent-profile', formData)
  return { user: data.user }
}

const requestPasswordReset = (email) =>
  api
    .post('/auth/forgot-password', { email })
    .then((r) => r.data)

const resetPassword = (token, password) =>
  api
    .post('/auth/reset-password', { token, password })
    .then((r) => r.data)

const changePassword = ({ currentPassword, newPassword }) =>
  api
    .put('/auth/change-password', { currentPassword, newPassword })
    .then((r) => r.data)

const authService = {
  register,
  registerAgent,
  login,
  logout,
  getMe,
  completeAgentProfile,
  requestPasswordReset,
  resetPassword,
  changePassword,
}

export default authService