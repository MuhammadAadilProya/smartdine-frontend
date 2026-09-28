import { Minus, Plus, Trash2 } from 'lucide-react';

export default function QuantityStepper({ value, onChange, size = 'md', removable = true }) {
  const box = size === 'sm' ? 'size-8' : 'size-10';
  const icon = size === 'sm' ? 15 : 17;
  const atFloor = value <= 1;

  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-ground p-1">
      <button
        onClick={() => onChange(value - 1)}
        aria-label={atFloor && removable ? 'Remove item' : 'Decrease quantity'}
        className={`${box} flex items-center justify-center rounded-full text-ink-dim transition-all duration-150 hover:bg-raised-2 hover:text-ink active:scale-90`}
      >
        {atFloor && removable ? <Trash2 size={icon} /> : <Minus size={icon} />}
      </button>

      <span
        key={value}
        className="animate-bump w-6 text-center text-sm font-semibold tabular-nums"
      >
        {value}
      </span>

      <button
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
        className={`${box} flex items-center justify-center rounded-full bg-flame text-ground transition-all duration-150 hover:bg-flame-soft active:scale-90`}
      >
        <Plus size={icon} />
      </button>
    </div>
  );
}
