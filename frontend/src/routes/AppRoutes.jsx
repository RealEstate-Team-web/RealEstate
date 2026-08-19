import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import DashboardLayout from '../layouts/DashboardLayout';

import Login from '../pages/auth/Login';
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
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Buyer Routes */}
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
      </Route>

      {/* Fallback Redirects */}
      <Route path="/dashboard" element={<Navigate to="/buyer" replace />} />
      <Route path="/" element={<Navigate to="/buyer" replace />} />
      <Route path="*" element={<Navigate to="/buyer" replace />} />
    </Routes>
  );
};

export default AppRoutes;
