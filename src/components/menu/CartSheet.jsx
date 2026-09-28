import { useState } from 'react';
import { AlertCircle, UtensilsCrossed } from 'lucide-react';
import Sheet from '../ui/Sheet';
import Button from '../ui/Button';
import QuantityStepper from '../ui/QuantityStepper';
import { useCart } from '../../context/CartContext';

export default function CartSheet({ open, onClose, onPlaceOrder, placing, tableCount = 10 }) {
  const { lines, total, setQuantity } = useCart();
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!tableNumber) {
      setError('Pick your table so we know where to bring this.');
      return;
    }
    setError('');
    onPlaceOrder(Number(tableNumber));
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Your order"
      footer={
        <>
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm text-ink-dim">Total</span>
            <span className="font-display text-2xl font-bold text-honey tabular-nums">
              Rs {total}
            </span>
          </div>
          <Button size="lg" full onClick={submit} disabled={placing || lines.length === 0}>
            {placing ? 'Placing your order…' : 'Place order'}
          </Button>
        </>
      }
    >
      <div className="space-y-3 px-6 pb-6">
        {lines.map((line) => (
          <div
            key={line.menuItem}
            className="flex items-center gap-3 rounded-2xl border border-line bg-ground p-3"
          >
            {line.image ? (
              <img src={line.image} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
            ) : (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-raised-2 text-ink-faint">
                <UtensilsCrossed size={18} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{line.name}</p>
              <p className="text-sm text-ink-dim tabular-nums">
                Rs {line.price * line.quantity}
              </p>
            </div>

            <QuantityStepper
              size="sm"
              value={line.quantity}
              onChange={(q) => setQuantity(line.menuItem, q)}
            />
          </div>
        ))}
      </div>

      <div className="border-t border-line px-6 py-6">
        <label htmlFor="table" className="mb-3 block text-sm font-medium">
          Which table are you at?
        </label>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: tableCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => {
                setTableNumber(String(n));
                setError('');
              }}
              className={`h-12 rounded-xl text-sm font-semibold tabular-nums transition-all duration-200 active:scale-95 ${
                String(n) === tableNumber
                  ? 'bg-flame text-ground shadow-lg shadow-flame/25'
                  : 'border border-line bg-ground text-ink-dim hover:border-ink-faint hover:text-ink'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 flex items-center gap-2 text-sm text-flame-soft">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </p>
        )}
      </div>
    </Sheet>
  );
}
