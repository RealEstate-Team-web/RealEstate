import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AgentSidebar from '../../components/agent/AgentSidebar';
import AgentHeader from '../../components/agent/AgentHeader';

const AgentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex font-sans text-[#111827]">
      {/* Fixed Sidebar */}
      <AgentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:pl-[210px] flex flex-col flex-1 min-h-screen transition-all duration-300">
        <AgentHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
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

export default AgentLayout;
