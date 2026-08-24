import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { getDashboardStats } from '../../services/admin.service';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingAgents, setPendingAgents] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    getDashboardStats()
      .then((stats) => {
        if (active) setPendingAgents(stats?.pendingAgents ?? 0);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex font-sans text-[#111827]">
      {/* Fixed Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingAgents={pendingAgents}
      />

      {/* Main content */}
      <div className="lg:pl-[210px] flex flex-col flex-1 min-h-screen transition-all duration-300">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 px-5 py-5 lg:px-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AdminLayout;
