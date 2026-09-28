const VARIANTS = {
  primary:
    'bg-flame text-ground font-semibold shadow-lg shadow-flame/20 hover:bg-flame-soft hover:shadow-flame/30 active:shadow-none',
  secondary:
    'bg-raised-2 text-ink border border-line hover:border-ink-faint hover:bg-raised',
  ghost: 'text-ink-dim hover:text-ink hover:bg-raised-2',
  quiet: 'bg-ground border border-line text-ink-dim hover:text-ink hover:border-ink-faint',
};

const SIZES = {
  sm: 'h-9 px-4 text-sm rounded-full',
  md: 'h-11 px-5 text-sm rounded-full',
  lg: 'h-13 px-7 text-[15px] rounded-full',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 whitespace-nowrap',
        'transition-all duration-200 active:scale-[0.97]',
        'disabled:pointer-events-none disabled:opacity-45',
        VARIANTS[variant],
        SIZES[size],
        full ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
