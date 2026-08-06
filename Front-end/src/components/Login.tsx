import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Intentando conectar con:', { usuario, password });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center font-sans p-4">
      <div className="bg-dark-card border border-dark-border rounded-xl p-8 w-full max-w-md shadow-2xl">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            Log <span className="text-neo-mint">In</span>
          </h2>
          <p className="text-gris-calido text-sm mt-2">Panel de Administración</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="block text-gris-calido text-xs font-semibold uppercase tracking-wider mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingresa tu usuario"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neo-mint transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gris-calido text-xs font-semibold uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neo-mint transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neo-mint/10 hover:bg-neo-mint border border-neo-mint text-neo-mint hover:text-dark-bg font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(139,242,230,0.1)] hover:shadow-[0_0_20px_rgba(139,242,230,0.4)]"
          >
            Iniciar Sesión
          </button>
        </form>

      </div>
    </div>
  );
}