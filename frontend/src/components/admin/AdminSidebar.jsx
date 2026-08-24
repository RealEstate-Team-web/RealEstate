import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  ShieldCheck,
  Tag,
  X,
  Home,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  {
    label: 'Agent Approval',
    path: '/admin/agents',
    icon: ShieldCheck,
    badgeKey: 'pendingAgents',
    badgeColor: 'bg-[#E7B85A]',
  },
  { label: 'Categories', path: '/admin/categories', icon: Tag },
];

const AdminSidebar = ({ isOpen, onClose, pendingAgents = 0 }) => {
  const { user } = useAuth();
  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    'Admin';
  const isAdmin = user?.role === 'admin';
  const roleLabel = isAdmin ? 'System Administrator' : user?.role || 'User';

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-[210px] bg-[#142238] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } font-sans`}
    >
      {/* Brand */}
      <div>
        <div className="flex items-center justify-between h-[68px] px-4 border-b border-white/5">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 flex items-center justify-center shadow-inner">
                <Home size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg tracking-tight leading-tight">
                  NestHome
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">
                  Real Estate
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
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
              <div className="flex items-center">
                {item.badgeKey === 'pendingAgents' && pendingAgents > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[11px] font-bold text-white rounded-full ${item.badgeColor}`}
                  >
                    {pendingAgents}
                  </span>
                )}
                {item.dot && (
                  <span className={`w-2 h-2 rounded-full ${item.badgeColor}`} />
                )}
                {item.pill && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold text-white rounded-full ${item.pillColor}`}
                  >
                    {item.pill}
                  </span>
                )}
              </div>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom profile card */}
      <div className="p-3.5">
        <div className="bg-[#0f1b2e] border border-white/10 rounded-xl p-3 flex items-center space-x-3">
          <div className="relative">
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
              }
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#4FAF83] border-2 border-[#0f1b2e]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{roleLabel}</p>
            <div className="flex items-center gap-1 mt-0.5">
             
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
