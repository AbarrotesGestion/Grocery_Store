import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiXMark, HiOutlineBanknotes } from 'react-icons/hi2';

export interface Deuda {
  id?: number;
  client_id: number | string;
  client?: {
    id: number;
    first_name: string;
    last_name: string;
    phone?: string;
  };
  start_date: string;
  due_date: string;
  balance_due: number;
  status: 'pending' | 'overdue' | 'paid';
}

interface DeudaClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Deuda) => void;
  initialData?: Deuda | null;
  clientesList: { id: number; first_name: string; last_name: string }[]; 
}

export default function DeudaClienteModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  clientesList,
}: DeudaClienteModalProps) {
  
  const [formData, setFormData] = useState<Deuda>({
    client_id: clientesList[0]?.id || '',
    start_date: new Date().toISOString().split('T')[0],
    due_date: '',
    balance_due: 0,
    status: 'pending',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          start_date: initialData.start_date ? initialData.start_date.split('T')[0] : '',
          due_date: initialData.due_date ? initialData.due_date.split('T')[0] : '',
        });
      } else {
        setFormData({
          client_id: clientesList[0]?.id || '',
          start_date: new Date().toISOString().split('T')[0],
          due_date: '',
          balance_due: 0,
          status: 'pending',
        });
      }
    }
  }, [initialData, isOpen, clientesList]);

  if (!isOpen) return null;

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
            className="relative bg-dark-card border border-dark-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden my-8 z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineBanknotes className="text-neo-mint text-xl" />
                {initialData ? 'Editar Cobro Pendiente' : 'Registrar Nueva Deuda'}
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
                  Cliente *
                </label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors"
                >
                  {clientesList.map((cli) => (
                    <option key={cli.id} value={cli.id} className="bg-dark-card text-white">
                      {cli.first_name} {cli.last_name} (ID: #{cli.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neo-mint"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Fecha Vencimiento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neo-mint"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Monto a Cobrar ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.balance_due}
                    onChange={(e) => setFormData({ ...formData, balance_due: Number(e.target.value) })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Actualizar Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'overdue' | 'paid' })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors"
                  >
                    <option value="pending" className="bg-dark-card text-amber-400">Pendiente (pending)</option>
                    <option value="overdue" className="bg-dark-card text-rose-400">Vencido (overdue)</option>
                    <option value="paid" className="bg-dark-card text-emerald-400">Pagado (paid)</option>
                  </select>
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
                  {initialData ? 'Guardar Cambios' : 'Registrar Deuda'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}