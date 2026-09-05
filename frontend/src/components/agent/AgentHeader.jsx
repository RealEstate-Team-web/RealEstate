import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Bell, ChevronDown, LogOut, Search } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const titleMap = {
  '/agent': 'Dashboard',
  '/agent/profile': 'Profile',
  '/agent/settings': 'Settings',
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
  const [open, setOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const searchFromUrl =
    new URLSearchParams(location.search).get('search') || '';
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl);
  const dropdownRef = useRef(null);

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setOpen(false);
  }

  if (prevSearchFromUrl !== searchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl);
    setSearchQuery(searchFromUrl);
  }

  useEffect(() => {
    if (!open) return undefined;
    const handleMouseDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    'Agent';
  const title = getTitle(location.pathname);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();

    const params = new URLSearchParams(location.search);
    params.delete('search');
    params.delete('page');
    if (q) params.set('search', q);

    const query = params.toString();
    navigate(query ? `${ROUTES.agentProperties}?${query}` : ROUTES.agentProperties);
  };

  return (
    <header className="sticky top-0 z-30 h-[68px] bg-white border-b border-[#E5E7EB] px-5 flex items-center justify-between gap-4 font-sans">
      {/* Left: menu + page title */}
      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-[19px] font-semibold text-[#111827] tracking-tight">{title}</h1>
      </div>

      {/* Search (hidden on small screens) */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex flex-1 max-w-xs items-center bg-[#F3F4F6] border border-transparent focus-within:border-[#4A9FF5] focus-within:bg-white rounded-full px-3.5 h-9 transition"
      >
        <button
          type="submit"
          aria-label="Submit property search"
          className="shrink-0 text-slate-400 hover:text-[#4A9FF5] transition cursor-pointer"
        >
          <Search size={16} />
        </button>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search my properties..."
          aria-label="Search my properties"
          className="w-full ml-2 bg-transparent text-[13px] text-[#111827] placeholder:text-slate-400 outline-none"
        />
      </form>

      {/* Right: notifications + user */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(ROUTES.agent)}
          className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-[#4A9FF5] transition cursor-pointer"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D96B67] rounded-full border-2 border-white" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-2.5 p-1.5 pl-2 rounded-full hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
          >
            <img
              src={user?.profileImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-[12px] font-semibold text-[#111827] truncate max-w-[110px]">{displayName}</p>
              <p className="text-[11px] text-slate-500">Agent</p>
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

export default AgentHeader;
