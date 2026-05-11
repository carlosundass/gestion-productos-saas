import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Search, Plus, Trash2, X, Calendar, Tag } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({ nombre: '', marca: '', fecha: '', cantidad: '' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "productos"), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "productos"), { ...nuevoItem, creadoEn: new Date().getTime() });
    setMostrarForm(false);
    setNuevoItem({ nombre: '', marca: '', fecha: '', cantidad: '' });
  };

  const getEst = (fecha) => {
    const d = differenceInDays(parseISO(fecha), new Date());
    if (d < 0) return { t: 'VENCIDO', bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-500', icon: '💀' };
    if (d <= 7) return { t: 'URGENTE', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', icon: '🔴' };
    return { t: 'TRANQUI', bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600', icon: '🟢' };
  };

  return (
    <div className="animate-qnv">
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 mb-6">
        <Search size={18} className="text-gray-400 ml-1" />
        <input type="text" placeholder="Buscar productos..." className="flex-1 outline-none text-sm font-bold text-gray-700 bg-transparent" value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
      </div>

      <div className="space-y-3">
        {products.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(p => {
          const est = getEst(p.fecha);
          return (
            <div key={p.id} className={`p-5 rounded-[1.5rem] border-2 flex items-center justify-between shadow-sm ${est.bg} ${est.border}`}>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${est.text}`}>{est.icon} {est.t}</span>
                </div>
                <h3 className="font-black text-[16px] text-gray-900 leading-tight">{p.nombre}</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Vence: {p.fecha}</p>
              </div>
              <button onClick={() => deleteDoc(doc(db, "productos", p.id))} className="text-gray-300 hover:text-red-500 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Botón Flotante */}
      <button onClick={() => setMostrarForm(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center active:scale-95 z-30">
        <Plus size={24} strokeWidth={3} />
      </button>

      {/* Modal Agregar */}
      {mostrarForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMostrarForm(false)}></div>
          <form onSubmit={handleAdd} className="bg-white w-full max-w-md rounded-t-[2.5rem] p-8 pb-12 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black italic">Añadir Producto</h2>
              <button type="button" onClick={() => setMostrarForm(false)} className="bg-gray-100 p-2 rounded-full"><X size={18}/></button>
            </div>
            <div className="space-y-4">
              <input required type="text" placeholder="Nombre del producto" className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-200" value={nuevoItem.nombre} onChange={e=>setNuevoItem({...nuevoItem, nombre: e.target.value})} />
              <input required type="date" className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" value={nuevoItem.fecha} onChange={e=>setNuevoItem({...nuevoItem, fecha: e.target.value})} />
              <input required type="number" placeholder="Cantidad" className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" value={nuevoItem.cantidad} onChange={e=>setNuevoItem({...nuevoItem, cantidad: e.target.value})} />
              <button type="submit" className="w-full bg-blue-600 text-white font-black p-5 rounded-2xl uppercase text-sm shadow-xl">Guardar en Inventario</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}