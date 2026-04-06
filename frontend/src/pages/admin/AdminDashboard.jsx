import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user.token]);

  const statCards = stats
    ? [
        { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: "💰", color: "text-amber-400" },
        { label: "Total Orders", value: stats.totalOrders, icon: "🛒", color: "text-blue-400" },
        { label: "Total Products", value: stats.totalProducts, icon: "📦", color: "text-emerald-400" },
        { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "text-purple-400" },
      ]
    : [];

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back, {user?.name}</p>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm animate-pulse">Loading stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
            {statCards.map(({ label, value, icon, color }) => (
              <div key={label} className="bg-[#141416] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="text-2xl mb-3">{icon}</div>
                <div className={`text-3xl font-black ${color}`}>{value}</div>
                <div className="text-white/40 text-xs mt-1 tracking-wide uppercase">{label}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#141416] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-bold text-sm tracking-wide uppercase text-white/60">Recent Orders</h2>
              <Link to="/admin/orders" className="text-amber-400 text-xs hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-white/5">
              {stats?.recentOrders?.length === 0 && (
                <div className="px-6 py-8 text-white/30 text-sm text-center">No orders yet</div>
              )}
              {stats?.recentOrders?.map((order) => (
                <div key={order._id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                  <div>
                    <p className="text-sm font-medium text-white/80">{order.user?.name || "Unknown User"}</p>
                    <p className="text-xs text-white/30 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-amber-400">₹{order.totalPrice}</span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide ${
                      order.isCancelled ? "bg-red-500/10 text-red-400"
                      : order.isDelivered ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {order.isCancelled ? "Cancelled" : order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}