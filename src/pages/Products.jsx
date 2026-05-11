import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { differenceInDays, parseISO } from "date-fns";
import { Plus, Trash2, AlertCircle } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "", marca: "", lote: "", fechaVencimiento: "", proveedor: "", cantidad: "", categoria: ""
  });

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "productos"));
    const prodArray = [];
    querySnapshot.forEach((doc) => prodArray.push({ id: doc.id, ...doc.data() }));
    // Ordenar por fecha de vencimiento más próxima
    prodArray.sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));
    setProducts(prodArray);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "productos"), formData);
    setShowModal(false);
    setFormData({ nombre: "", marca: "", lote: "", fechaVencimiento: "", proveedor: "", cantidad: "", categoria: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if(confirm("¿Eliminar este producto?")) {
      await deleteDoc(doc(db, "productos", id));
      fetchProducts();
    }
  };

  const getSemaforo = (fecha) => {
    const days = differenceInDays(parseISO(fecha), new Date());
    if (days < 0) return { color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500", text: "Vencido" };
    if (days <= 30) return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", dot: "bg-yellow-500", text: `${days} días` };
    return { color: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500", text: "OK" };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventario de Productos</h2>
          <p className="text-slate-500 text-sm">Gestiona y monitorea fechas de caducidad</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-medium">Producto</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Lote</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Vencimiento</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const status = getSemaforo(p.fechaVencimiento);
                return (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{p.nombre}</p>
                      <p className="text-xs text-slate-400">{p.marca}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{p.categoria}</td>
                    <td className="p-4 text-sm text-slate-600">{p.lote}</td>
                    <td className="p-4 text-sm font-medium text-slate-700">{p.cantidad}</td>
                    <td className="p-4 text-sm text-slate-600">{p.fechaVencimiento}</td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                        <div className={`w-2 h-2 rounded-full ${status.dot}`}></div>
                        {status.text}
                      </div>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && !loading && (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">No hay productos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Creación */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Agregar Producto</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Nombre</label>
                  <input required type="text" className="w-full p-2.5 border rounded-lg" value={formData.nombre} onChange={e=>setFormData({...formData, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Marca</label>
                  <input required type="text" className="w-full p-2.5 border rounded-lg" value={formData.marca} onChange={e=>setFormData({...formData, marca: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Categoría</label>
                  <select required className="w-full p-2.5 border rounded-lg" value={formData.categoria} onChange={e=>setFormData({...formData, categoria: e.target.value})}>
                    <option value="">Seleccione...</option>
                    <option value="Lácteos">Lácteos</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Abarrotes">Abarrotes</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Lote</label>
                  <input required type="text" className="w-full p-2.5 border rounded-lg" value={formData.lote} onChange={e=>setFormData({...formData, lote: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Vencimiento</label>
                  <input required type="date" className="w-full p-2.5 border rounded-lg" value={formData.fechaVencimiento} onChange={e=>setFormData({...formData, fechaVencimiento: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Cantidad</label>
                  <input required type="number" className="w-full p-2.5 border rounded-lg" value={formData.cantidad} onChange={e=>setFormData({...formData, cantidad: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Proveedor</label>
                  <input type="text" className="w-full p-2.5 border rounded-lg" value={formData.proveedor} onChange={e=>setFormData({...formData, proveedor: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-blue-600">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}