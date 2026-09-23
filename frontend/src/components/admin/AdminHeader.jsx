import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Bell } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import DashboardSearch from '../common/DashboardSearch';
import UserDropdown from '../common/UserDropdown';
import LanguageSwitcher from '../common/LanguageSwitcher';

const titleMap = {
  '/admin': 'header_title_dashboard',
  '/admin/visits': 'header_title_visit_requests',
  '/admin/agents': 'header_title_agent_approval',
  '/admin/categories': 'header_title_category_management',
  '/admin/properties': 'header_title_property_management',
  '/admin/users': 'header_title_user_management',
  '/admin/reports': 'header_title_reports',
  '/admin/analytics': 'header_title_analytics',
  '/admin/profile': 'header_title_profile',
  '/admin/settings': 'header_title_settings',
};

const AdminHeader = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const [prevPath, setPrevPath] = useState(location.pathname);

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
  }

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    t('role_admin');
  const title = t(titleMap[location.pathname] || 'header_title_dashboard');

  return (
    <header className="sticky top-0 z-30 h-[68px] bg-white border-b border-[#E5E7EB] px-5 flex items-center justify-between font-sans">
      {/* Left: menu + page title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          aria-label={t('header_open_menu')}
        >
          <Menu size={22} />
        </button>
        <h1 className="text-[19px] font-semibold text-[#111827] tracking-tight">{title}</h1>
      </div>

      {/* Center: search */}
      <div className="hidden md:flex items-center flex-1 max-w-[380px] mx-8">
        <DashboardSearch role="admin" />
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin')}
          className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-[#4A9FF5] transition cursor-pointer"
          title={t('header_notifications')}
          aria-label={t('header_notifications')}
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D96B67] rounded-full border-2 border-white" />
        </button>

        <LanguageSwitcher />

        <UserDropdown
          user={user}
          displayName={displayName}
          roleLabel={t('role_administrator')}
          onLogout={() => {
            logout();
            navigate(ROUTES.login);
          }}
        />
      </div>
    </header>
  );
};

export default AdminHeader;
