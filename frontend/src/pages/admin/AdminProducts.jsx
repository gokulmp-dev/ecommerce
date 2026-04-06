import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const empty = { name: "", price: "", image: "", brand: "", category: "", description: "", countInStock: "" };

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` };

  const load = () => {
    setLoading(true);
    fetch("/api/admin/products", { headers })
      .then((r) => r.json())
      .then((d) => { setProducts(d); setLoading(false); });
  };

  useEffect(load, []);

  const openAdd = () => { setForm(empty); setEditId(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditId(p._id); setShowModal(true); };

  const handleSave = async () => {
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
    await fetch(url, { method, headers, body: JSON.stringify(form) });
    setSaving(false);
    setShowModal(false);
    load();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE", headers });
    setDeleteId(null);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Products</h1>
          <p className="text-white/40 text-sm mt-1">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="bg-amber-400 text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-amber-300 transition-all">
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm animate-pulse">Loading products...</div>
      ) : (
        <div className="bg-[#141416] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-6 py-4">Brand</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4">Stock</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-white/[0.02] transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-white/5" onError={(e) => (e.target.src = "https://via.placeholder.com/40")} />
                      <span className="font-medium text-white/80 max-w-[180px] truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/50">{p.brand || "—"}</td>
                  <td className="px-6 py-4 text-white/50">{p.category || "—"}</td>
                  <td className="px-6 py-4 text-amber-400 font-bold">₹{p.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.countInStock > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {p.countInStock > 0 ? `${p.countInStock} in stock` : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(p)} className="text-blue-400 hover:text-blue-300 text-xs font-medium mr-4 transition-colors">Edit</button>
                    <button onClick={() => setDeleteId(p._id)} className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <div className="px-6 py-12 text-white/30 text-sm text-center">No products found</div>}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1c] border border-white/10 rounded-2xl w-full max-w-lg p-7">
            <h2 className="text-xl font-black mb-6">{editId ? "Edit Product" : "Add Product"}</h2>
            <div className="space-y-4">
              {[
                { key: "name", label: "Product Name", type: "text" },
                { key: "price", label: "Price (₹)", type: "number" },
                { key: "image", label: "Image URL", type: "text" },
                { key: "brand", label: "Brand", type: "text" },
                { key: "category", label: "Category", type: "text" },
                { key: "countInStock", label: "Count In Stock", type: "number" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-sm hover:bg-amber-300 transition-all disabled:opacity-50">
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1c] border border-white/10 rounded-2xl p-7 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-lg font-bold mb-2">Delete Product?</h3>
            <p className="text-white/40 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}