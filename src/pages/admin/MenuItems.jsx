import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: '' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([API.get('/menu'), API.get('/categories')]);
      setItems(itemsRes.data);
      setCategories(catsRes.data);
    } catch {
      setError('Could not load menu data.');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/admin/login');
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        const [itemsRes, catsRes] = await Promise.all([API.get('/menu'), API.get('/categories')]);
        if (!cancelled) {
          setItems(itemsRes.data);
          setCategories(catsRes.data);
        }
      } catch {
        if (!cancelled) setError('Could not load menu data.');
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setError('');

    try {
      const { data } = await API.post('/menu/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, image: data.imageUrl }));
    } catch {
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const addItem = async () => {
    if (!form.name.trim() || !form.price || !form.category) {
      setError('Name, price and category are required.');
      return;
    }
    setError('');
    try {
      await API.post('/menu', { ...form, price: Number(form.price) });
      setForm({ name: '', description: '', price: '', category: '', image: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add item.');
    }
  };

  const deleteItem = async (id) => {
    try {
      await API.delete(`/menu/${id}`);
      loadData();
    } catch {
      setError('Could not delete item.');
    }
  };

  const toggleAvailable = async (item) => {
    try {
      await API.put(`/menu/${item._id}`, { available: !item.available });
      loadData();
    } catch {
      setError('Could not update item.');
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">SmartDine</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-muted hover:text-ink transition-colors text-sm"
          >
            Categories
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-display text-3xl font-bold mb-8">Menu items</h2>

        {error && (
          <div className="mb-6 border border-accent/40 bg-accent/10 text-accent-soft px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Add item form */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-10">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Item name"
              className="bg-ground border border-border rounded-lg px-4 py-3 outline-none focus:border-accent transition-colors placeholder:text-muted/60"
            />
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price"
              className="bg-ground border border-border rounded-lg px-4 py-3 outline-none focus:border-accent transition-colors placeholder:text-muted/60"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-ground border border-border rounded-lg px-4 py-3 outline-none focus:border-accent transition-colors"
            >
              <option value="">Choose a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-border file:text-ink file:cursor-pointer"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description"
              rows={2}
              className="sm:col-span-2 bg-ground border border-border rounded-lg px-4 py-3 outline-none focus:border-accent transition-colors placeholder:text-muted/60 resize-none"
            />
          </div>

          {form.image && (
            <img src={form.image} alt="" className="mt-4 h-24 w-24 object-cover rounded-lg" />
          )}

          <button
            onClick={addItem}
            disabled={uploading}
            className="mt-5 bg-accent text-ground font-medium px-6 py-3 rounded-lg hover:bg-accent-soft transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading image…' : 'Add item'}
          </button>
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <p className="text-muted">No menu items yet. Add your first one above.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item._id} className="bg-surface border border-border rounded-xl overflow-hidden flex">
                {item.image ? (
                  <img src={item.image} alt="" className="w-28 h-full object-cover" />
                ) : (
                  <div className="w-28 bg-border" />
                )}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-muted text-sm">{item.category?.name}</p>
                    </div>
                    <span className="text-accent font-medium">Rs {item.price}</span>
                  </div>
                  <div className="flex gap-4 mt-4 text-sm">
                    <button
                      onClick={() => toggleAvailable(item)}
                      className="text-muted hover:text-ink transition-colors"
                    >
                      {item.available ? 'Mark sold out' : 'Mark available'}
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="text-muted hover:text-accent transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}