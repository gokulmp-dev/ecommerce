import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` };

  const load = () => {
    setLoading(true);
    fetch(`${API_URL}/api/admin/users`, { headers })
      .then((r) => r.json())
      .then((d) => { setUsers(d); setLoading(false); });
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/admin/users/${id}`, { method: "DELETE", headers });
    setDeleteId(null);
    load();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Users</h1>
        <p className="text-white/40 text-sm mt-1">{users.length} registered users</p>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm animate-pulse">Loading users...</div>
      ) : (
        <div className="bg-[#141416] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4">User</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">Joined</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/[0.02] transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {u.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-white/80">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/50">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide ${
                      u.isAdmin ? "bg-amber-400/10 text-amber-400" : "bg-white/5 text-white/30"
                    }`}>
                      {u.isAdmin ? "Admin" : "Customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/40 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    {!u.isAdmin ? (
                      <button onClick={() => setDeleteId(u._id)} className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors">Delete</button>
                    ) : (
                      <span className="text-white/20 text-xs">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="px-6 py-12 text-white/30 text-sm text-center">No users found</div>}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1c] border border-white/10 rounded-2xl p-7 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-bold mb-2">Delete User?</h3>
            <p className="text-white/40 text-sm mb-6">Their orders and data will remain but they won't be able to log in.</p>
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