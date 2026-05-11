import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Package, LogOut, Bell } from "lucide-react";

export default function Layout() {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full flex-1">
      {/* Header Fijo */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-center bg-[#F4F6F8]/80 backdrop-blur-md sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none italic">stocksafe</h1>
          <p className="font-bold text-[10px] uppercase tracking-widest text-blue-600 mt-1">Panel de Control</p>
        </div>
        <button onClick={() => logout()} className="bg-white border border-gray-100 p-2.5 rounded-full text-gray-400 shadow-sm">
          <LogOut size={18} />
        </button>
      </header>

      {/* Contenido Scrolleable */}
      <main className="flex-1 overflow-y-auto px-6 pb-32">
        <Outlet />
      </main>

      {/* Navegación Inferior Estilo QNSV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-8 pt-3 z-40 max-w-md mx-auto sm:rounded-b-[2.5rem]">
        <div className="flex justify-around items-center px-4">
          <Link to="/" className={`flex flex-col items-center gap-1 flex-1 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Home size={22} className={location.pathname === '/' ? 'fill-blue-100' : ''} />
            <span className="text-[10px] font-black uppercase tracking-widest">Inicio</span>
          </Link>
          <Link to="/productos" className={`flex flex-col items-center gap-1 flex-1 ${location.pathname === '/productos' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Package size={22} className={location.pathname === '/productos' ? 'fill-blue-100' : ''} />
            <span className="text-[10px] font-black uppercase tracking-widest">Productos</span>
          </Link>
          <button className="flex flex-col items-center gap-1 flex-1 text-gray-400">
            <Bell size={22} />
            <span className="text-[10px] font-black uppercase tracking-widest">Alertas</span>
          </button>
        </div>
      </nav>
    </div>
  );
}