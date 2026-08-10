import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoBarChart, IoAlbumsSharp, IoPeopleSharp } from "react-icons/io5";
import { MdOutlineAttachMoney, MdOutlinePointOfSale } from "react-icons/md";

// Animación de escritura con la paleta Aqua Blue
function TextoEscribiendo({ texto }: { texto: string }) {
  const [textofinal, setTextofinal] = useState('');

  useEffect(() => {
    let i = 0;
    let currentStr = ''; // Usamos una variable local para construir el texto

    // Evitamos el error de React esperando un micro-instante para limpiar el estado
    const initialTimeout = setTimeout(() => {
      setTextofinal('');
    }, 0);

    const intervalo = setInterval(() => {
      if (i < texto.length) {
        currentStr += texto.charAt(i);
        setTextofinal(currentStr);
        i++;
      } else {
        clearInterval(intervalo);
      }
    }, 80);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalo);
    };
  }, [texto]);

  return (
    <p className="text-xl text-gris-calido mb-8 drop-shadow min-h-[32px] after:content-['|'] after:animate-pulse after:text-neo-mint">
      {textofinal}
    </p>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Rutas de imágenes
  const imagenes = [
    '/public/carusel1.jpg',
    '/public/carusel2.jpg',
    '/public/carusel3.jpg'
  ];

  // Cambio de imagen del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imagenes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [imagenes.length]);

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
        {imagenes.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/10 to-dark-bg"></div>

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight mb-4 text-white">
            Abarrotes <span className="text-neo-mint drop-shadow-[0_0_15px_rgba(139,242,230,0.3)]">Katy</span>
          </h1>
          <TextoEscribiendo texto="Gestión de inventario y ventas." />
          
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-neo-mint/10 hover:bg-neo-mint border border-neo-mint text-neo-mint hover:text-dark-bg font-bold rounded-xl shadow-lg shadow-neo-mint/10 hover:shadow-neo-mint/30 transition-all duration-300 text-lg cursor-pointer"
          >
            Ir al Dashboard <IoBarChart className="inline-block ml-2 text-xl" />
          </button>
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-9">
        <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Módulos del Sistema</h2>
        <div className="h-1 w-20 bg-neo-mint mx-auto rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        
        <div className="bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl flex flex-col items-center transform hover:-translate-y-2 hover:border-neo-mint/60 transition-all duration-300 ease-in-out cursor-pointer group">
          <IoAlbumsSharp className="text-5xl mb-4 text-neo-mint group-hover:scale-110 transition-transform duration-300" />
          <div className="text-white font-semibold mb-2 text-xl">Inventario</div>
          <p className="text-gris-calido text-sm text-center">Control de stock y mermas.</p>
        </div>

        <div className="bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl flex flex-col items-center transform hover:-translate-y-2 hover:border-neo-mint/60 transition-all duration-300 ease-in-out cursor-pointer group">
          <MdOutlinePointOfSale className="text-5xl mb-4 text-neo-mint group-hover:scale-110 transition-transform duration-300" />
          <div className="text-white font-semibold mb-2 text-xl">Ventas</div>
          <p className="text-gris-calido text-sm text-center">Transacciones en tiempo real.</p>
        </div>

        <div className="bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl flex flex-col items-center transform hover:-translate-y-2 hover:border-neo-mint/60 transition-all duration-300 ease-in-out cursor-pointer group">
          <IoPeopleSharp className="text-5xl mb-4 text-neo-mint group-hover:scale-110 transition-transform duration-300" />
          <div className="text-white font-semibold mb-2 text-xl">Personal</div>
          <p className="text-gris-calido text-sm text-center">Gestión de roles y equipo.</p>
        </div>

        <div className="bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl flex flex-col items-center transform hover:-translate-y-2 hover:border-neo-mint/60 transition-all duration-300 ease-in-out cursor-pointer group">
          <MdOutlineAttachMoney className="text-5xl mb-4 text-neo-mint group-hover:scale-110 transition-transform duration-300" />
          <div className="text-white font-semibold mb-2 text-xl">Finanzas</div>
          <p className="text-gris-calido text-sm text-center">Deudas y proveedores.</p>
        </div>

      </div>
    </div>
  );
}