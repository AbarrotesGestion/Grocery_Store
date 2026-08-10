import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiXMark, HiOutlineUser } from 'react-icons/hi2';

export interface ClienteData {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  calleNumero: string;
  colonia: string;
  credit_limit?: string | number;
}

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClienteData) => void;
  initialData?: ClienteData | null;
}

export default function ClienteModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ClienteModalProps) {
  const [formData, setFormData] = useState<ClienteData>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    calleNumero: '',
    colonia: '',
    credit_limit: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        calleNumero: '',
        colonia: '',
        credit_limit: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
            className="relative bg-dark-card border border-dark-border w-full max-w-xl rounded-xl shadow-2xl overflow-hidden my-8 z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineUser className="text-neo-mint text-xl" />
                {initialData ? 'Editar Perfil de Cliente' : 'Nuevo Cliente'}
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg transition-colors"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Ana"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors placeholder:text-gris-calido/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    placeholder="Ej. García"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors placeholder:text-gris-calido/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ana.g@email.com"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors placeholder:text-gris-calido/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="3310002201"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors placeholder:text-gris-calido/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Calle y Número
                  </label>
                  <input
                    type="text"
                    value={formData.calleNumero}
                    onChange={(e) => setFormData({ ...formData, calleNumero: e.target.value })}
                    placeholder="Av. Juárez 500"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors placeholder:text-gris-calido/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Colonia / Zona
                  </label>
                  <input
                    type="text"
                    value={formData.colonia}
                    onChange={(e) => setFormData({ ...formData, colonia: e.target.value })}
                    placeholder="Centro"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors placeholder:text-gris-calido/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Límite de Crédito ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.credit_limit}
                    onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
                    placeholder="Ej. 1500.00"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors placeholder:text-gris-calido/40"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gris-calido hover:bg-dark-bg transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 transition-all shadow-md shadow-neo-mint/10"
                >
                  {initialData ? 'Actualizar Cliente' : 'Guardar Cliente'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}