import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartBar({ onOpen }) {
  const { count, total } = useCart();

  if (count === 0) return null;

  return (
    <div className="animate-rise-in fixed inset-x-0 bottom-0 z-30 px-4 pb-4">
      <button
        onClick={onOpen}
        className="mx-auto flex w-full max-w-lg items-center justify-between gap-4 rounded-2xl border border-flame/40 bg-flame px-5 py-4 text-ground shadow-2xl shadow-black/50 transition-all duration-200 hover:bg-flame-soft active:scale-[0.99]"
      >
        <span className="flex items-center gap-3">
          <span className="relative">
            <ShoppingBag size={20} />
            <span
              key={count}
              className="animate-bump absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-ground text-[11px] font-bold text-ink tabular-nums"
            >
              {count}
            </span>
          </span>
          <span className="font-semibold">Review order</span>
        </span>

        <span className="font-display text-lg font-bold tabular-nums">Rs {total}</span>
      </button>
    </div>
  );
}
