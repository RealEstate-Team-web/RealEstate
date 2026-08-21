import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROLE_DASHBOARDS, ROUTES } from '../utils/constants';

export const RoleRoute = ({ roles, allowedRoles, children }) => {
  const { user } = useAuth();
  const allowed = roles
    ? (Array.isArray(roles) ? roles : [roles])
    : (allowedRoles ? (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]) : ['buyer']);

  if (!user || !allowed.includes(user.role)) {
    const fallback = user && ROLE_DASHBOARDS[user.role] ? ROLE_DASHBOARDS[user.role] : ROUTES.login;
    return <Navigate to={fallback} replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;
