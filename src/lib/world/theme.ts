export const worldTheme = {
  panel: 'rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-md',
  panelStrong: 'rounded-[28px] border border-blue-400/15 bg-black/60 backdrop-blur-md',
  sectionLabel: 'text-[10px] uppercase tracking-[0.35em] text-white/45',
  heading: 'text-sm font-semibold uppercase tracking-[0.28em] text-white',
  buttonBase: 'inline-flex items-center justify-center border transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
  buttonSizes: {
    sm: 'h-8 px-3 text-xs rounded-xl',
    md: 'h-10 px-4 text-sm rounded-xl',
    lg: 'h-12 px-5 text-sm rounded-2xl',
    xl: 'h-14 px-6 text-base rounded-2xl',
  },
  buttonVariants: {
    ghost: 'border-white/10 bg-white/5 text-white hover:bg-white/10',
    blue: 'border-blue-400/20 bg-blue-500/10 text-white hover:bg-blue-500/15',
    emerald: 'border-emerald-400/20 bg-emerald-500/10 text-white hover:bg-emerald-500/15',
    amber: 'border-amber-400/20 bg-amber-500/10 text-white hover:bg-amber-500/15',
    red: 'border-red-400/20 bg-red-500/10 text-white hover:bg-red-500/15',
    cyan: 'border-cyan-400/20 bg-cyan-500/10 text-white hover:bg-cyan-500/15',
    fuchsia: 'border-fuchsia-400/20 bg-fuchsia-500/10 text-white hover:bg-fuchsia-500/15',
  },
  spacing: {
    panelGap: 'gap-4',
    sectionGap: 'space-y-6',
    containerPadding: 'p-6',
    innerPadding: 'p-4',
  },
  layout: {
    sidePanelWidth: 'w-[320px]',
    railWidth: 'w-[220px]',
    mobileMaxWidth: 'max-w-md',
  }
};
