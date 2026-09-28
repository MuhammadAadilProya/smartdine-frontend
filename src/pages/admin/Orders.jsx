import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const STATUSES = ['pending', 'preparing', 'served', 'completed'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('active');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch {
      setError('Could not load orders.');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/admin/login');
      return;
    }

    let cancelled = false;

    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        if (!cancelled) setOrders(data);
      } catch {
        if (!cancelled) setError('Could not load orders.');
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [navigate]);

  const changeStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      loadOrders();
    } catch {
      setError('Could not update order.');
    }
  };

  const visibleOrders = orders.filter((o) =>
    tab === 'active' ? o.status !== 'completed' : o.status === 'completed'
  );

  const activeCount = orders.filter((o) => o.status !== 'completed').length;
  const completedCount = orders.length - activeCount;

  // Table ke hisaab se orders group karo
  const groupedByTable = visibleOrders.reduce((groups, order) => {
    const key = order.tableNumber;
    if (!groups[key]) groups[key] = [];
    groups[key].push(order);
    return groups;
  }, {});

  const tableGroups = Object.entries(groupedByTable).sort(
    (a, b) => Number(a[0]) - Number(b[0])
  );

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">SmartDine</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-muted hover:text-ink transition-colors text-sm"
          >
            Back to dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-display text-3xl font-bold mb-6">Orders</h2>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('active')}
            className={`px-5 py-2.5 rounded-lg text-sm transition-colors ${
              tab === 'active'
                ? 'bg-accent text-ground font-medium'
                : 'bg-surface border border-border text-muted hover:text-ink'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`px-5 py-2.5 rounded-lg text-sm transition-colors ${
              tab === 'completed'
                ? 'bg-accent text-ground font-medium'
                : 'bg-surface border border-border text-muted hover:text-ink'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {error && (
          <div className="mb-6 border border-accent/40 bg-accent/10 text-accent-soft px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {tableGroups.length === 0 ? (
          <p className="text-muted">
            {tab === 'active'
              ? "No active orders. They'll appear here as customers place them."
              : 'No completed orders yet.'}
          </p>
        ) : (
          <div className="space-y-8">
            {tableGroups.map(([table, tableOrders]) => {
              const tableTotal = tableOrders.reduce((sum, o) => sum + o.totalPrice, 0);

              return (
                <section key={table}>
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-display text-2xl font-bold">Table {table}</h3>
                    <span className="text-muted text-sm">
                      {tableOrders.length} {tableOrders.length === 1 ? 'order' : 'orders'} · Rs {tableTotal}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {tableOrders.map((order, index) => (
                      <div key={order._id} className="bg-surface border border-border rounded-xl p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-medium">
                              {index === 0 ? 'Order 1' : `Order ${index + 1}`}
                            </p>
                            <p className="text-muted text-sm">
                              {new Date(order.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <span className="text-accent font-medium">Rs {order.totalPrice}</span>
                        </div>

                        <div className="space-y-1 mb-5 text-sm">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-muted">
                              <span>
                                {item.quantity} × {item.name}
                              </span>
                              <span>Rs {item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {STATUSES.map((status) => (
                            <button
                              key={status}
                              onClick={() => changeStatus(order._id, status)}
                              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                order.status === status
                                  ? 'bg-accent text-ground font-medium'
                                  : 'bg-ground border border-border text-muted hover:text-ink'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}