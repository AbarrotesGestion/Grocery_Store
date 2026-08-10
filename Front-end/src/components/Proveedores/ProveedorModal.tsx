import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { HiXMark, HiOutlineTruck } from 'react-icons/hi2';

export interface ProveedorData {
  id?: number;
  company_name: string;
  contact_name: string;
  phone?: string;
  email?: string;
  debts?: any[];
}

interface ProveedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ProveedorData | null;
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function ProveedorModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: ProveedorModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProveedorData>({
    company_name: '',
    contact_name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          company_name: initialData.company_name,
          contact_name: initialData.contact_name,
          phone: initialData.phone || '',
          email: initialData.email || '',
        });
      } else {
        setFormData({
          company_name: '',
          contact_name: '',
          phone: '',
          email: '',
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const payload: any = { ...formData };

      if (!payload.phone) delete payload.phone;
      if (!payload.email) delete payload.email;

      if (initialData?.id) {
        await axios.put(`https://api.yahirdev.dev/api/suppliers/${initialData.id}`, payload, { headers });
        alert('Proveedor actualizado exitosamente.');
      } else {
        await axios.post('https://api.yahirdev.dev/api/suppliers', payload, { headers });
        alert('Proveedor creado exitosamente.');
      }

      onSuccess();
      onClose();
    } catch (error) {
      alert(extraerMensajeError(error));
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
            className="relative bg-dark-card border border-dark-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineTruck className="text-neo-mint text-xl" />
                {initialData ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
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
                  Nombre de la Empresa / Comercializadora *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Ej. Bimbo S.A. de C.V."
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neo-mint font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Nombre del Contacto / Agente *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="Ej. Carlos Santana"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neo-mint"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="3312345678"
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neo-mint"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    maxLength={255}
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@empresa.com"
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neo-mint"
                  />
                </div>
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
                  disabled={isLoading || !formData.company_name || !formData.contact_name}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/20 disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : initialData ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}