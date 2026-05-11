import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Verifica tus credenciales e intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-10 border border-slate-100">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600 text-white mb-6 shadow-xl shadow-blue-200">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Bienvenido</h2>
            <p className="text-slate-400 mt-2 font-medium">Ingresa a tu panel de control</p>
          </div>

          {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm mb-6 font-bold text-center border border-rose-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Corporativo</label>
              <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="ejemplo@empresa.cl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Contraseña</label>
              <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group">
              ENTRAR AL SISTEMA
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          &copy; 2026 Carlos • Gestión Inteligente
        </p>
      </div>
    </div>
  );
}