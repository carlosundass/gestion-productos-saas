import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { differenceInDays, parseISO } from "date-fns";
import { Package, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

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
    { title: "Total Productos", value: stats.total, icon: <Package size={24} />, color: "bg-blue-50 text-blue-600" },
    { title: "Buen Estado", value: stats.ok, icon: <CheckCircle size={24} />, color: "bg-green-50 text-green-600" },
    { title: "Próximos a Vencer", value: stats.warning, icon: <AlertTriangle size={24} />, color: "bg-yellow-50 text-yellow-600" },
    { title: "Vencidos", value: stats.danger, icon: <XCircle size={24} />, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Panel de Control</h2>
        <p className="text-slate-500 text-sm">Resumen en tiempo real de tu inventario</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-lg ${c.color}`}>{c.icon}</div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{c.title}</p>
              <p className="text-2xl font-bold text-slate-800">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Espacio para gráficos futuros */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-64 flex items-center justify-center">
        <p className="text-slate-400">Área preparada para integrar gráficos con Recharts.</p>
      </div>
    </div>
  );
}