import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Search, Bell } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import UserDropdown from './UserDropdown';
import LanguageSwitcher from './LanguageSwitcher';

const PAGE_TITLE_KEYS = {
  '/buyer': 'title_dashboard',
  '/buyer/': 'title_dashboard',
  '/buyer/properties': 'title_browse',
  '/buyer/favorites': 'title_favorites',
  '/buyer/visits': 'title_visits',
  '/buyer/messages': 'title_messages',
  '/buyer/notifications': 'title_notifications',
  '/buyer/profile': 'title_profile',
  '/buyer/settings': 'title_settings',
};

export const Navbar = ({ onToggleSidebar }) => {
  const { t } = useTranslation('buyer');
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname) => {
    const normalized = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
    return t(PAGE_TITLE_KEYS[normalized] || 'title_buyer_dashboard');
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 font-sans shadow-xs">
      {/* Left: Mobile Menu Toggle & Dynamic Page Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition lg:hidden cursor-pointer"
          aria-label={t('navbar_open_menu')}
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
            placeholder={t('navbar_search_placeholder')}
            className="w-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition duration-200"
          />
        </div>
      </div>

      {/* Right: Language Switcher, Notification Icon & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/buyer/notifications')}
          className="relative p-2.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer"
          title={t('navbar_notifications')}
        >
          <Bell size={20} />
          {user?.unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
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
