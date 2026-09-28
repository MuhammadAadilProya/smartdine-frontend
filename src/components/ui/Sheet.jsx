import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Bottom sheet on phones, centred dialog from `sm` up.
 * Locks page scroll, closes on Escape and on backdrop click.
 */
export default function Sheet({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-sheet-up sm:animate-pop-in relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-raised shadow-2xl shadow-black/60 sm:max-w-lg sm:rounded-3xl"
      >
        {/* Drag handle — phone affordance only */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-line" />
        </div>

        {title && (
          <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-5">
            <h2 className="font-display text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 -mt-1 rounded-full p-2 text-ink-dim transition-colors hover:bg-raised-2 hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer && (
          <div className="border-t border-line bg-raised/95 px-6 py-5 backdrop-blur">{footer}</div>
        )}
      </div>
    </div>
  );
}
