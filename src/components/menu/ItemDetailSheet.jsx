import { useEffect, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import Sheet from '../ui/Sheet';
import Button from '../ui/Button';
import QuantityStepper from '../ui/QuantityStepper';

export default function ItemDetailSheet({ item, open, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) setQuantity(1);
  }, [open, item?._id]);

  if (!item) return null;

  const lineTotal = item.price * quantity;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      footer={
        <div className="flex items-center gap-3">
          <QuantityStepper value={quantity} onChange={(q) => setQuantity(Math.max(1, q))} removable={false} />
          <Button
            size="lg"
            className="flex-1"
            onClick={() => {
              onAdd(item, quantity);
              onClose();
            }}
          >
            Add to order · Rs {lineTotal}
          </Button>
        </div>
      }
    >
      <div className="relative h-56 sm:h-64">
        {item.image ? (
          <img src={item.image} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-raised-2 text-ink-faint">
            <UtensilsCrossed size={32} />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-raised to-transparent" />
      </div>

      <div className="px-6 pb-6 pt-1">
        {item.category?.name && (
          <p className="mb-2 text-sm text-ink-faint">{item.category.name}</p>
        )}
        <h2 className="font-display text-3xl font-bold">{item.name}</h2>
        <p className="mt-2 font-display text-xl font-bold text-honey tabular-nums">
          Rs {item.price}
        </p>

        {item.description && (
          <p className="mt-5 text-[15px] leading-relaxed text-ink-dim">{item.description}</p>
        )}
      </div>
    </Sheet>
  );
}
