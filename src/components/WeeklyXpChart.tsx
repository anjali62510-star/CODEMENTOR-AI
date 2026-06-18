import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Zap, TrendingUp, Waves } from 'lucide-react';

interface WeeklyXpChartProps {
  height?: number;
}

export const WeeklyXpChart: React.FC<WeeklyXpChartProps> = ({ height = 260 }) => {
  const { user } = useAuth();

  // Fallback default progression if user doesn't have custom record
  const defaultWeeklyXp = [
    { day: 'Mon', xp: 45 },
    { day: 'Tue', xp: 80 },
    { day: 'Wed', xp: 120 },
    { day: 'Thu', xp: 60 },
    { day: 'Fri', xp: 150 },
    { day: 'Sat', xp: 30 },
    { day: 'Sun', xp: 95 }
  ];

  const rawData = user?.weeklyXp && user.weeklyXp.length > 0 ? user.weeklyXp : defaultWeeklyXp;

  // Format array to be sure of days order if wanted
  const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = [...rawData].sort((a, b) => {
    return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
  });

  const totalWeeklyXp = chartData.reduce((sum, item) => sum + item.xp, 0);
  const highestXpDay = [...chartData].sort((a, b) => b.xp - a.xp)[0];
  const averageXp = Math.round(totalWeeklyXp / chartData.length);

  // Custom tooltips matching the dashboard branding theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-cyan-200/60 dark:border-[#123456]/80 bg-white/95 dark:bg-[#061524]/95 p-3 shadow-lg backdrop-blur-md text-xs font-sans">
          <p className="font-extrabold text-[#5C768D] dark:text-cyan-400 uppercase tracking-wider text-[9px] mb-1 font-mono">
            {payload[0].payload.day} Tide Level
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#00B8D9]" />
            <span className="font-display font-black text-[#0A2540] dark:text-white text-sm">
              {payload[0].value} XP
            </span>
          </div>
          <p className="text-[10px] text-[#5C768D] dark:text-cyan-300 mt-1 font-semibold leading-none">
            {payload[0].value >= 120 ? '🌊 High Tide — Maximum Flow!' : payload[0].value >= 60 ? '⚓ Steady Current' : '🏖️ Low Tide — Keep Sailing'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="premium-card rounded-3xl p-6 relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#D2E1ED] dark:border-[#123456]/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-[#00B8D9]" />
            <h2 className="font-display text-base font-black tracking-tight text-[#0A2540] dark:text-white">
              Weekly Tide Chart
            </h2>
          </div>
          <p className="text-[11px] text-[#5C768D] dark:text-cyan-300 font-semibold mt-0.5">
            XP flow visualized as ocean tide levels throughout the week
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-cyan-50/60 dark:bg-[#030D18]/60 border border-cyan-200/50 dark:border-[#123456] px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] font-bold text-[#5C768D] dark:text-cyan-400 uppercase block leading-none font-mono">
              WEEKLY TIDE
            </span>
            <span className="text-sm font-display font-black text-[#00B8D9] dark:text-cyan-300 block mt-1">
              {totalWeeklyXp} XP
            </span>
          </div>
          <div className="bg-cyan-50/60 dark:bg-[#030D18]/60 border border-cyan-200/50 dark:border-[#123456] px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] font-bold text-[#5C768D] dark:text-cyan-400 uppercase block leading-none font-mono">
              AVG CURRENT
            </span>
            <span className="text-sm font-display font-black text-[#0A2540] dark:text-white block mt-1">
              {averageXp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Panel */}
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
          >
            <defs>
              <linearGradient id="tideBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#67E8F9" stopOpacity={0.95} />
                <stop offset="60%" stopColor="#00B8D9" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#0F4C81" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="peakTideGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2DD4BF" stopOpacity={0.95} />
                <stop offset="60%" stopColor="#00B8D9" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#0F4C81" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(0, 184, 217, 0.08)"
            />
            
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8E8E93', fontSize: 10, fontWeight: 700, fontFamily: 'font-mono' }}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8E8E93', fontSize: 10, fontWeight: 700, fontFamily: 'font-mono' }}
              domain={[0, 'dataMax + 20']}
            />

            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 184, 217, 0.04)', radius: 8 }}
            />

            <Bar 
              dataKey="xp" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={38}
            >
              {chartData.map((entry, index) => {
                const isHighest = entry.day === highestXpDay.day;
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isHighest ? 'url(#peakTideGradient)' : 'url(#tideBarGradient)'} 
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2.5 mt-4 border-t border-[#D2E1ED] dark:border-[#123456]/30 pt-3 text-[10px] text-[#5C768D] dark:text-cyan-300 font-semibold font-mono">
        <TrendingUp className="h-4 w-4 text-[#2DD4BF] shrink-0" />
        <span>Peak tide on <span className="text-[#00B8D9] font-bold">{highestXpDay.day}</span> at <span className="font-extrabold text-[#0A2540] dark:text-white">{highestXpDay.xp} XP</span>. Keep sailing daily to maintain strong currents!</span>
      </div>
    </div>
  );
};
