import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Building,
  Heart,
  Calendar,
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  Home
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/buyer', icon: LayoutDashboard, exact: true },
    { label: 'Browse Properties', path: '/buyer/properties', icon: Building },
    { label: 'Favorites', path: '/buyer/favorites', icon: Heart },
    { label: 'Scheduled Visits', path: '/buyer/visits', icon: Calendar },
    { label: 'Messages', path: '/buyer/messages', icon: MessageSquare },
    { label: 'Notifications', path: '/buyer/notifications', icon: Bell, badge: user?.unreadNotifications || 7 },
    { label: 'Profile', path: '/buyer/profile', icon: User },
    { label: 'Settings', path: '/buyer/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } shadow-2xl lg:shadow-none font-sans`}
    >
      {/* Top Header & Brand Logo */}
      <div>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/80">
          <Link to="/" className="flex items-center space-x-3 group" aria-label="NestHome home">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 flex items-center justify-center shadow-inner">
              <Home size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight leading-tight">NestHome</h1>
              <p className="text-[11px] text-slate-400 font-medium">Real Estate</p>
            </div>
          </Link>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Section Title */}
        <div className="px-6 pt-6 pb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Properties</span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-lg shadow-blue-900/40'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <item.icon size={19} className="transition-transform duration-200 group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded-full shadow-xs">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Area: Logout & User Info */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:bg-slate-800/80 hover:text-rose-400 transition-colors duration-200 cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        {/* User Mini Profile Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
          <img
            src={user?.profileImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
            alt={user?.name || user?.firstName || 'User Avatar'}
            className="w-10 h-10 rounded-full object-cover border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}</p>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-slate-400 truncate">Online</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
