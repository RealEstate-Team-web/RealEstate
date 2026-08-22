import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const titleMap = {
  '/admin': 'Dashboard',
  '/admin/visits': 'Visit Requests',
  '/admin/agents': 'Agent Approval',
  '/admin/properties': 'Property Management',
  '/admin/users': 'User Management',
  '/admin/reports': 'Reports',
  '/admin/analytics': 'Analytics',
  '/admin/profile': 'Profile',
  '/admin/settings': 'Settings',
};

const AdminHeader = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    'Admin';
  const title = titleMap[location.pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-[68px] bg-white border-b border-[#E5E7EB] px-5 flex items-center justify-between font-sans">
      {/* Left: menu + page title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-[19px] font-semibold text-[#111827] tracking-tight">{title}</h1>
      </div>

      {/* Center: search */}
      <div className="hidden md:flex items-center flex-1 max-w-[380px] mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search properties, clients, etc..."
            className="w-full bg-[#F5F5FA] border border-[#E5E7EB] focus:border-[#4A9FF5] focus:bg-white rounded-lg py-2.5 pl-10 pr-4 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin')}
          className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-[#4A9FF5] transition cursor-pointer"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D96B67] rounded-full border-2 border-white" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-2.5 p-1.5 pl-2 rounded-full hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-[12px] font-semibold text-[#111827] truncate max-w-[110px]">Admin</p>
              <p className="text-[11px] text-slate-500">Administrator</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-lg py-2 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-[13px] font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate(ROUTES.login);
                }}
                className="w-full px-4 py-2 text-[13px] text-[#D96B67] hover:bg-rose-50 flex items-center space-x-2 font-medium transition cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
