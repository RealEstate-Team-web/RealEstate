import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Moon, Sun } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { ROLE_DASHBOARDS, ROUTES } from "../../utils/constants";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/properties", label: "Properties" },
  { to: "/agents", label: "Agents" },
  { to: "/contact", label: "Contact Us" },
];

const getUserName = (user) => {
  if (!user) return "";

  const full = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return full || user.name || user.fullName || user.email || "Account";
};

const getUserInitial = (user) => {
  const name = getUserName(user);
  return (name?.charAt(0) || "A").toUpperCase();
};

const UserAvatar = ({ user, size = "sm" }) => {
  const dimension =
    size === "sm" ? "h-8 w-8 text-[12px]" : "h-10 w-10 text-sm";
  const photo = user?.profileImageUrl || user?.profile_image_url;

  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        aria-hidden="true"
        className={`${dimension} shrink-0 rounded-full object-cover border border-slate-200`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`${dimension} shrink-0 rounded-full border border-[#0F9690] bg-[#E8F7F5] flex items-center justify-center font-extrabold text-[#0F9690]`}
    >
      {getUserInitial(user)}
    </div>
  );
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  const dashboardPath = user ? (ROLE_DASHBOARDS[user.role] || "/") : "/";

  return (
    <header className="fixed left-0 top-0 z-[1000] bg-white border-b border-border shadow-xs w-full dark:bg-[#0F172A] dark:border-slate-800">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo.png"
            alt="ቤትኛ (Betnya) logo"
            className="w-9 h-9 rounded-md object-contain"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-bold text-[17px] tracking-tight text-[#162831] dark:text-white">
              ቤትኛ (Betnya)
            </span>
            <span className="text-[10px] font-medium tracking-wide text-[#647983] dark:text-slate-400">
              ይጎብኙ፣ ይምረጡ፣ ይግዙ
            </span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-[14px] font-medium transition-colors ${
                  isActive
                    ? "text-[#0F9690] font-semibold"
                    : "text-[#475569] hover:text-[#0F9690] dark:text-slate-300 dark:hover:text-[#0F9690]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#475569] transition-colors hover:border-[#0F9690]/40 hover:text-[#0F9690] dark:border-slate-700 dark:bg-[#1F2937] dark:text-slate-300 cursor-pointer"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 hover:border-[#0F9690]/40 hover:shadow-sm transition-all dark:border-slate-700 dark:bg-[#1E293B]"
                aria-label={`Open ${getUserName(user)} dashboard`}
              >
                <UserAvatar user={user} />
                <span className="text-[13px] font-semibold text-[#162831] max-w-[140px] truncate dark:text-white">
                  {getUserName(user)}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#0F9690] px-3.5 py-1.5 rounded-md hover:bg-[#0D827D] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.login}
                className="text-[13px] font-medium text-[#475569] hover:text-[#0F9690] px-2 py-1 transition-colors dark:text-slate-300"
              >
                Login
              </Link>
              <Link
                to={ROUTES.register}
                className="text-[13px] font-semibold text-[#E6A23C] border border-[#E6A23C] hover:bg-[#FEF3D6] px-4 py-1.5 rounded-md transition-colors shadow-xs dark:hover:bg-[#E6A23C]/10"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-[#475569] hover:text-[#162831] rounded-md dark:text-slate-300 dark:hover:text-white cursor-pointer"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#475569] hover:text-[#162831] rounded-md dark:text-slate-300 dark:hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3 shadow-md dark:bg-[#0F172A] dark:border-slate-800">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block text-[14px] font-medium py-1.5 transition-colors ${
                  isActive
                    ? "text-[#0F9690] font-semibold"
                    : "text-[#475569] hover:text-[#0F9690] dark:text-slate-300 dark:hover:text-[#0F9690]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2 dark:border-slate-800">
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 w-full text-left text-[14px] font-semibold text-[#162831] border border-slate-200 py-2 px-3 rounded-md hover:border-[#0F9690]/40 hover:bg-slate-50 transition-colors dark:text-white dark:border-slate-700 dark:bg-[#1E293B] dark:hover:bg-[#1E293B]"
                >
                  <UserAvatar user={user} size="sm" />
                  <span className="min-w-0 truncate">{getUserName(user)}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center text-[14px] font-semibold text-white bg-[#0F9690] py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.login}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center text-[14px] font-medium text-[#475569] border border-border py-2 rounded-md dark:text-slate-300 dark:border-slate-700"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.register}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center text-[14px] font-semibold text-[#E6A23C] border border-[#E6A23C] bg-[#FEF3D6] py-2 rounded-md dark:bg-[#E6A23C]/10"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;