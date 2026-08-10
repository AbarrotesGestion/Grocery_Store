import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, 
  HiOutlineUser, 
  HiOutlinePencilSquare, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineMapPin, 
  HiOutlineCreditCard,
  HiOutlineCalendar
} from 'react-icons/hi2';
import EmpleadoModal from './EmpleadoModal';

export interface Empleado {
  id?: number;
  payroll_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  full_address: string;
  hourly_rate: number;
  card_number: string;
  role_id: number | string;
  role?: {
    id: number;
    name: string;
  };
  created_at?: string;
}

export default function EmpleadoDetalle() {
  const { id } = useParams();

  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchEmpleado = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://api.yahirdev.dev/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const dataRevisada = response.data.data || response.data;
        setEmpleado(dataRevisada);
      } catch (error) {
        console.error('Error al cargar el empleado:', error);
        setErrorMsg('No se pudo cargar la información del empleado.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpleado();
  }, [id, refreshTrigger]);

  const handleSaveEmpleado = async (updatedData: Empleado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://api.yahirdev.dev/api/employees/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRefreshTrigger(prev => prev + 1);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar el empleado:', error);
      alert('Hubo un error al guardar los cambios en el servidor.');
    }
  };

  if (isLoading) {
    return <div className="p-6 bg-dark-bg text-neo-mint min-h-screen flex items-center justify-center">Cargando perfil del empleado...</div>;
  }

  if (errorMsg || !empleado) {
    return <div className="p-6 bg-dark-bg text-rose-500 min-h-screen flex items-center justify-center">{errorMsg || 'Empleado no encontrado'}</div>;
  }

  const fechaLimpia = empleado.created_at ? empleado.created_at.split('T')[0] : 'N/A';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link 
          to="/Empleados" 
          className="inline-flex items-center gap-2 text-sm text-gris-calido/70 hover:text-neo-mint transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          Volver al listado
        </Link>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          <HiOutlinePencilSquare className="text-lg" />
          Editar Perfil
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col items-center text-center justify-between space-y-6 shadow-sm">
          <div className="w-full flex flex-col items-center space-y-3">
            <div className="w-20 h-20 bg-neo-mint/10 text-neo-mint rounded-full flex items-center justify-center border border-neo-mint/20">
              <HiOutlineUser className="text-4xl" />
            </div>
            
            <h1 className="text-2xl font-bold text-white">{empleado.first_name} {empleado.last_name}</h1>
            
            <span className="px-3 py-1 bg-ghost-blue/10 text-ghost-blue text-xs font-semibold rounded-full border border-ghost-blue/20">
              {empleado.role ? empleado.role.name : 'Sin rol asignado'}
            </span>

            <div className="w-full border-t border-dark-border pt-4 text-left space-y-3 text-xs">
              <div>
                <p className="text-gris-calido/60 uppercase font-semibold">ID Nómina</p>
                <p className="text-white font-bold font-mono">{empleado.payroll_id}</p>
              </div>

              <div>
                <p className="text-gris-calido/60 uppercase font-semibold">Sueldo Base</p>
                <p className="text-emerald-400 font-bold text-sm">${Number(empleado.hourly_rate).toFixed(2)} / hora</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-white border-b border-dark-border pb-3">
            Información Detallada
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <p className="text-gris-calido/60 font-semibold uppercase">Correo Electrónico</p>
              <p className="text-white font-medium flex items-center gap-2">
                <HiOutlineEnvelope className="text-ghost-blue" />
                {empleado.email}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-gris-calido/60 font-semibold uppercase">Teléfono de Contacto</p>
              <p className="text-white font-medium flex items-center gap-2">
                <HiOutlinePhone className="text-neo-mint" />
                {empleado.phone}
              </p>
            </div>

            <div className="sm:col-span-2 space-y-1 border-t border-dark-border pt-4">
              <p className="text-gris-calido/60 font-semibold uppercase">Dirección de Vivienda</p>
              <p className="text-white font-medium flex items-center gap-2">
                <HiOutlineMapPin className="text-rose-400" />
                {empleado.full_address}
              </p>
            </div>

            <div className="space-y-1 border-t border-dark-border pt-4">
              <p className="text-gris-calido/60 font-semibold uppercase">Número de Tarjeta (Depósito)</p>
              <p className="text-white font-medium flex items-center gap-2 font-mono">
                <HiOutlineCreditCard className="text-amber-400" />
                {empleado.card_number}
              </p>
            </div>

            <div className="space-y-1 border-t border-dark-border pt-4">
              <p className="text-gris-calido/60 font-semibold uppercase">Fecha de Registro</p>
              <p className="text-white font-medium flex items-center gap-2">
                <HiOutlineCalendar className="text-neo-mint" />
                {fechaLimpia}
              </p>
            </div>
          </div>
        </div>
      </div>

      <EmpleadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmpleado}
        initialData={empleado}
      />
    </motion.div>
  );
}