import { Plus, UtensilsCrossed } from 'lucide-react';
import QuantityStepper from '../ui/QuantityStepper';

export default function MenuItemCard({ item, quantity, onAdd, onChangeQuantity, onOpen, index = 0 }) {
  const soldOut = !item.available;

  return (
    <article
      className={`animate-rise-in group relative flex overflow-hidden rounded-3xl border border-line bg-raised transition-all duration-300 ${
        soldOut ? 'opacity-55' : 'hover:-translate-y-0.5 hover:border-ink-faint/60 hover:shadow-xl hover:shadow-black/30'
      }`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      {/* Image — the thing that sells the dish, so it gets real weight */}
      <button
        onClick={() => !soldOut && onOpen(item)}
        disabled={soldOut}
        className="relative w-32 shrink-0 overflow-hidden sm:w-36"
        aria-label={`View ${item.name}`}
      >
        {item.image ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-raised-2 text-ink-faint">
            <UtensilsCrossed size={22} />
          </div>
        )}

        {soldOut && (
          <span className="absolute left-2 top-2 rounded-full bg-ground/90 px-2.5 py-1 text-[11px] font-medium text-ink-dim backdrop-blur">
            Sold out
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <button onClick={() => !soldOut && onOpen(item)} disabled={soldOut} className="text-left">
          <h3 className="font-display text-lg font-bold leading-tight sm:text-xl">{item.name}</h3>
          {item.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-dim">
              {item.description}
            </p>
          )}
        </button>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-display text-lg font-bold text-honey tabular-nums">
            Rs {item.price}
          </span>

          {soldOut ? (
            <span className="text-sm text-ink-faint">Unavailable</span>
          ) : quantity > 0 ? (
            <QuantityStepper
              size="sm"
              value={quantity}
              onChange={(q) => onChangeQuantity(item._id, q)}
            />
          ) : (
            <button
              onClick={() => onAdd(item)}
              className="flex items-center gap-1.5 rounded-full bg-flame px-4 py-2 text-sm font-semibold text-ground transition-all duration-200 hover:bg-flame-soft active:scale-95"
            >
              <Plus size={15} />
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
