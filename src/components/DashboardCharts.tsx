import React from 'react';

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export const MetricLineChart: React.FC<LineChartProps> = ({ data, height = 200 }) => {
  if (data.length === 0) return null;

  const padding = 40;
  const chartHeight = height - padding * 2;
  
  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 100);
  const minVal = 0;
  const range = maxVal - minVal;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (400 - padding * 2);
    const y = padding + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full h-full min-h-[160px] relative font-mono text-[10px] select-none text-slate-500 dark:text-[#8E8E93]">
      <svg viewBox={`0 0 400 ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="50%" stopColor="var(--accent-secondary)" />
            <stop offset="100%" stopColor="var(--accent-success)" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
          const y = padding + chartHeight * p;
          const gridVal = Math.round(maxVal - (maxVal * p));
          return (
            <g key={idx} className="opacity-70">
              <line 
                x1={padding} 
                y1={y} 
                x2={400 - padding} 
                y2={y} 
                stroke="var(--border-color)" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
              />
              <text x={8} y={y + 3.5} fill="var(--text-muted)" className="font-extrabold text-[9px]">{gridVal}%</text>
            </g>
          );
        })}

        {/* Shaded Area */}
        <path d={areaD} fill="url(#chart-glow)" />

        {/* Connected Line Path */}
        <path 
          d={pathD} 
          fill="none" 
          stroke="url(#line-grad)" 
          strokeWidth="4" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interaction handles / circles */}
        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="6.5" 
              fill="var(--bg-secondary)" 
              stroke="var(--accent-secondary)" 
              strokeWidth="3.5" 
              className="transition duration-150 group-hover:scale-125"
            />
            {/* Tooltip on Hover */}
            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <rect 
                x={p.x - 30} 
                y={p.y - 32} 
                width="60" 
                height="22" 
                rx="8" 
                fill="var(--bg-secondary)" 
                stroke="var(--border-color)" 
                strokeWidth="1.5" 
                className="shadow-md"
              />
              <text 
                x={p.x} 
                y={p.y - 18} 
                fill="var(--text-primary)" 
                fontWeight="extrabold" 
                textAnchor="middle" 
                className="text-[9px] font-sans"
              >
                {p.value}%
              </text>
            </g>
          </g>
        ))}

        {/* Label axes */}
        {points.map((p, idx) => (
          <text 
            key={idx} 
            x={p.x} 
            y={height - 10} 
            textAnchor="middle" 
            fill="var(--text-muted)" 
            className="text-[9.5px] font-bold font-sans"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
};

// Interactive circular score display
interface CircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  glow?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ 
  score, 
  size = 120, 
  strokeWidth = 10,
  glow = true 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#circular-grad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        <defs>
          <linearGradient id="circular-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="50%" stopColor="var(--accent-secondary)" />
            <stop offset="100%" stopColor="var(--accent-success)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Centered Typography score metrics */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none layer">
        <span className="font-display text-4xl font-black tracking-tight text-slate-800 dark:text-white leading-none">
          {score}
        </span>
        <span className="font-mono text-[8px] tracking-wider text-slate-400 dark:text-[#8E8E93] uppercase font-extrabold mt-1">
          percentile
        </span>
      </div>
    </div>
  );
};

// Responsive Radial Polar categories chart
interface PolarCategoriesProps {
  categories: { label: string; score: number }[];
}

export const PolarCategoriesChart: React.FC<PolarCategoriesProps> = ({ categories }) => {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 font-mono text-[10px] text-slate-500 dark:text-[#8E8E93] w-full">
      {categories.map((cat, idx) => (
        <div key={idx} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-slate-800 dark:text-[#E5E5E7] font-sans font-extrabold">
            <span className="text-xs tracking-tight">{cat.label}</span>
            <span className="text-emerald-500 dark:text-emerald-400">{cat.score}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-[#1C1C1E] overflow-hidden border border-transparent">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-sky-400 to-emerald-400 transition-all duration-700" 
              style={{ width: `${cat.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
