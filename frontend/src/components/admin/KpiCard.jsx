const KpiCard = ({ title, value, indicator, icon: Icon, iconBg = 'bg-[#E7F0FB] text-[#4A9FF5]' }) => (
  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] flex flex-col justify-between h-[124px] hover:shadow-[0_4px_14px_rgba(15,23,42,0.08)] transition-shadow">
    <div className="flex items-start justify-between">
      <p className="text-[14px] font-medium text-[#6B7280]">{title}</p>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        {Icon && <Icon size={18} />}
      </div>
    </div>
    <h3 className="text-[30px] font-bold text-[#111827] leading-none">{value}</h3>
    <div className="text-[12px] font-medium">{indicator}</div>
  </div>
);

export default KpiCard;
