import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { ROLE_DASHBOARDS } from '../utils/constants';

export const RoleRoute = ({ roles, allowedRoles, children }) => {
  const { user, isAuthenticated, switchRole } = useAuth();
  const location = useLocation();

  const allowedList = roles
    ? (Array.isArray(roles) ? roles : [roles])
    : (allowedRoles ? (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]) : ['buyer']);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAuthorized = user && allowedList.includes(user.role);

  if (!isAuthorized) {
    // If dev switchRole is available, show clear dev prompt, otherwise fallback
    if (switchRole) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-6 text-center shadow-xl">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
            <p className="text-slate-400 mb-6 text-sm">
              Your current role (<span className="text-amber-400 capitalize font-medium">{user?.role || 'unknown'}</span>) does not have permission to view this section.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => switchRole(allowedList[0] || 'buyer')}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 text-xs"
              >
                Switch to {allowedList[0] || 'buyer'} Role (Dev Test)
              </button>
              <Link
                to={user?.role && ROLE_DASHBOARDS ? (ROLE_DASHBOARDS[user.role] || '/login') : '/login'}
                className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition duration-200 text-xs"
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }
    const fallback = user && ROLE_DASHBOARDS ? (ROLE_DASHBOARDS[user.role] || '/login') : '/login';
    return <Navigate to={fallback} replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;
