import React from 'react';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
