import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const navItems = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/products", label: "Products", icon: "📦" },
  { to: "/admin/orders", label: "Orders", icon: "🛒" },
  { to: "/admin/users", label: "Users", icon: "👥" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f10] text-white font-['Syne',sans-serif]">
      <aside className="w-64 flex-shrink-0 bg-[#141416] border-r border-white/5 flex flex-col">
        <div className="px-6 py-7 border-b border-white/5">
          <span className="text-xl font-black tracking-tight text-white">
            MY<span className="text-amber-400">SHOP</span>
          </span>
          <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase mt-0.5">Admin Console</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-5 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}