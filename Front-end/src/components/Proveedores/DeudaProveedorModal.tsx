import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { HiXMark, HiOutlineBanknotes } from 'react-icons/hi2';
import { type SupplierDebt } from './DeudasProveedoresScreen';

interface ProveedorItem {
  id: number;
  company_name: string;
}

interface DeudaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: SupplierDebt | null;
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function DeudaProveedorModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DeudaModalProps) {
  const [proveedoresList, setProveedoresList] = useState<ProveedorItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<SupplierDebt>({
    supplier_id: '',
    amount: 0,
    due_date: '',
    status: 'pending',
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          supplier_id: initialData.supplier_id,
          amount: Number(initialData.amount),
          due_date: initialData.due_date ? initialData.due_date.split('T')[0] : '',
          status: initialData.status,
        });
      } else {
        setFormData({
          supplier_id: '',
          amount: 0,
          due_date: '',
          status: 'pending',
        });
      }

      const fetchProveedores = async () => {
        try {
          const response = await axios.get('https://api.yahirdev.dev/api/suppliers', { headers });
          const data = response.data.data || response.data;
          setProveedoresList(Array.isArray(data) ? data : []);

          if (!initialData && data.length > 0) {
            setFormData(prev => ({ ...prev, supplier_id: data[0].id }));
          }
        } catch (error) {
          console.error('Error al cargar proveedores:', extraerMensajeError(error));
        }
      };

      fetchProveedores();
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData?.id) {
        await axios.put(`https://api.yahirdev.dev/api/supplier-debts/${initialData.id}`, formData, { headers });
        alert('Deuda actualizada exitosamente.');
      } else {
        await axios.post('https://api.yahirdev.dev/api/supplier-debts', formData, { headers });
        alert('Deuda registrada exitosamente.');
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
            className="relative bg-dark-card border border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineBanknotes className="text-amber-400 text-xl" />
                {initialData ? 'Editar Deuda de Proveedor' : 'Registrar Nueva Deuda'}
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
                  Proveedor *
                </label>
                <select
                  required
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="" disabled className="bg-dark-card text-gris-calido/50">Seleccionar proveedor...</option>
                  {proveedoresList.map((prov) => (
                    <option key={prov.id} value={prov.id} className="bg-dark-card text-white">
                      {prov.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Monto de la Deuda ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  placeholder="Ej. 3500.00"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Estatus *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'paid' | 'overdue' })}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="pending" className="bg-dark-card text-amber-400">Pendiente</option>
                    <option value="paid" className="bg-dark-card text-emerald-400">Pagado</option>
                    <option value="overdue" className="bg-dark-card text-rose-400">Vencido</option>
                  </select>
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
                  disabled={isLoading || !formData.supplier_id}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-dark-bg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : initialData ? 'Actualizar Deuda' : 'Registrar Deuda'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}