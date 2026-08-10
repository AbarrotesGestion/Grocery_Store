import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineUsers, 
  HiOutlineEye, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineClipboardDocument,
  HiOutlineXMark
} from 'react-icons/hi2';
import EmpleadoModal from './EmpleadoModal';
import { type Empleado } from './EmpleadoDetalle';

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

interface CustomNotification {
  isOpen: boolean;
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  tempPassword?: string;
  onConfirm?: () => void;
}

export default function EmpleadosScreen() {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);

  const [notification, setNotification] = useState<CustomNotification>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchEmpleados = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://api.yahirdev.dev/api/employees', { headers });
        const data = response.data.data || response.data;
        setEmpleados(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar empleados:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpleados();
  }, [refreshTrigger]);

  const handleOpenNewModal = () => {
    setSelectedEmpleado(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp: Empleado) => {
    setSelectedEmpleado(emp);
    setIsModalOpen(true);
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
    setCopied(false);
  };

  const handleSaveEmpleado = async (formData: Empleado) => {
    try {
      if (selectedEmpleado?.id) {
        await axios.put(`https://api.yahirdev.dev/api/employees/${selectedEmpleado.id}`, formData, { headers });
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Empleado Actualizado',
          message: 'Los datos del empleado se guardaron exitosamente.',
        });
      } else {
        const res = await axios.post('https://api.yahirdev.dev/api/employees', formData, { headers });
        if (res.data.temporary_password) {
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Empleado Creado Exitosamente',
            message: 'Se ha registrado el perfil en el sistema. Asegúrate de compartir la contraseña temporal asignada.',
            tempPassword: res.data.temporary_password,
          });
        } else {
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Empleado Creado Exitosamente',
            message: 'El nuevo empleado ha sido registrado correctamente.',
          });
        }
      }
      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error de Operación',
        message: extraerMensajeError(error),
      });
    }
  };

  const handleDeleteEmpleado = (id: number) => {
    setNotification({
      isOpen: true,
      type: 'confirm',
      title: '¿Eliminar Empleado?',
      message: 'Esta acción dará de baja al empleado de la plantilla activa. ¿Deseas continuar?',
      onConfirm: async () => {
        try {
          await axios.delete(`https://api.yahirdev.dev/api/employees/${id}`, { headers });
          setRefreshTrigger(prev => prev + 1);
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Empleado Eliminado',
            message: 'El registro del empleado ha sido removido del sistema.',
          });
        } catch (error) {
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Error al Eliminar',
            message: extraerMensajeError(error),
          });
        }
      }
    });
  };

  const handleCopyPassword = (pwd: string) => {
    navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const empleadosFiltrados = empleados.filter(e =>
    `${e.first_name} ${e.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.payroll_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6 relative"
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-neo-mint/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neo-mint/10 text-neo-mint border border-neo-mint/20 mb-1">
            <HiOutlineSparkles className="text-sm" /> Capital Humano
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Equipo / Empleados</h1>
          <p className="text-sm text-gris-calido/75">Directorio del personal, sueldos base, puestos y accesos al sistema.</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 170, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleOpenNewModal}
          className="relative z-10 flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-bold px-5 py-3 rounded-xl transition-all shadow-lg"
        >
          <HiPlus className="text-xl font-black" />
          Registrar Empleado
        </motion.button>
      </motion.div>

      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar por nombre, correo o ID de nómina..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gris-calido/50"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gris-calido">
            <thead className="bg-dark-bg/90 text-xs uppercase font-bold text-white/70 border-b border-dark-border">
              <tr>
                <th className="py-3.5 px-6">ID Nómina</th>
                <th className="py-3.5 px-6">Empleado</th>
                <th className="py-3.5 px-6">Rol / Puesto</th>
                <th className="py-3.5 px-6">Contacto</th>
                <th className="py-3.5 px-6 text-right">Sueldo Base</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neo-mint font-semibold animate-pulse">Cargando equipo de trabajo...</td>
                </tr>
              ) : empleadosFiltrados.length > 0 ? (
                empleadosFiltrados.map((emp, index) => (
                  <motion.tr 
                    key={emp.id} 
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.3 + (index * 0.05) }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                    className="transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-xs text-ghost-blue font-bold">
                      {emp.payroll_id}
                    </td>

                    <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                      <div className="p-2.5 bg-neo-mint/10 rounded-xl text-neo-mint border border-neo-mint/20 shrink-0">
                        <HiOutlineUsers className="text-lg" />
                      </div>
                      <span>{emp.first_name} {emp.last_name}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-ghost-blue/10 text-ghost-blue border border-ghost-blue/20">
                        {emp.role?.name || 'Sin rol'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs space-y-1">
                      <div className="flex items-center gap-2 text-gris-calido">
                        <HiOutlineEnvelope className="text-ghost-blue shrink-0" />
                        <span>{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gris-calido">
                        <HiOutlinePhone className="text-neo-mint shrink-0" />
                        <span>{emp.phone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right font-bold text-emerald-400">
                      ${Number(emp.hourly_rate).toFixed(2)} /h
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          title="Ver Perfil Detallado"
                          onClick={() => navigate(`/Empleados/${emp.id}`)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                        >
                          <HiOutlineEye className="text-lg" />
                        </motion.button>

                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          title="Editar"
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <HiOutlinePencilSquare className="text-lg" />
                        </motion.button>

                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          title="Eliminar"
                          onClick={() => handleDeleteEmpleado(emp.id!)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                        >
                          <HiOutlineTrash className="text-lg" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gris-calido/50">
                    No se encontraron empleados registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <EmpleadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmpleado}
        initialData={selectedEmpleado}
      />

      <AnimatePresence>
        {notification.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-dark-card border border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 relative"
            >
              <button 
                type="button"
                onClick={closeNotification}
                className="absolute top-4 right-4 text-gris-calido/60 hover:text-white p-1 rounded-lg transition-colors"
              >
                <HiOutlineXMark className="text-xl" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-2xl border ${
                  notification.type === 'success' 
                    ? 'bg-neo-mint/10 border-neo-mint/30 text-neo-mint' 
                    : notification.type === 'error'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  {notification.type === 'success' && <HiOutlineCheckCircle className="text-4xl" />}
                  {notification.type === 'error' && <HiOutlineExclamationTriangle className="text-4xl" />}
                  {notification.type === 'confirm' && <HiOutlineExclamationTriangle className="text-4xl" />}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-wide">{notification.title}</h3>
                  <p className="text-sm text-gris-calido/80">{notification.message}</p>
                </div>

                {notification.tempPassword && (
                  <div className="w-full bg-dark-bg border border-neo-mint/30 rounded-xl p-3.5 space-y-1 text-left relative">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neo-mint">Contraseña Temporal Asignada</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-base font-bold text-white tracking-wider">{notification.tempPassword}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyPassword(notification.tempPassword!)}
                        className="flex items-center gap-1 text-xs bg-neo-mint/20 text-neo-mint hover:bg-neo-mint/30 px-2.5 py-1.5 rounded-lg font-semibold transition-all shrink-0"
                      >
                        <HiOutlineClipboardDocument className="text-sm" />
                        {copied ? '¡Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-3 w-full pt-2">
                  {notification.type === 'confirm' ? (
                    <>
                      <button
                        type="button"
                        onClick={closeNotification}
                        className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-gris-calido hover:bg-dark-bg transition-colors border border-dark-border"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const action = notification.onConfirm;
                          closeNotification();
                          if (action) action();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
                      >
                        Sí, Eliminar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={closeNotification}
                      className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
                    >
                      Aceptar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}