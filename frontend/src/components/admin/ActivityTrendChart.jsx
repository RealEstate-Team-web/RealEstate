const SERIES = {
  logins: { label: 'Logins', color: '#2F6FED' },
  views: { label: 'Property Views', color: '#4FAF83' },
  regs: { label: 'New Registrations', color: '#23B5C4' },
};

const buildSmoothPath = (pts) => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
};

const ActivityTrendChart = () => {
  const w = 600;
  const h = 230;
  const padL = 34;
  const padR = 12;
  const padT = 14;
  const padB = 26;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const yMax = 3000;

  const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = {
    logins: [400, 520, 610, 700, 820, 900, 980, 1100, 1200, 1300, 1450, 1600],
    views: [300, 420, 560, 700, 880, 1050, 1200, 1400, 1600, 1850, 2100, 2400],
    regs: [120, 160, 200, 260, 300, 360, 410, 470, 520, 600, 680, 760],
  };

  const toPoints = (arr) =>
    arr.map((v, i) => ({
      x: padL + (i * plotW) / (arr.length - 1),
      y: padT + plotH * (1 - v / yMax),
    }));

  const yTicks = [0, 500, 1000, 1500, 2000, 2500, 3000];

  const gridLines = yTicks.map((t) => {
    const y = padT + plotH * (1 - t / yMax);
    return { t, y };
  });

  const toArea = (pts) => {
    const line = buildSmoothPath(pts);
    const last = pts[pts.length - 1];
    const first = pts[0];
    return `${line} L ${last.x.toFixed(1)} ${padT + plotH} L ${first.x.toFixed(1)} ${padT + plotH} Z`;
  };

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: 230 }}>
        {/* Grid + Y labels */}
        {gridLines.map(({ t, y }) => (
          <g key={t}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#EEF1F4" strokeWidth="1" />
            <text x={padL - 6} y={y + 3} textAnchor="end" className="fill-[#9CA3AF]" style={{ fontSize: 9 }}>
              {t}
            </text>
          </g>
        ))}

        {/* Subtle area under views */}
        <path d={toArea(toPoints(data.views))} fill="#4FAF83" fillOpacity="0.07" />

        {/* Lines + points */}
        {Object.entries(data).map(([key, arr]) => {
          const pts = toPoints(arr);
          return (
            <g key={key}>
              <path
                d={buildSmoothPath(pts)}
                fill="none"
                stroke={SERIES[key].color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2.6" fill={SERIES[key].color} stroke="#fff" strokeWidth="1.5" />
              ))}
            </g>
          );
        })}

        {/* X labels */}
        {xLabels.map((label, i) => {
          const x = padL + (i * plotW) / (xLabels.length - 1);
          return (
            <text key={label} x={x} y={h - 8} textAnchor="middle" className="fill-[#9CA3AF]" style={{ fontSize: 9 }}>
              {label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-1">
        {Object.values(SERIES).map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[11px] text-[#6B7280]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTrendChart;
