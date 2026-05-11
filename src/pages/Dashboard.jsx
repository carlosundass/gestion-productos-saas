import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { differenceInDays, parseISO } from "date-fns";
import { Package, AlertTriangle, XCircle, CheckCircle, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, ok: 0, warning: 0, danger: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "productos"));
      let total = 0, ok = 0, warning = 0, danger = 0;
      
      snapshot.forEach((doc) => {
        total++;
        const days = differenceInDays(parseISO(doc.data().fechaVencimiento), new Date());
        if (days < 0) danger++;
        else if (days <= 30) warning++;
        else ok++;
      });
      setStats({ total, ok, warning, danger });
    };
    fetchData();
  }, []);

  const cards = [
    { title: "Total Productos", value: stats.total, icon: <Package size={24} />, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "En Buen Estado", value: stats.ok, icon: <CheckCircle size={24} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Próximos a Vencer", value: stats.warning, icon: <AlertTriangle size={24} />, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Vencidos", value: stats.danger, icon: <XCircle size={24} />, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Resumen General</h2>
        <p className="text-slate-500 mt-1">Bienvenido al control de inventario inteligente.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm card-hover flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
              {c.icon}
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{c.title}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-600" size={20} />
            <h3 className="font-bold text-lg text-slate-800">Actividad Reciente</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-50">
              <span className="text-slate-600 text-sm">Sistema listo para monitorear</span>
              <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded">Hoy</span>
            </div>
            <p className="text-slate-400 text-sm italic text-center py-10">Aquí aparecerán los últimos movimientos de tu inventario.</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-2">Soporte Premium</h3>
          <p className="text-blue-100 mb-6 text-sm leading-relaxed">
            ¿Necesitas ayuda con la gestión de tus productos o quieres escalar tu plan? Nuestro equipo está disponible.
          </p>
          <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors self-start shadow-md">
            Contactar Soporte
          </button>
        </div>
      </div>
    </div>
  );
}