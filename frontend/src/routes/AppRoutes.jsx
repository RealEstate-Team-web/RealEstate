import React from 'react';
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

import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/buyer/Dashboard';
import BrowseProperties from '../pages/buyer/BrowseProperties';
import Favorites from '../pages/buyer/Favorites';
import ScheduledVisits from '../pages/buyer/ScheduledVisits';
import Messages from '../pages/buyer/Messages';
import Notifications from '../pages/buyer/Notifications';
import Profile from '../pages/buyer/Profile';
import Settings from '../pages/buyer/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-agent" element={<RegisterAgent />} />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Protected Agent Complete Profile Route */}
      <Route
        path="/complete-agent-profile"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['agent']}>
              <CompleteAgentProfile />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Protected Buyer Routes (Developer 3) */}
      <Route element={<PrivateRoute />}>
        <Route element={<RoleRoute allowedRoles={['buyer']} />}>
          <Route path="/buyer" element={<DashboardLayout />}>
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

        {/* Placeholders for Agent & Admin Modules */}
        <Route
          path="/agent/*"
          element={
            <RoleRoute allowedRoles={['agent']}>
              <RolePlaceholder />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <RoleRoute allowedRoles={['admin']}>
              <RolePlaceholder />
            </RoleRoute>
          }
        />
      </Route>

      {/* Fallback Redirects */}
      <Route path="/dashboard" element={<Navigate to="/buyer" replace />} />
      <Route path="/" element={<Navigate to="/buyer" replace />} />
      <Route path="*" element={<Navigate to="/buyer" replace />} />
    </Routes>
  );
};

export default AppRoutes;
