import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      // Hacemos la petición real a tu backend de Laravel
      const response = await axios.post('https://api.yahirdev.dev/api/login', {
        email: usuario, // Asumiendo que tu backend espera el campo 'email'
        password: password
      });

      // Extraemos el token de la respuesta
      const token = response.data.token || response.data.access_token || response.data.data?.token;
      
      if (token) {
        // Guardamos la llave de acceso en el navegador
        localStorage.setItem('token', token);
        // Redirigimos al dashboard
        navigate('/dashboard');
      } else {
        setErrorMsg('El servidor respondió, pero no envió un token válido.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMsg('Credenciales incorrectas o error de conexión.');
    } finally {
      setIsLoading(false);
    }
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
              type="email"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingresa tu correo"
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

          {/* Mensaje de error visual en caso de fallar */}
          {errorMsg && (
            <div className="text-rose-500 text-sm text-center font-medium bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(139,242,230,0.1)] 
              ${isLoading 
                ? 'bg-gris-calido/20 text-gris-calido cursor-not-allowed border border-transparent' 
                : 'bg-neo-mint/10 hover:bg-neo-mint border border-neo-mint text-neo-mint hover:text-dark-bg hover:shadow-[0_0_20px_rgba(139,242,230,0.4)]'
              }`}
          >
            {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
          </button>
        </form>

      </div>
    </div>
  );
}