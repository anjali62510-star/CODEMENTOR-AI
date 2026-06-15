import React from 'react';

// Beautiful Custom interactive SVG Line Chart
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
    <div className="w-full h-full min-h-[160px] relative font-mono text-[10px] text-[#8E8E93]">
      <svg viewBox={`0 0 400 ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
          const y = padding + chartHeight * p;
          const gridVal = Math.round(maxVal - (maxVal * p));
          return (
            <g key={idx} className="opacity-40">
              <line 
                x1={padding} 
                y1={y} 
                x2={400 - padding} 
                y2={y} 
                stroke="#2D2D30" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
              />
              <text x={10} y={y + 4} fill="#8E8E93" className="font-semibold">{gridVal}%</text>
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
          strokeWidth="3.5" 
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
        />

        {/* Interaction handles / circles */}
        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="6.5" 
              fill="#0E0E10" 
              stroke="#10B981" 
              strokeWidth="2.5" 
            />
            {/* Tooltip on Hover */}
            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <rect 
                x={p.x - 30} 
                y={p.y - 32} 
                width="60" 
                height="22" 
                rx="6" 
                fill="#1C1C1E" 
                stroke="#2D2D30" 
                strokeWidth="1" 
              />
              <text 
                x={p.x} 
                y={p.y - 18} 
                fill="#E5E5E7" 
                fontWeight="semibold" 
                textAnchor="middle" 
                className="text-[9px]"
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
            y={height - 12} 
            textAnchor="middle" 
            fill="#8E8E93" 
            className="text-[9px] font-medium"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
};

// Beautiful Interactive circular score display
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
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1C1C1E"
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
          style={{
            filter: glow ? 'drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.45))' : 'none'
          }}
        />

        <defs>
          <linearGradient id="circular-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
      </svg>

      {/* Centered Typography score metrics */}
        <span className="font-mono text-[9px] tracking-widest text-[#8E8E93] uppercase mt-0.5">{score}%</span>
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
    <div className="flex flex-col gap-3 font-mono text-[10px] text-[#8E8E93] w-full">
      {categories.map((cat, idx) => (
        <div key={idx} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[#E5E5E7] font-sans font-medium">
            <span className="text-sm tracking-tight">{cat.label}</span>
            <span className="text-emerald-400 font-semibold">{cat.score}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#1C1C1E] overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700" 
              style={{ width: `${cat.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
