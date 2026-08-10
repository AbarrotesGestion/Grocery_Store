import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, 
  HiOutlineDocumentText, 
  HiOutlineBuildingStorefront, 
  HiOutlineCheckBadge, 
  HiOutlineCurrencyDollar,
  HiOutlineInformationCircle,
  HiOutlineSparkles
} from 'react-icons/hi2';

interface NoteDetail {
  id: number;
  product_id: number;
  quantity_agreed: number;
  quantity_received?: number;
  price_agreed: number;
  discount: number;
  is_gift: boolean;
  product?: {
    name: string;
  };
}

interface SupplierNoteDetailData {
  id: number;
  total_amount: number;
  delivery_date: string;
  status: 'pending' | 'confirmed' | 'paid';
  reminders?: string;
  observations?: string;
  supplier?: {
    company_name: string;
    contact_name: string;
    phone?: string;
  };
  details: NoteDetail[];
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function NotaTratoDetalleScreen() {
  const { id } = useParams();

  const [note, setNote] = useState<SupplierNoteDetailData | null>(null);
  const [receivedQuantities, setReceivedQuantities] = useState<{ [key: number]: number }>({});
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchNoteDetail = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://api.yahirdev.dev/api/supplier-notes/${id}`, { headers });
        const data = response.data.data || response.data;
        setNote(data);

        // Inicializar el estado de cantidades recibidas con lo pactado por defecto
        const initialQtys: { [key: number]: number } = {};
        data.details?.forEach((det: NoteDetail) => {
          initialQtys[det.product_id] = det.quantity_received ?? det.quantity_agreed;
        });
        setReceivedQuantities(initialQtys);
        setObservations(data.observations || '');
      } catch (error) {
        console.error('Error al cargar detalle de nota:', extraerMensajeError(error));
        setErrorMsg('No se pudo encontrar la información de esta nota.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoteDetail();
  }, [id, refreshTrigger]);

  const handleConfirmNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;

    setIsSubmitting(true);
    try {
      const payload = {
        observations: observations || null,
        products: note.details.map(det => ({
          product_id: det.product_id,
          quantity_received: Number(receivedQuantities[det.product_id] || 0)
        }))
      };

      await axios.put(`https://api.yahirdev.dev/api/supplier-notes/${note.id}/confirm`, payload, { headers });
      alert('¡Nota confirmada exitosamente! El stock de los productos ha sido actualizado en el inventario.');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      alert(extraerMensajeError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayNote = async () => {
    if (!note) return;
    if (window.confirm('¿Deseas marcar esta nota como pagada?')) {
      try {
        await axios.put(`https://api.yahirdev.dev/api/supplier-notes/${note.id}/pay`, {}, { headers });
        alert('Nota marcada como pagada correctamente.');
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        alert(extraerMensajeError(error));
      }
    }
  };

  if (isLoading) {
    return <div className="p-6 bg-dark-bg text-neo-mint min-h-screen flex items-center justify-center">Cargando auditoría de la nota...</div>;
  }

  if (errorMsg || !note) {
    return <div className="p-6 bg-dark-bg text-rose-500 min-h-screen flex items-center justify-center">{errorMsg || 'Nota no encontrada'}</div>;
  }

  const isPending = note.status === 'pending';
  const isConfirmed = note.status === 'confirmed';
  const isPaid = note.status === 'paid';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link 
          to="/Notas-Proveedores" 
          className="inline-flex items-center gap-2 text-sm text-gris-calido/70 hover:text-neo-mint transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          Volver a notas de proveedores
        </Link>

        <div className="flex items-center gap-3">
          {isConfirmed && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handlePayNote}
              className="flex items-center gap-2 bg-emerald-500 text-dark-bg px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <HiOutlineCurrencyDollar className="text-lg" /> Pagar Nota
            </motion.button>
          )}
        </div>
      </div>

      {/* HEADER DE LA NOTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-ghost-blue/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-ghost-blue bg-dark-bg px-2.5 py-1 rounded-lg border border-dark-border">
              Nota #{note.id}
            </span>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
              isPaid 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : isConfirmed 
                  ? 'bg-ghost-blue/10 text-ghost-blue border-ghost-blue/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {note.status}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <HiOutlineBuildingStorefront className="text-neo-mint" /> {note.supplier?.company_name || 'Proveedor'}
          </h1>
          <p className="text-xs text-gris-calido/75">Fecha programada de entrega: <span className="text-white font-mono">{note.delivery_date?.split('T')[0]}</span></p>
        </div>

        <div className="bg-dark-bg px-5 py-3 rounded-xl border border-dark-border text-right relative z-10 shrink-0">
          <p className="text-[10px] font-bold text-gris-calido/60 uppercase tracking-widest">Monto Total Pactado</p>
          <p className="text-3xl font-black text-emerald-400">${Number(note.total_amount).toFixed(2)}</p>
        </div>
      </motion.div>

      {/* FORMULARIO DE AUDITORÍA Y RECEPCIÓN */}
      <form onSubmit={handleConfirmNote} className="space-y-6">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-dark-border pb-3">
            <HiOutlineDocumentText className="text-neo-mint text-xl" /> Auditoría de Productos Recibidos
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gris-calido">
              <thead className="bg-dark-bg text-xs uppercase font-bold text-white/70 border-b border-dark-border">
                <tr>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4 text-center">Pactado</th>
                  <th className="py-3 px-4 text-right">Precio U.</th>
                  <th className="py-3 px-4 text-center">Cantidad Recibida (Física)</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {note.details?.map((det) => {
                  const subtotal = det.is_gift ? 0 : (Number(det.quantity_agreed) * Number(det.price_agreed)) - Number(det.discount || 0);

                  return (
                    <tr key={det.id} className="hover:bg-dark-bg/40 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white">
                        {det.product?.name || `Producto #${det.product_id}`}
                        {det.is_gift && <span className="ml-2 px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[9px] font-bold">REGALO</span>}
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-white">
                        {det.quantity_agreed}
                      </td>

                      <td className="py-4 px-4 text-right font-medium">
                        ${Number(det.price_agreed).toFixed(2)}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {isPending ? (
                          <input 
                            type="number"
                            min="0"
                            required
                            value={receivedQuantities[det.product_id] ?? det.quantity_agreed}
                            onChange={(e) => setReceivedQuantities({ ...receivedQuantities, [det.product_id]: Number(e.target.value) })}
                            className="w-24 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-center text-sm font-bold text-white focus:outline-none focus:border-neo-mint"
                          />
                        ) : (
                          <span className="font-bold text-emerald-400 text-base">{det.quantity_received ?? 'N/A'}</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right font-black text-white">
                        ${Math.max(0, subtotal).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
              Observaciones de Recepción / Diferencias
            </label>
            <textarea
              rows={3}
              disabled={!isPending}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Registra cualquier faltante, daño en mercancía o comentario relevante..."
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neo-mint resize-none disabled:opacity-60"
            />
          </div>

          {isPending && (
            <div className="flex justify-end pt-4 border-t border-dark-border">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-neo-mint text-dark-bg font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-neo-mint/20 disabled:opacity-50"
              >
                <HiOutlineCheckBadge className="text-lg" />
                {isSubmitting ? 'Procesando...' : 'Confirmar Recepción y Actualizar Stock'}
              </motion.button>
            </div>
          )}

          {!isPending && (
            <div className="flex items-center gap-3 p-4 bg-dark-bg rounded-xl border border-dark-border text-xs text-gris-calido">
              <HiOutlineInformationCircle className="text-xl text-neo-mint shrink-0" />
              <p>Esta nota ya fue procesada y confirmada. El inventario ha sido actualizado y se ha notificado a la administración.</p>
            </div>
          )}
        </div>
      </form>
    </motion.div>
  );
}