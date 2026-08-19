import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { ROLE_DASHBOARDS } from '../utils/constants'

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROLE_DASHBOARDS[user.role] || '/'} replace />
  }

  return children
}

export default PublicRoute