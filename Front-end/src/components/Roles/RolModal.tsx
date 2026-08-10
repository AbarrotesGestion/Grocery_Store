import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import toast from 'react-hot-toast'; // Importamos toast
import { HiXMark, HiOutlineShieldCheck } from 'react-icons/hi2';
import { type Rol } from './RolesScreen';

interface RolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Rol | null;
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function RolModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: RolModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Rol>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description,
        });
      } else {
        setFormData({
          name: '',
          description: '',
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading(initialData ? 'Actualizando rol...' : 'Guardando rol...');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (initialData?.id) {
        await axios.put(`https://api.yahirdev.dev/api/roles/${initialData.id}`, formData, { headers });
        toast.success('Rol actualizado exitosamente.', { id: loadingToast });
      } else {
        await axios.post('https://api.yahirdev.dev/api/roles', formData, { headers });
        toast.success('Rol creado exitosamente.', { id: loadingToast });
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(extraerMensajeError(error), { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative bg-dark-card border border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineShieldCheck className="text-ghost-blue text-xl" />
                {initialData ? 'Editar Rol' : 'Crear Nuevo Rol'}
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg transition-colors"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Nombre del Rol *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Supervisor, Almacenista..."
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ghost-blue font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Descripción *
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={255}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre los permisos y accesos de este rol..."
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ghost-blue resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gris-calido hover:bg-dark-bg transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !formData.name}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/20 disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : initialData ? 'Actualizar Rol' : 'Guardar Rol'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}