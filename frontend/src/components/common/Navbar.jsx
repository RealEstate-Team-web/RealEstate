import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/buyer':
      case '/buyer/':
        return 'Dashboard';
      case '/buyer/properties':
        return 'Browse Properties';
      case '/buyer/favorites':
        return 'My Favorites';
      case '/buyer/visits':
        return 'Scheduled Visits';
      case '/buyer/messages':
        return 'Messages';
      case '/buyer/notifications':
        return 'Notifications';
      case '/buyer/profile':
        return 'My Profile';
      case '/buyer/settings':
        return 'Settings';
      default:
        return 'Buyer Dashboard';
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 font-sans shadow-xs">
      {/* Left: Mobile Menu Toggle & Dynamic Page Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition lg:hidden cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search properties, clients, etc..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition duration-200"
          />
        </div>
      </div>

      {/* Right: Notification Icon & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button
          onClick={() => navigate('/buyer/notifications')}
          className="relative p-2.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer"
          title="Notifications"
        >
          <Bell size={20} />
          {user?.unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {user.unreadNotifications}
            </span>
          )}
        </button>

        {/* User Profile Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-3 p-1.5 pl-2.5 rounded-full hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
              alt={user?.name || user?.firstName || 'User'}
              className="w-9 h-9 rounded-full object-cover border border-slate-300 shadow-xs"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-snug">{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}</p>
              <p className="text-[11px] font-medium text-slate-500 capitalize">{user?.role || 'Buyer'}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {/* User Dropdown Overlay */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-sm font-bold text-slate-900">{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/buyer/profile');
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition"
                >
                  <User size={16} className="text-slate-400" />
                  <span>My Profile</span>
                </button>
              </div>

              <div className="py-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    navigate(ROUTES.login);
                  }}
                  className="w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-medium transition cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
