import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, PackageSearch, Users, LogOut, Menu, X } from "lucide-react";
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
    navItems.push({ name: "Administración", path: "/admin", icon: <Users size={20} /> });
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 bg-slate-900/50 z-40 lg:hidden ${menuOpen ? 'block' : 'hidden'}`} onClick={() => setMenuOpen(false)} />
      
      {/* Sidebar Desktop & Mobile */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 flex flex-col ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Stock<span className="text-brand-primary">Safe</span></h1>
          <button className="lg:hidden text-slate-500" onClick={() => setMenuOpen(false)}><X size={24} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-brand-primary text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-primary'}`}>
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
            <LogOut size={20} /> Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:justify-end shadow-sm z-30">
          <button className="lg:hidden text-slate-600" onClick={() => setMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-sm">
              {role === 'admin' ? 'A' : 'U'}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </div>
        
        <footer className="py-4 text-center text-sm text-slate-400 bg-white border-t border-slate-100">
          Desarrollado por Carlos.
        </footer>
      </main>
    </div>
  );
}