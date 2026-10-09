const variants = {
  pending: 'bg-[#f8e9be] text-[#8a6a2a] dark:bg-amber-500/15 dark:text-amber-300',
  approved: 'bg-[#E6F4EC] text-[#2F7A55] dark:bg-emerald-500/15 dark:text-emerald-300',
  rejected: 'bg-[#FBE9E8] text-[#B23B36] dark:bg-rose-500/15 dark:text-rose-300',
  suspended: 'bg-[#FBE9E8] text-[#B23B36] dark:bg-rose-500/15 dark:text-rose-300',
  active: 'bg-[#E6F4EC] text-[#2F7A55] dark:bg-emerald-500/15 dark:text-emerald-300',
  info: 'bg-[#E7F0FB] text-[#1F5FA8] dark:bg-blue-500/15 dark:text-blue-300',
  new: 'bg-[#FBE9F2] text-[#B23B7A] dark:bg-pink-500/15 dark:text-pink-300',
  default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

const StatusBadge = ({ status, children, className = '' }) => {
  const key = (status || 'default').toLowerCase();
  const cls = variants[key] || variants.default;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cls} ${className}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
