import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home, LogOut } from "lucide-react";
import useAuth from "../../hooks/useAuth";
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  const dashboardPath = user ? (ROLE_DASHBOARDS[user.role] || "/") : "/";

  return (
    <header className="fixed left-0 top-0 z-[1000]  bg-white border-b border-border shadow-xs w-full">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-md bg-[#0F9690] flex items-center justify-center text-white shadow-xs">
            <Home className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold text-[17px] tracking-tight text-[#162831]">
            NestHome Real Estate
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
                    : "text-[#475569] hover:text-[#0F9690]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 hover:border-[#0F9690]/40 hover:shadow-sm transition-all"
                aria-label={`Open ${getUserName(user)} dashboard`}
              >
                <UserAvatar user={user} />
                <span className="text-[13px] font-semibold text-[#162831] max-w-[140px] truncate">
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
                className="text-[13px] font-medium text-[#475569] hover:text-[#0F9690] px-2 py-1 transition-colors"
              >
                Login
              </Link>
              <Link
                to={ROUTES.register}
                className="text-[13px] font-semibold text-[#E6A23C] border border-[#E6A23C] hover:bg-[#FEF3D6] px-4 py-1.5 rounded-md transition-colors shadow-xs"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#475569] hover:text-[#162831] rounded-md"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3 shadow-md">
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
                    : "text-[#475569] hover:text-[#0F9690]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 w-full text-left text-[14px] font-semibold text-[#162831] border border-slate-200 py-2 px-3 rounded-md hover:border-[#0F9690]/40 hover:bg-slate-50 transition-colors"
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
                  className="w-full text-center text-[14px] font-medium text-[#475569] border border-border py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.register}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center text-[14px] font-semibold text-[#E6A23C] border border-[#E6A23C] bg-[#FEF3D6] py-2 rounded-md"
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