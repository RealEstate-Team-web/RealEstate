import { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  CreditCard,
  UserCircle,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  X,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { useAgentListingPermission } from '../../hooks/useAgentListingPermission';
import ApprovalRequiredModal from './ApprovalRequiredModal';

const primaryNavItems = [
  { labelKey: 'sidebar_dashboard', path: ROUTES.agent, icon: LayoutDashboard, end: true, disabled: false },
];

const secondaryNavItems = [
  { labelKey: 'sidebar_notifications', path: ROUTES.agentNotifications, icon: Bell, disabled: false },
  { labelKey: 'sidebar_visit_requests', path: ROUTES.agentVisits, icon: CalendarCheck, disabled: false },
  { labelKey: 'sidebar_customer_messages', path: ROUTES.agentMessages, icon: MessageSquare, disabled: false },
  { labelKey: 'sidebar_analytics', path: ROUTES.agentAnalytics, icon: BarChart3, disabled: false },
  { labelKey: 'sidebar_subscription', path: ROUTES.agentSubscription, icon: CreditCard, disabled: false },
  { labelKey: 'sidebar_profile', path: ROUTES.agentProfile, icon: UserCircle, disabled: false },
  { labelKey: 'sidebar_settings', path: ROUTES.agentSettings, icon: Settings, disabled: false },
];

const propertySubLinks = [
  { labelKey: 'sidebar_all_properties', to: '/agent/properties', match: (location) => {
      const status = new URLSearchParams(location.search).get('status');
      return location.pathname === '/agent/properties' && status !== 'sold' && status !== 'rented';
    } },
  { labelKey: 'sidebar_add_property', to: '/agent/properties/new', match: (location) => location.pathname === '/agent/properties/new' },
  { labelKey: 'sidebar_sold_rented', to: '/agent/properties?status=sold', match: (location) => {
      const status = new URLSearchParams(location.search).get('status');
      return status === 'sold' || status === 'rented';
    } },
];

const AgentSidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation('agents');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { canListProperties, agentStatus } = useAgentListingPermission();
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(
    location.pathname.startsWith('/agent/properties'),
  );

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    t('sidebar_agent');
  const roleLabel = t('sidebar_agent');

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
          <span>{t(item.labelKey)}</span>
        </div>
        <span className="text-[9px] uppercase tracking-wider text-slate-600 font-semibold">
          {t('sidebar_soon')}
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
           <span>{t(item.labelKey)}</span>
         </div>
      </NavLink>
    );

  const groupActive = location.pathname.startsWith('/agent/properties');

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[210px] bg-[#142238] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } font-sans`}
      >
      {/* Brand */}
      <div>
        <div className="flex items-center justify-between h-[68px] px-4 border-b border-white/5">
          <Link to="/" className="flex items-center space-x-2.5 group" aria-label="ቤትኛ (Betnya) home">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl border border-slate-700 flex items-center justify-center shadow-inner p-0.5">
                <img
                  src="/logo.png"
                  alt="ቤትኛ (Betnya) logo"
                  className="h-full w-full rounded-lg object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg tracking-tight leading-tight">
                  ቤትኛ (Betnya)
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
                 <span>{t('sidebar_my_properties')}</span>
               </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${propertiesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {propertiesOpen && (
              <div className="mt-1 ml-7 space-y-1 border-l border-white/10 pl-3">
                {propertySubLinks.map((link) =>
                  link.to === '/agent/properties/new' && !canListProperties ? (
                    <button
                      key={link.to}
                      type="button"
                      onClick={() => setShowApprovalModal(true)}
                      className={`w-full text-left flex items-center px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                        link.match(location)
                          ? 'text-[#4A9FF5]'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{t(link.labelKey)}</span>
                    </button>
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => onClose && onClose()}
                      className={() =>
                        `flex items-center px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                          link.match(location)
                            ? 'text-[#4A9FF5]'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      <span className="truncate">{t(link.labelKey)}</span>
                    </NavLink>
                  ),
                )}
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
          {t('sidebar_logout')}
        </button>
      </div>
      </aside>

      <ApprovalRequiredModal
        open={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        agentStatus={agentStatus}
      />
    </>
  );
};

export default AgentSidebar;