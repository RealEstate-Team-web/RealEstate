import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { ROLE_DASHBOARDS } from '../utils/constants'

const RoleRoute = ({ roles, children }) => {
  const { user } = useAuth()
  const allowed = Array.isArray(roles) ? roles : [roles]

  if (!user || !allowed.includes(user.role)) {
    const fallback = user ? ROLE_DASHBOARDS[user.role] : '/login'
    return <Navigate to={fallback} replace />
  }

  return children
}

export default RoleRoute