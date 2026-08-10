import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { HiXMark, HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { type AjusteInventario } from './AjustesInventarioScreen';

interface ProductoItem {
  id: number;
  name: string;
  stock: number;
}

interface AjusteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: AjusteInventario | null;
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function AjusteInventarioModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AjusteModalProps) {
  const [productosList, setProductosList] = useState<ProductoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<AjusteInventario>({
    product_id: '',
    quantity: 1,
    adjustment_type: 'addition',
    reason: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          product_id: initialData.product_id,
          quantity: initialData.quantity,
          adjustment_type: initialData.adjustment_type,
          reason: initialData.reason,
        });
      } else {
        setFormData({
          product_id: '',
          quantity: 1,
          adjustment_type: 'addition',
          reason: '',
        });
      }

      const fetchProductos = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('https://api.yahirdev.dev/api/products', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = response.data.data || response.data;
          setProductosList(Array.isArray(data) ? data : []);
          
          if (!initialData && data.length > 0) {
            setFormData(prev => ({ ...prev, product_id: data[0].id }));
          }
        } catch (error) {
          console.error('Error cargando lista de productos:', extraerMensajeError(error));
        }
      };

      fetchProductos();
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (initialData?.id) {
        await axios.put(`https://api.yahirdev.dev/api/inventory-adjustments/${initialData.id}`, formData, { headers });
        alert('Ajuste de inventario actualizado exitosamente.');
      } else {
        await axios.post('https://api.yahirdev.dev/api/inventory-adjustments', formData, { headers });
        alert('Ajuste registrado y stock actualizado exitosamente.');
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
            className="relative bg-dark-card border border-dark-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden my-8 z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineClipboardDocumentList className="text-neo-mint text-xl" />
                {initialData ? 'Editar Ajuste de Inventario' : 'Registrar Nuevo Ajuste'}
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
                  Seleccionar Producto *
                </label>
                <select
                  required
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                >
                  <option value="" disabled className="bg-dark-card text-gris-calido/50">Seleccionar producto...</option>
                  {productosList.map((prod) => (
                    <option key={prod.id} value={prod.id} className="bg-dark-card text-white">
                      {prod.name} (Stock actual: {prod.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Tipo de Ajuste *
                  </label>
                  <select
                    value={formData.adjustment_type}
                    onChange={(e) => setFormData({ ...formData, adjustment_type: e.target.value as 'addition' | 'subtraction' })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                  >
                    <option value="addition" className="bg-dark-card text-emerald-400">Entrada / Adición (+)</option>
                    <option value="subtraction" className="bg-dark-card text-rose-400">Salida / Merma (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Motivo o Razón del Ajuste *
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={255}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Ej. Conteo físico de inventario, merma por caducidad, daño..."
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint resize-none"
                />
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
                  disabled={isLoading || !formData.product_id}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 transition-all shadow-md shadow-neo-mint/10 disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : initialData ? 'Actualizar Ajuste' : 'Registrar Ajuste'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}