import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'smartdine.cart';

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(readStoredCart);

  // Survive a refresh — a customer who reloads mid-order keeps their picks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage can be unavailable in private mode — cart just won't persist */
    }
  }, [lines]);

  const add = useCallback((item, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.menuItem === item._id);
      if (existing) {
        return prev.map((l) =>
          l.menuItem === item._id ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [
        ...prev,
        {
          menuItem: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity,
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((menuItemId, quantity) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.menuItem !== menuItemId)
        : prev.map((l) => (l.menuItem === menuItemId ? { ...l, quantity } : l))
    );
  }, []);

  const remove = useCallback((menuItemId) => {
    setLines((prev) => prev.filter((l) => l.menuItem !== menuItemId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
    const quantityOf = (menuItemId) =>
      lines.find((l) => l.menuItem === menuItemId)?.quantity ?? 0;

    return { lines, count, total, quantityOf, add, setQuantity, remove, clear };
  }, [lines, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside a CartProvider');
  return ctx;
}
