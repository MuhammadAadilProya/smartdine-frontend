import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Add/delete ke baad list refresh karne ke liye
  const loadCategories = async () => {
    try {
      const { data } = await API.get("/categories");
      setCategories(data);
    } catch {
      setError("Could not load categories.");
    }
  };

  // Login check + pehli baar categories load karo
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/admin/login");
      return;
    }

    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories");
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled) setError("Could not load categories.");
      }
    };

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setError("");
    try {
      await API.post("/categories", { name: newCategory });
      setNewCategory("");
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add category.");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      loadCategories();
    } catch {
      setError("Could not delete category.");
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">SmartDine</h1>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/admin/menu")}
              className="text-muted hover:text-ink transition-colors text-sm"
            >
              Menu items
            </button>
                        <button
              onClick={() => navigate('/admin/orders')}
              className="text-muted hover:text-ink transition-colors text-sm"
            >
              Orders
            </button>
            <button
              onClick={() => navigate('/admin/qr')}
              className="text-muted hover:text-ink transition-colors text-sm"
            >
              QR code
            </button>
            <button
              onClick={signOut}
              className="text-muted hover:text-ink transition-colors text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-display text-3xl font-bold mb-8">Categories</h2>

        {error && (
          <div className="mb-6 border border-accent/40 bg-accent/10 text-accent-soft px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 mb-10">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Burgers, Drinks, Desserts…"
            className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 outline-none focus:border-accent transition-colors placeholder:text-muted/60"
          />
          <button
            onClick={addCategory}
            className="bg-accent text-ground font-medium px-6 rounded-lg hover:bg-accent-soft transition-colors"
          >
            Add category
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="text-muted">
            No categories yet. Add your first one above.
          </p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center justify-between bg-surface border border-border rounded-lg px-5 py-4"
              >
                <span>{cat.name}</span>
                <button
                  onClick={() => deleteCategory(cat._id)}
                  className="text-muted hover:text-accent transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
