import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, tone = 'success') => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
      setTimeout(() => dismiss(id), 2600);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 px-4 pb-28 sm:pb-8"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className="animate-toast-in pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-full border border-line bg-raised-2/95 py-2.5 pl-3 pr-4 text-sm shadow-xl shadow-black/40 backdrop-blur"
          >
            {t.tone === 'error' ? (
              <AlertCircle size={17} className="shrink-0 text-flame-soft" />
            ) : (
              <CheckCircle2 size={17} className="shrink-0 text-leaf" />
            )}
            <span className="text-left">{t.message}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside a ToastProvider');
  return ctx.toast;
}
