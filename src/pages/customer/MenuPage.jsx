import { useEffect, useMemo, useState } from 'react';
import { Search, X, SearchX, UtensilsCrossed, WifiOff, CheckCircle2 } from 'lucide-react';
import API from '../../api/axios';
import { CartProvider, useCart } from '../../context/CartContext';
import { ToastProvider, useToast } from '../../context/ToastContext';
import CategoryRail from '../../components/menu/CategoryRail';
import MenuItemCard from '../../components/menu/MenuItemCard';
import ItemDetailSheet from '../../components/menu/ItemDetailSheet';
import CartSheet from '../../components/menu/CartSheet';
import CartBar from '../../components/menu/CartBar';
import Button from '../../components/ui/Button';
import { MenuSkeleton, CategorySkeleton, StateMessage } from '../../components/ui/States';

function Menu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  const [detailItem, setDetailItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placedAt, setPlacedAt] = useState(null); // table number of the order just placed

  const { lines, quantityOf, add, setQuantity, clear } = useCart();
  const toast = useToast();

  const loadMenu = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [itemsRes, catsRes] = await Promise.all([API.get('/menu'), API.get('/categories')]);
      setItems(itemsRes.data);
      setCategories(catsRes.data);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchMenu = async () => {
      try {
        const [itemsRes, catsRes] = await Promise.all([API.get('/menu'), API.get('/categories')]);
        if (!cancelled) {
          setItems(itemsRes.data);
          setCategories(catsRes.data);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMenu();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const map = { all: items.length };
    for (const item of items) {
      const id = item.category?._id;
      if (id) map[id] = (map[id] ?? 0) + 1;
    }
    return map;
  }, [items]);

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = activeCategory === 'all' || item.category?._id === activeCategory;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description ?? '').toLowerCase().includes(q)
      );
    });
  }, [items, activeCategory, query]);

  const handleAdd = (item, quantity = 1) => {
    add(item, quantity);
    toast(`${item.name} added`);
  };

  const placeOrder = async (tableNumber) => {
    setPlacing(true);
    try {
      await API.post('/orders', {
        tableNumber,
        items: lines.map(({ menuItem, name, price, quantity }) => ({
          menuItem,
          name,
          price,
          quantity,
        })),
      });
      setPlacedAt(tableNumber);
      setCartOpen(false);
      clear();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not place your order. Try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  /* ── Order placed ─────────────────────────────────────────── */
  if (placedAt) {
    return (
      <div className="page-glow relative flex min-h-screen items-center justify-center px-6">
        <div className="animate-rise-in relative z-10 text-center">
          <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-3xl bg-leaf/15 text-leaf">
            <CheckCircle2 size={30} />
          </div>
          <h1 className="font-display text-4xl font-bold">Order placed</h1>
          <p className="mx-auto mt-3 max-w-xs leading-relaxed text-ink-dim">
            The kitchen has it. We'll bring it out to table {placedAt}.
          </p>
          <Button size="lg" className="mt-8" onClick={() => setPlacedAt(null)}>
            Back to the menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-glow relative min-h-screen pb-32">
      <div className="relative z-10">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="mx-auto max-w-3xl px-6 pb-8 pt-14 sm:pt-20">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-raised/70 px-3.5 py-1.5 text-xs text-ink-dim backdrop-blur">
            <span className="size-1.5 rounded-full bg-leaf" />
            Kitchen is open
          </p>

          <h1 className="font-display text-5xl font-extrabold sm:text-7xl">SmartDine</h1>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-ink-dim">
            Pick what you want, tell us your table, and we'll bring it over.
          </p>

          {/* Search */}
          <div className="relative mt-8">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu"
              aria-label="Search the menu"
              className="h-13 w-full rounded-2xl border border-line bg-raised pl-12 pr-11 text-[15px] outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-flame/60"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-raised-2 hover:text-ink"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </header>

        {/* ── Category rail ────────────────────────────────────── */}
        <div className="sticky top-0 z-20 border-b border-line bg-ground/85 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl px-6 py-3.5">
            {loading ? (
              <CategorySkeleton />
            ) : (
              <CategoryRail
                categories={categories}
                active={activeCategory}
                onSelect={setActiveCategory}
                counts={counts}
              />
            )}
          </div>
        </div>

        {/* ── Items ────────────────────────────────────────────── */}
        <main className="mx-auto max-w-3xl px-6 py-8">
          {loading ? (
            <MenuSkeleton />
          ) : loadError ? (
            <StateMessage
              icon={WifiOff}
              title="Menu didn't load"
              body="Check your connection and try again."
              actionLabel="Try again"
              onAction={loadMenu}
            />
          ) : items.length === 0 ? (
            <StateMessage
              icon={UtensilsCrossed}
              title="Nothing on the menu yet"
              body="This restaurant hasn't added any dishes. Check back in a bit."
            />
          ) : visibleItems.length === 0 ? (
            <StateMessage
              icon={SearchX}
              title="No matches"
              body={
                query
                  ? `Nothing here matches "${query}".`
                  : 'This category is empty right now.'
              }
              actionLabel="Show everything"
              onAction={() => {
                setQuery('');
                setActiveCategory('all');
              }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleItems.map((item, i) => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  index={i}
                  quantity={quantityOf(item._id)}
                  onAdd={handleAdd}
                  onChangeQuantity={setQuantity}
                  onOpen={setDetailItem}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <CartBar onOpen={() => setCartOpen(true)} />

      <ItemDetailSheet
        item={detailItem}
        open={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
        onAdd={handleAdd}
      />

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onPlaceOrder={placeOrder}
        placing={placing}
      />
    </div>
  );
}

export default function MenuPage() {
  return (
    <ToastProvider>
      <CartProvider>
        <Menu />
      </CartProvider>
    </ToastProvider>
  );
}
