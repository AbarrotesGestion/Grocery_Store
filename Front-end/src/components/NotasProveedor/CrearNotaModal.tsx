import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import toast from 'react-hot-toast'; // Importamos toast
import { HiXMark, HiOutlineDocumentText, HiOutlineCamera, HiPlus, HiTrash } from 'react-icons/hi2';

interface ProveedorItem {
  id: number;
  company_name: string;
}

interface ProductoItem {
  id: number;
  name: string;
  price: number;
}

interface ProductLine {
  product_id: number | string;
  quantity_agreed: number;
  price_agreed: number;
  discount: number;
  is_gift: boolean;
}

interface CrearNotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function CrearNotaModal({ isOpen, onClose, onSuccess }: CrearNotaModalProps) {
  const [proveedoresList, setProveedoresList] = useState<ProveedorItem[]>([]);
  const [productosList, setProductosList] = useState<ProductoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [supplierId, setSupplierId] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminders, setReminders] = useState('');
  const [productsLines, setProductsLines] = useState<ProductLine[]>([
    { product_id: '', quantity_agreed: 1, price_agreed: 0, discount: 0, is_gift: false }
  ]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (isOpen) {
      const fetchCatalogos = async () => {
        try {
          const [resProv, resProd] = await Promise.all([
            axios.get('https://api.yahirdev.dev/api/suppliers', { headers }),
            axios.get('https://api.yahirdev.dev/api/products', { headers })
          ]);

          const provs = resProv.data.data || resProv.data;
          const prods = resProd.data.data || resProd.data;

          setProveedoresList(Array.isArray(provs) ? provs : []);
          setProductosList(Array.isArray(prods) ? prods : []);

          if (provs.length > 0) setSupplierId(provs[0].id);
        } catch (error) {
          console.error('Error al cargar catálogos:', extraerMensajeError(error));
        }
      };

      fetchCatalogos();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddLine = () => {
    setProductsLines([...productsLines, { product_id: '', quantity_agreed: 1, price_agreed: 0, discount: 0, is_gift: false }]);
  };

  const handleRemoveLine = (index: number) => {
    setProductsLines(productsLines.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: keyof ProductLine, value: any) => {
    const updated = [...productsLines];
    updated[index] = { ...updated[index], [field]: value };
    
    // Si selecciona un producto, autocompletar su precio base
    if (field === 'product_id') {
      const prod = productosList.find(p => p.id === Number(value));
      if (prod) {
        updated[index].price_agreed = prod.price;
      }
    }

    setProductsLines(updated);
  };

  const totalAmount = productsLines.reduce((acc, curr) => {
    if (curr.is_gift) return acc;
    const sub = (Number(curr.quantity_agreed) * Number(curr.price_agreed)) - Number(curr.discount || 0);
    return acc + Math.max(0, sub);
  }, 0);

  // Escaneo IA con Anthropic
  const handleScanTicket = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsScanning(true);
    const loadingToast = toast.loading('Analizando ticket con Inteligencia Artificial...');

    try {
      const response = await axios.post('https://api.yahirdev.dev/api/supplier-notes/1/scan', formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });

      const extracted = response.data.products;
      if (Array.isArray(extracted) && extracted.length > 0) {
        const mappedLines: ProductLine[] = extracted.map((item: any) => {
          const matchedProd = productosList.find(p => p.name.toLowerCase().includes(item.nombre?.toLowerCase() || ''));
          return {
            product_id: matchedProd ? matchedProd.id : '',
            quantity_agreed: item.cantidad || 1,
            price_agreed: item.precio_unitario || 0,
            discount: 0,
            is_gift: false,
          };
        });
        setProductsLines(mappedLines);
        toast.success('¡Ticket escaneado y productos extraídos con IA exitosamente!', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Error al escanear ticket con IA: ' + extraerMensajeError(error), { id: loadingToast });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const loadingToast = toast.loading('Guardando nota de proveedor...');

    try {
      const payload = {
        supplier_id: supplierId,
        total_amount: totalAmount,
        delivery_date: deliveryDate,
        reminders: reminders || null,
        products: productsLines.map(p => ({
          product_id: Number(p.product_id),
          quantity_agreed: Number(p.quantity_agreed),
          price_agreed: Number(p.price_agreed),
          discount: Number(p.discount || 0),
          is_gift: Boolean(p.is_gift)
        }))
      };

      await axios.post('https://api.yahirdev.dev/api/supplier-notes', payload, { headers });
      toast.success('Nota de proveedor creada y almacenista notificado exitosamente.', { id: loadingToast });
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 10 }} 
            className="relative bg-dark-card border border-dark-border w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden z-10 my-8"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineDocumentText className="text-neo-mint text-xl" /> Registrar Nueva Nota / Trato
              </h3>
              <button onClick={onClose} className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg"><HiXMark className="text-xl" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              
              {/* BOTÓN DE ESCANEO IA */}
              <div className="p-4 bg-ghost-blue/10 border border-ghost-blue/30 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-ghost-blue uppercase tracking-wider">Escaneo Inteligente con IA (Anthropic)</h4>
                  <p className="text-xs text-gris-calido/70 mt-0.5">Sube la foto del ticket físico del proveedor para autocompletar los productos.</p>
                </div>
                <label className="flex items-center gap-2 bg-ghost-blue text-dark-bg px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-ghost-blue/90 shadow-md">
                  <HiOutlineCamera className="text-base" /> {isScanning ? 'Analizando...' : 'Escanear Ticket'}
                  <input type="file" accept="image/*" onChange={handleScanTicket} disabled={isScanning} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Proveedor *</label>
                  <select required value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neo-mint">
                    <option value="" disabled>Seleccionar proveedor...</option>
                    {proveedoresList.map(p => <option key={p.id} value={p.id}>{p.company_name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Fecha de Entrega *</label>
                  <input type="date" required value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neo-mint" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Recordatorios o Notas</label>
                <input type="text" value={reminders} onChange={(e) => setReminders(e.target.value)} placeholder="Ej. Pagar al contado o revisar caducidades" className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neo-mint" />
              </div>

              {/* LÍNEAS DE PRODUCTOS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neo-mint uppercase tracking-wider">Productos Pactados</h4>
                  <button type="button" onClick={handleAddLine} className="flex items-center gap-1 text-xs font-bold text-neo-mint hover:underline">
                    <HiPlus /> Agregar Línea
                  </button>
                </div>

                {productsLines.map((line, idx) => (
                  <div key={idx} className="bg-dark-bg p-4 rounded-xl border border-dark-border space-y-3 relative">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] text-gris-calido uppercase mb-1">Producto *</label>
                        <select required value={line.product_id} onChange={(e) => handleLineChange(idx, 'product_id', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-xs text-white">
                          <option value="">Seleccionar...</option>
                          {productosList.map(pr => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-gris-calido uppercase mb-1">Cant. *</label>
                        <input type="number" min="1" required value={line.quantity_agreed} onChange={(e) => handleLineChange(idx, 'quantity_agreed', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-xs text-white" />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-gris-calido uppercase mb-1">P. Unit. *</label>
                        <input type="number" step="0.01" min="0" required value={line.price_agreed} onChange={(e) => handleLineChange(idx, 'price_agreed', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-xs text-white" />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-gris-calido uppercase mb-1">Descuento</label>
                        <input type="number" step="0.01" min="0" value={line.discount} onChange={(e) => handleLineChange(idx, 'discount', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-xs text-white" />
                      </div>

                      <div className="sm:col-span-1 flex justify-center pb-1">
                        {productsLines.length > 1 && (
                          <button type="button" onClick={() => handleRemoveLine(idx)} className="p-2 text-rose-500 hover:bg-dark-card rounded-lg"><HiTrash className="text-base" /></button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-dark-border">
                <div>
                  <p className="text-xs text-gris-calido">Total Calculado:</p>
                  <p className="text-2xl font-black text-emerald-400">${totalAmount.toFixed(2)}</p>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gris-calido hover:bg-dark-bg">Cancelar</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 shadow-lg shadow-neo-mint/20 disabled:opacity-50">
                    {isLoading ? 'Guardando...' : 'Crear Nota y Notificar'}
                  </motion.button>
                </div>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}