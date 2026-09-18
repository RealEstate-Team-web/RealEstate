import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Bell, Search } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { getAgentInquiries } from '../../services/inquiry.service';
import { getAgentVisitRequests } from '../../services/visit.service';
import UserDropdown from '../common/UserDropdown';

const titleMap = {
  '/agent': 'Dashboard',
  '/agent/profile': 'Profile',
  '/agent/settings': 'Settings',
  '/agent/notifications': 'Notifications',
  '/agent/properties': 'My Properties',
  '/agent/properties/new': 'Add Property',
  '/agent/visits': 'Visit Requests',
  '/agent/messages': 'Customer Messages',
  '/agent/analytics': 'Analytics',
};

const getTitle = (pathname) => {
  if (pathname.startsWith('/agent/properties/edit')) return 'Edit Property';
  return titleMap[pathname] || 'Dashboard';
};

const AgentHeader = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [prevPath, setPrevPath] = useState(location.pathname);
  const searchFromUrl =
    new URLSearchParams(location.search).get('search') || '';
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([getAgentInquiries({ status: 'pending', page: 1, limit: 50 }), getAgentVisitRequests({ status: 'pending' })])
      .then(([inquiryRes, visitRes]) => {
        if (!active) return;
        const inquiryTotal = Number.isFinite(inquiryRes?.pagination?.total) ? inquiryRes.pagination.total : 0;
        const visitTotal = Number.isFinite(visitRes?.pagination?.total) ? visitRes.pagination.total : 0;
        const inquiryCount = inquiryTotal || (Array.isArray(inquiryRes?.data) ? inquiryRes.data.length : 0);
        const visitCount = visitTotal || (Array.isArray(visitRes?.data) ? visitRes.data.length : 0);
        setUnreadCount(inquiryCount + visitCount);
      })
      .catch(() => {
        if (active) setUnreadCount(0);
      });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
  }

  if (prevSearchFromUrl !== searchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl);
    setSearchQuery(searchFromUrl);
  }

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    'Agent';
  const title = getTitle(location.pathname);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();

    const isPropertiesRoute = location.pathname === ROUTES.agentProperties;
    const params = new URLSearchParams();
    if (isPropertiesRoute) {
      const status = new URLSearchParams(location.search).get('status');
      if (status) params.set('status', status);
    }
    if (q) params.set('search', q);

    const query = params.toString();
    navigate(query ? `${ROUTES.agentProperties}?${query}` : ROUTES.agentProperties);
  };

  return (
    <header className="sticky top-0 z-30 h-[68px] bg-white border-b border-[#E5E7EB] px-5 flex items-center justify-between gap-4 font-sans dark:bg-[#0E1626] dark:border-slate-800">
      {/* Left: menu + page title */}
      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-[19px] font-semibold text-[#111827] tracking-tight dark:text-white">{title}</h1>
      </div>

      {/* Search (hidden on small screens) */}
      {location.pathname !== ROUTES.agentProperties && (
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xs items-center bg-[#F3F4F6] border border-transparent focus-within:border-[#4A9FF5] focus-within:bg-white rounded-full px-3.5 h-9 transition dark:bg-[#1E293B] dark:focus-within:bg-[#1E293B]"
        >
          <button
            type="submit"
            aria-label="Submit property search"
            className="shrink-0 text-slate-400 hover:text-[#4A9FF5] transition cursor-pointer dark:text-slate-500"
          >
            <Search size={16} />
          </button>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search my properties..."
            aria-label="Search my properties"
            className="w-full ml-2 bg-transparent text-[13px] text-[#111827] placeholder:text-slate-400 outline-none dark:text-white dark:placeholder:text-slate-500"
          />
        </form>
      )}

      {/* Right: notifications + user */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(ROUTES.agentNotifications)}
          className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-[#4A9FF5] transition cursor-pointer dark:text-slate-400 dark:hover:bg-slate-800"
          title="Notifications"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-[#D96B67] text-white text-[9px] font-bold rounded-full border-2 border-white dark:border-[#0E1626] flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <UserDropdown
          user={user}
          displayName={displayName}
          roleLabel="Agent"
          onLogout={() => {
            logout();
            navigate(ROUTES.login);
          }}
        />
      </div>
    </header>
  );
};

export default AgentHeader;
