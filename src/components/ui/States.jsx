import Button from './Button';

/** Menu card skeletons — same shape as the real cards, so nothing jumps on load. */
export function MenuSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex overflow-hidden rounded-3xl border border-line bg-raised">
          <div className="skeleton h-36 w-32 shrink-0 sm:w-36" />
          <div className="flex-1 space-y-3 p-5">
            <div className="skeleton h-5 w-3/5 rounded-md" />
            <div className="skeleton h-3 w-full rounded-md" />
            <div className="skeleton h-3 w-4/5 rounded-md" />
            <div className="skeleton mt-5 h-8 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex gap-2">
      {[72, 96, 84, 68].map((w, i) => (
        <div key={i} className="skeleton h-10 rounded-full" style={{ width: w }} />
      ))}
    </div>
  );
}

/**
 * One component for empty, error and no-results screens.
 * An empty screen is an invitation to act, so it always offers the next step.
 */
export function StateMessage({ icon: Icon, title, body, actionLabel, onAction }) {
  return (
    <div className="animate-rise-in flex flex-col items-center px-6 py-16 text-center">
      {Icon && (
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-line bg-raised text-ink-faint">
          <Icon size={24} />
        </div>
      )}
      <h3 className="font-display text-2xl font-bold">{title}</h3>
      {body && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-dim">{body}</p>}
      {actionLabel && (
        <Button variant="secondary" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
