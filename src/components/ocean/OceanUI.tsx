import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, Anchor, Waves, AlertCircle, Compass } from 'lucide-react';
import { LivingOceanBackground } from '../LivingOceanBackground';

/* ─── Loading Screen ─── */
export const OceanLoadingScreen: React.FC<{ message?: string }> = ({
  message = 'Calibrating marine compasses & weighing anchor...',
}) => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] relative overflow-hidden">
    <LivingOceanBackground />
    <div className="flex flex-col items-center gap-5 relative z-10">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="text-4xl"
      >
        ⚓
      </motion.div>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00B8D9] border-t-transparent" />
      <p className="font-mono text-xs text-[#5C768D] dark:text-cyan-400 font-semibold tracking-wide">{message}</p>
    </div>
  </div>
);

/* ─── Public shell (landing, auth, onboarding) ─── */
export const OceanPublicShell: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden selection:bg-[#00B8D9] selection:text-white ${className}`}
  >
    <LivingOceanBackground />
    <div className="absolute inset-0 ocean-grid opacity-40 pointer-events-none" />
    <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-cyan-400/5 to-transparent dark:from-cyan-900/10 pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

/* ─── Auth cinematic layout ─── */
interface OceanAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  onLogoClick?: () => void;
  sideContent?: React.ReactNode;
}

export const OceanAuthLayout: React.FC<OceanAuthLayoutProps> = ({
  children,
  title,
  subtitle,
  badge = 'OCEAN EXPLORER',
  onLogoClick,
  sideContent,
}) => (
  <OceanPublicShell>
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Cinematic left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 border-r border-[#D2E1ED] dark:border-[#123456]">
        <div>
          <button
            type="button"
            onClick={onLogoClick}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#0F4C81] to-[#00B8D9] flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition">
              ⚓
            </div>
            <div className="text-left">
              <span className="font-display font-black text-[#0A2540] dark:text-white text-sm block">CodeMentor AI</span>
              <span className="text-[9px] font-mono text-[#00B8D9] font-bold tracking-widest">{badge}</span>
            </div>
          </button>
        </div>

        <div className="space-y-6">
          {/* Animated lighthouse */}
          <div className="relative h-48 flex items-end justify-center">
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute top-8 left-1/2 w-48 h-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent blur-md origin-center"
              style={{ transform: 'translateX(-50%) rotate(-15deg)' }}
            />
            <svg width="50" height="90" viewBox="0 0 50 90" className="relative z-10 drop-shadow-lg">
              <circle cx="25" cy="18" r="6" className="fill-cyan-300/60 animate-pulse" />
              <rect x="20" y="24" width="10" height="8" fill="#00B8D9" opacity="0.4" rx="1" />
              <path d="M18,32 L32,32 L35,75 L15,75 Z" fill="white" stroke="#0A2540" strokeWidth="1.5" className="dark:stroke-cyan-300" />
              <path d="M16,50 L34,50 L35,58 L15,58 Z" fill="#EF4444" />
              <rect x="12" y="75" width="26" height="6" rx="2" fill="#0A2540" className="dark:fill-[#123456]" />
            </svg>
            {/* Horizon waves */}
            <svg className="absolute bottom-0 w-full h-12 fill-cyan-400/15" viewBox="0 0 400 30" preserveAspectRatio="none">
              <path d="M0,15 C80,25 160,5 240,15 C320,25 360,10 400,15 L400,30 L0,30 Z" className="animate-[wave-slow_8s_ease-in-out_infinite]" />
            </svg>
          </div>
          {sideContent}
        </div>

        <p className="text-[10px] font-mono text-[#5C768D] dark:text-cyan-400">
          Navigate Your Journey to Success 🌊
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-16">
        <div className="lg:hidden mb-8 text-center">
          <button type="button" onClick={onLogoClick} className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0F4C81] to-[#00B8D9] text-white text-xl cursor-pointer">
            ⚓
          </button>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#0A2540] dark:text-white">{title}</h1>
          <p className="mt-2 text-sm text-[#5C768D] dark:text-cyan-300 font-semibold">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  </OceanPublicShell>
);

/* ─── Page header for authenticated pages ─── */
interface OceanPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  action?: React.ReactNode;
}

export const OceanPageHeader: React.FC<OceanPageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon = Anchor,
  badge,
  action,
}) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#D2E1ED] dark:border-[#123456] pb-6 mb-8">
    <div>
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-cyan-100/60 dark:bg-cyan-950/40 border border-cyan-200/50 dark:border-cyan-800/30 flex items-center justify-center text-[#00B8D9]">
          <Icon className="h-5 w-5" />
        </div>
        <h1 className="font-display text-2xl font-black tracking-tight text-[#0A2540] dark:text-white md:text-3xl">{title}</h1>
        {badge && (
          <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-cyan-100/60 dark:bg-cyan-500/10 border border-cyan-200/50 dark:border-cyan-800/30 text-[#0F4C81] dark:text-cyan-400 px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-[#5C768D] dark:text-cyan-300 font-semibold mt-2 ml-11">{subtitle}</p>
      )}
    </div>
    {action}
  </div>
);

/* ─── Card ─── */
export const OceanCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: LucideIcon;
}> = ({ children, className = '', title, icon: Icon }) => (
  <div className={`premium-card rounded-3xl p-6 ${className}`}>
    {title && (
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D2E1ED] dark:border-[#123456]/40">
        {Icon && <Icon className="h-4.5 w-4.5 text-[#00B8D9]" />}
        <h3 className="font-display font-black text-sm text-[#0A2540] dark:text-white">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

/* ─── Form elements ─── */
export const OceanInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({
  label,
  className = '',
  ...props
}) => (
  <div>
    {label && (
      <label className="ocean-label" htmlFor={props.id}>{label}</label>
    )}
    <input className={`ocean-input ${className}`} {...props} />
  </div>
);

export const OceanTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({
  label,
  className = '',
  ...props
}) => (
  <div>
    {label && (
      <label className="ocean-label" htmlFor={props.id}>{label}</label>
    )}
    <textarea className={`ocean-input min-h-[120px] resize-y ${className}`} {...props} />
  </div>
);

export const OceanSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({
  label,
  className = '',
  children,
  ...props
}) => (
  <div>
    {label && (
      <label className="ocean-label" htmlFor={props.id}>{label}</label>
    )}
    <select className={`ocean-input ${className}`} {...props}>{children}</select>
  </div>
);

interface OceanButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

export const OceanButton: React.FC<OceanButtonProps> = ({
  variant = 'primary',
  loading,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'ocean-btn-primary',
    secondary: 'ocean-btn-secondary',
    ghost: 'ocean-btn-ghost',
  };
  return (
    <button
      className={`${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Processing...
        </span>
      ) : children}
    </button>
  );
};

/* ─── Error / Empty states ─── */
export const OceanErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="rounded-xl border border-rose-400/30 bg-rose-50 dark:bg-rose-950/20 p-4 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2 mb-4">
    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
    <p className="font-semibold">{message}</p>
  </div>
);

export const OceanEmptyState: React.FC<{
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon = '🌊', title, description, action }) => (
  <div className="premium-card rounded-3xl p-12 text-center">
    <motion.span
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 4 }}
      className="text-4xl block mb-4"
    >
      {icon}
    </motion.span>
    <h3 className="font-display font-black text-lg text-[#0A2540] dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-[#5C768D] dark:text-cyan-300 font-semibold max-w-md mx-auto">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

/* ─── Auth form card wrapper ─── */
export const OceanFormCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="glass-pane rounded-2xl p-6 sm:p-8 shadow-lg border border-[#D2E1ED] dark:border-[#123456] max-w-md w-full">
    {children}
  </div>
);

/* ─── Settings section ─── */
export const OceanSettingsSection: React.FC<{
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}> = ({ title, description, icon: Icon = Compass, children }) => (
  <div className="premium-card rounded-2xl p-6 space-y-4">
    <div className="border-b border-[#D2E1ED] dark:border-[#123456]/40 pb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4.5 w-4.5 text-[#00B8D9]" />
        <h3 className="font-display font-black text-sm text-[#0A2540] dark:text-white">{title}</h3>
      </div>
      {description && (
        <p className="text-[11px] text-[#5C768D] dark:text-cyan-300 font-semibold mt-1">{description}</p>
      )}
    </div>
    {children}
  </div>
);

/* ─── Toggle row for settings ─── */
export const OceanToggleRow: React.FC<{
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, description, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer group py-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-[#D2E1ED] dark:border-[#123456] text-[#00B8D9] accent-[#00B8D9] h-4 w-4 mt-0.5 cursor-pointer"
    />
    <div>
      <span className="text-xs font-bold text-[#0A2540] dark:text-white group-hover:text-[#00B8D9] transition">{label}</span>
      <p className="text-[11px] text-[#5C768D] dark:text-cyan-300 font-semibold mt-0.5">{description}</p>
    </div>
  </label>
);

/* ─── Theme preset card ─── */
export const OceanThemeCard: React.FC<{
  id: string;
  title: string;
  description: string;
  preview: string;
  selected: boolean;
  onClick: () => void;
}> = ({ title, description, preview, selected, onClick }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`rounded-2xl p-4 text-left border transition cursor-pointer w-full ${
      selected
        ? 'border-[#00B8D9] bg-cyan-50/50 dark:bg-cyan-950/20 shadow-md'
        : 'border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/40 hover:border-cyan-300'
    }`}
  >
    <div className={`h-16 rounded-xl mb-3 ${preview}`} />
    <h4 className="text-xs font-black text-[#0A2540] dark:text-white">{title}</h4>
    <p className="text-[10px] text-[#5C768D] dark:text-cyan-300 font-semibold mt-1">{description}</p>
    {selected && (
      <span className="text-[9px] font-mono font-bold text-[#00B8D9] mt-2 block">● Active</span>
    )}
  </motion.button>
);

export const OceanPageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="space-y-6 pb-12 animate-fade-in text-[#0A2540] dark:text-[#F8FAFC]">{children}</div>
);
