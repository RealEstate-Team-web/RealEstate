import { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  UserCircle,
  Settings,
  LogOut,
  ChevronDown,
  X,
  Home,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const primaryNavItems = [
  { label: 'Dashboard', path: ROUTES.agent, icon: LayoutDashboard, end: true, disabled: false },
];

const secondaryNavItems = [
  { label: 'Visit Requests', path: '/agent/visits', icon: CalendarCheck, disabled: true },
  { label: 'Customer Messages', path: '/agent/messages', icon: MessageSquare, disabled: true },
  { label: 'Analytics', path: '/agent/analytics', icon: BarChart3, disabled: true },
  { label: 'Profile', path: '/agent/profile', icon: UserCircle, disabled: false },
  { label: 'Settings', path: '/agent/settings', icon: Settings, disabled: true },
];

const propertySubLinks = [
  { label: 'All Properties', to: '/agent/properties', match: (location) => {
      const status = new URLSearchParams(location.search).get('status');
      return location.pathname === '/agent/properties' && status !== 'sold' && status !== 'rented';
    } },
  { label: 'Add Property', to: '/agent/properties/new', match: (location) => location.pathname === '/agent/properties/new' },
  { label: 'Sold / Rented', to: '/agent/properties?status=sold', match: (location) => {
      const status = new URLSearchParams(location.search).get('status');
      return status === 'sold' || status === 'rented';
    } },
];

const AgentSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [propertiesOpen, setPropertiesOpen] = useState(
    location.pathname.startsWith('/agent/properties'),
  );

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    'Agent';
  const roleLabel = 'Agent';

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.login);
  };

  const renderNavItem = (item) =>
    item.disabled ? (
      <span
        key={item.path}
        title="Coming soon"
        className="flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-[14px] text-slate-500 cursor-not-allowed select-none"
      >
        <div className="flex items-center space-x-3">
          <item.icon size={19} />
          <span>{item.label}</span>
        </div>
        <span className="text-[9px] uppercase tracking-wider text-slate-600 font-semibold">
          Soon
        </span>
      </span>
    ) : (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end}
        onClick={() => onClose && onClose()}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-[14px] transition-all duration-200 group ${
            isActive
              ? "bg-[#4A9FF5] text-white shadow-[0_4px_12px_rgba(74,159,245,0.35)]"
              : "text-slate-300 hover:bg-white/5 hover:text-white"
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <item.icon
            size={19}
            className="transition-transform duration-200 group-hover:scale-105"
          />
          <span>{item.label}</span>
        </div>
      </NavLink>
    );

  const groupActive = location.pathname.startsWith('/agent/properties');

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-[210px] bg-[#142238] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } font-sans`}
    >
      {/* Brand */}
      <div>
        <div className="flex items-center justify-between h-[68px] px-4 border-b border-white/5">
          <Link to="/" className="flex items-center space-x-2.5 group" aria-label="NestHome home">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 flex items-center justify-center shadow-inner">
                <Home size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg tracking-tight leading-tight">
                  NestHome
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">Agent</p>
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {primaryNavItems.map(renderNavItem)}

          {/* My Properties expandable group (right below Dashboard) */}
          <div>
            <button
              type="button"
              onClick={() => setPropertiesOpen(!propertiesOpen)}
              aria-expanded={propertiesOpen}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-[14px] transition-all duration-200 cursor-pointer ${
                groupActive
                  ? "bg-[#4A9FF5] text-white shadow-[0_4px_12px_rgba(74,159,245,0.35)]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building2 size={19} />
                <span>My Properties</span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${propertiesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {propertiesOpen && (
              <div className="mt-1 ml-7 space-y-1 border-l border-white/10 pl-3">
                {propertySubLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => onClose && onClose()}
                    className={() =>
                      `flex items-center px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                        link.match(location)
                          ? "text-[#4A9FF5]"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    <span className="truncate">{link.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {secondaryNavItems.map(renderNavItem)}
        </nav>
      </div>

      {/* Bottom profile card + logout */}
      <div className="p-3.5 space-y-2">
        <div className="bg-[#0f1b2e] border border-white/10 rounded-xl p-3 flex items-center space-x-3">
          <div className="relative">
            <img
              src={
                user?.profileImageUrl ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
              }
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#4FAF83] border-2 border-[#0f1b2e]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">{displayName}</p>
            <p className="text-[11px] text-slate-400 truncate">{roleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 h-[38px] rounded-lg bg-white/5 border border-white/10 text-[13px] font-medium text-slate-200 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AgentSidebar;