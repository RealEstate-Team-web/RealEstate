import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200';

const UserDropdown = ({ user, displayName, roleLabel, onLogout, profilePath, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const name =
    displayName ||
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    roleLabel ||
    'User';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2.5 p-1.5 pl-2 rounded-full hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-700"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={user?.profileImageUrl || DEFAULT_AVATAR}
          alt={name}
          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
        />
        <div className="hidden sm:block text-left leading-tight">
          <p className="text-[12px] font-semibold text-[#111827] truncate max-w-[110px] dark:text-white">{name}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{roleLabel}</p>
        </div>
        <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-lg py-2 z-50 dark:bg-[#111827] dark:border-slate-800">
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[13px] font-bold text-slate-900 truncate dark:text-white">{name}</p>
            <p className="text-[11px] text-slate-500 truncate dark:text-slate-400">{user?.email}</p>
          </div>
          {profilePath && (
            <div className="mt-1 border-t border-slate-100 pt-1 dark:border-slate-800">
              <button
                onClick={() => {
                  onNavigate?.(profilePath);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <User size={16} className="text-slate-400 dark:text-slate-500" />
                <span>My Profile</span>
              </button>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-[13px] text-[#D96B67] hover:bg-rose-50 flex items-center space-x-2 font-medium transition cursor-pointer dark:hover:bg-rose-500/10"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;