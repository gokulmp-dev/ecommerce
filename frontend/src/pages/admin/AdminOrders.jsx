import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` };

  const load = () => {
    setLoading(true);
    fetch("/api/admin/orders", { headers })
      .then((r) => r.json())
      .then((d) => { setOrders(d); setLoading(false); });
  };

  useEffect(load, []);

  const markDelivered = async (id) => {
    await fetch(`/api/admin/orders/${id}/deliver`, { method: "PUT", headers });
    load();
  };

  const handleReturn = async (id, action) => {
    await fetch(`/api/admin/orders/${id}/return-action`, {
      method: "PUT", headers,
      body: JSON.stringify({ action }),
    });
    load();
  };

  const filtered = orders.filter((o) => {
    if (filter === "processing") return !o.isDelivered && !o.isCancelled;
    if (filter === "delivered") return o.isDelivered;
    if (filter === "cancelled") return o.isCancelled;
    if (filter === "returns") return o.returnRequested;
    return true;
  });

  const filters = [
    { key: "all", label: "All" },
    { key: "processing", label: "Processing" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
    { key: "returns", label: "Return Requests" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Orders</h1>
        <p className="text-white/40 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all ${
              filter === key ? "bg-amber-400 text-black" : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-white/30 text-sm animate-pulse">Loading orders...</div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="bg-[#141416] border border-white/5 rounded-2xl px-6 py-12 text-white/30 text-sm text-center">No orders found</div>
          )}
          {filtered.map((order) => (
            <div key={order._id} className="bg-[#141416] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-white/30">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide ${
                      order.isCancelled ? "bg-red-500/10 text-red-400"
                      : order.isDelivered ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {order.isCancelled ? "Cancelled" : order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                    {order.returnRequested && (
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide ${
                        order.returnStatus === "approved" ? "bg-emerald-500/10 text-emerald-400"
                        : order.returnStatus === "rejected" ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {order.returnType || "Return"} — {order.returnStatus || "Pending"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white/80">{order.user?.name || "Unknown"}</p>
                  <p className="text-xs text-white/30">{order.user?.email}</p>
                  <p className="text-xs text-white/30 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-amber-400">₹{order.totalPrice}</p>
                  <p className="text-xs text-white/30 mt-1">{order.orderItems?.length} item(s)</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {order.orderItems?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <img src={item.image} alt={item.name} className="w-7 h-7 rounded-lg object-cover" onError={(e) => (e.target.src = "https://via.placeholder.com/28")} />
                    <span className="text-xs text-white/60 max-w-[120px] truncate">{item.name}</span>
                    <span className="text-xs text-white/30">×{item.qty}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-white/30 mt-3">
                📍 {order.shippingAddress?.address}, {order.shippingAddress?.city} — {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
              </p>

              {order.returnRequested && order.returnReason && (
                <div className="mt-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl px-4 py-3">
                  <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wide mb-1">Return Reason</p>
                  <p className="text-xs text-white/60">{order.returnReason}</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {!order.isDelivered && !order.isCancelled && (
                  <button onClick={() => markDelivered(order._id)} className="text-xs px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-semibold">
                    ✅ Mark as Delivered
                  </button>
                )}
                {order.returnRequested && order.returnStatus === "pending" && (
                  <>
                    <button onClick={() => handleReturn(order._id, "approved")} className="text-xs px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-semibold">
                      ✅ Approve Return
                    </button>
                    <button onClick={() => handleReturn(order._id, "rejected")} className="text-xs px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-semibold">
                      ❌ Reject Return
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}