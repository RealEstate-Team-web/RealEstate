import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Search, Bell } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import UserDropdown from './UserDropdown';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    <header className="h-20 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 font-sans shadow-xs dark:bg-[#0E1626] dark:border-slate-800">
      {/* Left: Mobile Menu Toggle & Dynamic Page Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition lg:hidden cursor-pointer dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight dark:text-white">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search properties, clients, etc..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition duration-200 dark:bg-[#1E293B] dark:hover:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right: Notification Icon & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button
          onClick={() => navigate('/buyer/notifications')}
          className="relative p-2.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#4A9FF5]"
          title="Notifications"
        >
          <Bell size={20} />
          {user?.unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white dark:border-[#0E1626] shadow-xs">
              {user.unreadNotifications}
            </span>
          )}
        </button>

        {/* User Profile Dropdown Menu */}
        <UserDropdown
          user={user}
          roleLabel={user?.role || 'Buyer'}
          profilePath="/buyer/profile"
          onNavigate={navigate}
          onLogout={() => {
            logout();
            navigate(ROUTES.login);
          }}
        />
      </div>
    </header>
  );
};

export default Navbar;
