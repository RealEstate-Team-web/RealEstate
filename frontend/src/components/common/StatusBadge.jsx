const variants = {
  pending: 'bg-[#f8e9be] text-[#8a6a2a]',
  approved: 'bg-[#E6F4EC] text-[#2F7A55]',
  rejected: 'bg-[#FBE9E8] text-[#B23B36]',
  suspended: 'bg-[#FBE9E8] text-[#B23B36]',
  active: 'bg-[#E6F4EC] text-[#2F7A55]',
  info: 'bg-[#E7F0FB] text-[#1F5FA8]',
  new: 'bg-[#FBE9F2] text-[#B23B7A]',
  default: 'bg-slate-100 text-slate-600',
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
