import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await login(email, pass);
      navigate("/");
    } catch { alert("Error en acceso"); }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-8 pb-12 animate-qnv">
      <div className="w-full text-center mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 italic leading-none">stocksafe</h1>
        <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-2">Acceso Profesional</p>
      </div>
      
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-50 w-full">
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Email Usuario</label>
            <input type="email" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-800" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Contraseña</label>
            <input type="password" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-black tracking-widest" value={pass} onChange={e=>setPass(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-black p-5 rounded-2xl uppercase text-sm mt-4 shadow-lg active:scale-95 transition-transform">
            Entrar ✅
          </button>
        </form>
      </div>
    </div>
  );
}