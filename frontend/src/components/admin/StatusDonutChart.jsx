const StatusDonutChart = ({ data, size = 160, stroke = 22 }) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;

  const segs = data.map((d, i) => {
    const before = data.slice(0, i).reduce((sum, x) => sum + x.value, 0);
    return {
      ...d,
      len: (d.value / 100) * circ,
      offset: (before / 100) * circ,
    };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {segs.map((d) => (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={stroke}
                strokeDasharray={`${d.len} ${circ - d.len}`}
                strokeDashoffset={-d.offset}
              />
            ))}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-bold text-[#111827] leading-none">100%</span>
          <span className="text-[11px] text-[#6B7280] mt-0.5">Agents</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 mt-4 w-full">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-[#6B7280]">{d.label}</span>
            </div>
            <span className="font-semibold text-[#111827]">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDonutChart;
