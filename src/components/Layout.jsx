import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, PackageSearch, Users, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function Layout() {
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Productos", path: "/productos", icon: <PackageSearch size={20} /> },
  ];

  if (role === 'admin') {
    navItems.push({ name: "Usuarios", path: "/admin", icon: <Users size={20} /> });
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar para Desktop */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-100 z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8">
          <div className="flex items-center gap-3 text-blue-600">
            <ShieldCheck size={32} strokeWidth={2.5} />
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">STOCK<span className="text-blue-600">SAFE</span></h1>
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <button onClick={handleLogout} className="flex items-center gap-4 w-full px-6 py-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-bold">
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 lg:justify-end">
          <button className="lg:hidden p-2 text-slate-600" onClick={() => setMenuOpen(true)}>
            <Menu size={28} />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 capitalize">{role}</p>
              <p className="text-xs text-slate-400">Sistema Activo</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
              {role?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}