import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { differenceInDays, parseISO, format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Trash2, Search, Filter, Calendar, Tag } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "", marca: "", lote: "", fechaVencimiento: "", proveedor: "", cantidad: "", categoria: ""
  });

  const fetchProducts = async () => {
    const q = query(collection(db, "productos"), orderBy("fechaVencimiento", "asc"));
    const querySnapshot = await getDocs(q);
    const prodArray = [];
    querySnapshot.forEach((doc) => prodArray.push({ id: doc.id, ...doc.data() }));
    setProducts(prodArray);
  };

  useEffect(() => { fetchProducts(); }, []);

  const getSemaforo = (fecha) => {
    const days = differenceInDays(parseISO(fecha), new Date());
    if (days < 0) return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100", label: "Vencido", dot: "bg-rose-500" };
    if (days <= 30) return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", label: `Vence en ${days} días`, dot: "bg-amber-500" };
    return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", label: "Estado Óptimo", dot: "bg-emerald-500" };
  };

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventario</h2>
          <p className="text-slate-500">Control dinámico de fechas y stock.</p>
        </div>
        <button onClick={() => setShowModal(true)} 
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold">
          <Plus size={20} /> Agregar Producto
        </button>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Buscar por nombre o marca..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const status = getSemaforo(p.fechaVencimiento);
          return (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col card-hover">
              <div className={`p-4 border-b ${status.border} ${status.bg} flex justify-between items-center`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${status.text} flex items-center gap-1.5`}>
                  <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                <span className="text-slate-400 text-xs font-medium">Lote: {p.lote}</span>
              </div>
              
              <div className="p-6 space-y-4 flex-1">
                <div>
                  <h4 className="text-xl font-bold text-slate-800 leading-tight">{p.nombre}</h4>
                  <p className="text-slate-400 text-sm font-medium">{p.marca}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="text-xs font-medium">{p.fechaVencimiento}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Tag size={16} className="text-blue-500" />
                    <span className="text-xs font-medium">{p.categoria}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Stock Disponible</p>
                    <p className="text-2xl font-black text-slate-800">{p.cantidad} <span className="text-sm font-normal text-slate-400">uds</span></p>
                  </div>
                  <button onClick={() => deleteDoc(doc(db, "productos", p.id)).then(fetchProducts)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}