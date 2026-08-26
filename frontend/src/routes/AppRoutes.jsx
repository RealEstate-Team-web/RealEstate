import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import RegisterAgent from '../pages/auth/RegisterAgent';
import CompleteAgentProfile from '../pages/auth/CompleteAgentProfile';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import RolePlaceholder from '../components/RolePlaceholder';

import DashboardLayout from '../hooks/layouts/DashboardLayout';
import Dashboard from '../pages/buyer/Dashboard';
import BrowseProperties from '../pages/buyer/BrowseProperties';
import Favorites from '../pages/buyer/Favorites';
import ScheduledVisits from '../pages/buyer/ScheduledVisits';
import Messages from '../pages/buyer/Messages';
import Notifications from '../pages/buyer/Notifications';
import Profile from '../pages/buyer/Profile';
import Settings from '../pages/buyer/Settings';

import AdminLayout from '../hooks/layouts/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import Agents from '../pages/admin/Agents';
import Categories from '../pages/admin/Categories';
import Users from '../pages/admin/Users';
import { ROUTES } from '../utils/constants';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes wrapped in PublicRoute */}
      <Route
        path={ROUTES.login}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.register}
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.registerAgent}
        element={
          <PublicRoute>
            <RegisterAgent />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.forgotPassword}
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.resetPassword}
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Protected Agent Complete Profile Route */}
      <Route
        path={ROUTES.completeAgentProfile}
        element={
          <PrivateRoute>
            <RoleRoute roles="agent">
              <CompleteAgentProfile />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Protected Buyer Routes Shell */}
      <Route element={<PrivateRoute />}>
        <Route element={<RoleRoute roles="buyer" />}>
          <Route path={ROUTES.buyer} element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<BrowseProperties />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="visits" element={<ScheduledVisits />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Agent Module placeholder (built separately) */}
        <Route
          path={`${ROUTES.agent}/*`}
          element={
            <RoleRoute roles="agent">
              <RolePlaceholder />
            </RoleRoute>
          }
        />

        {/* Admin Module */}
        <Route element={<RoleRoute roles="admin" />}>
          <Route path={ROUTES.admin} element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="agents" element={<Agents />} />
            <Route path="categories" element={<Categories />} />
            <Route path="users" element={<Users />} />
            <Route path="*" element={<Navigate to={ROUTES.admin} replace />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback Redirects */}
      <Route path="/" element={<Navigate to={ROUTES.login} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
};

export default AppRoutes;
