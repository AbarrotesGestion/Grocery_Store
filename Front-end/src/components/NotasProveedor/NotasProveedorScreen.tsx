import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineEye, 
  HiOutlineTrash, 
  HiOutlineMagnifyingGlass,
  HiOutlineBuildingStorefront,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineCheckBadge,
  HiOutlineCurrencyDollar
} from 'react-icons/hi2';
import CrearNotaModal from './CrearNotaModal';

export interface SupplierNote {
  id: number;
  supplier_id?: number;
  total_amount: number;
  delivery_date: string;
  status: 'pending' | 'confirmed' | 'paid';
  reminders?: string;
  observations?: string;
  created_at?: string;
  supplier?: {
    id: number;
    company_name: string;
    contact_name: string;
  };
  details?: any[];
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function NotasProveedorScreen() {
  const navigate = useNavigate();

  const [notas, setNotas] = useState<SupplierNote[]>([]);
  const [tab, setTab] = useState<'activas' | 'historial'>('activas');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchNotas = async () => {
      setIsLoading(true);
      try {
        const endpoint = tab === 'activas' 
          ? 'https://api.yahirdev.dev/api/supplier-notes' 
          : 'https://api.yahirdev.dev/api/supplier-notes/historial';

        const response = await axios.get(endpoint, { headers });
        const data = response.data.data || response.data;
        setNotas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar notas de proveedores:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotas();
  }, [tab, refreshTrigger]);

  const handlePayNote = async (id: number) => {
    if (window.confirm('¿Deseas marcar esta nota como pagada?')) {
      try {
        await axios.put(`https://api.yahirdev.dev/api/supplier-notes/${id}/pay`, {}, { headers });
        setRefreshTrigger(prev => prev + 1);
        alert('Nota marcada como pagada exitosamente.');
      } catch (error) {
        alert(extraerMensajeError(error));
      }
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta nota de proveedor?')) {
      try {
        await axios.delete(`https://api.yahirdev.dev/api/supplier-notes/${id}`, { headers });
        setRefreshTrigger(prev => prev + 1);
        alert('Nota eliminada correctamente.');
      } catch (error) {
        alert(extraerMensajeError(error));
      }
    }
  };

  const notasFiltradas = notas.filter(n =>
    n.supplier?.company_name.toLowerCase().includes(search.toLowerCase()) ||
    n.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      
      {/* HEADER DE LA VISTA */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-ghost-blue/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-ghost-blue/10 text-ghost-blue border border-ghost-blue/20 mb-1">
            <HiOutlineSparkles className="text-sm" /> Auditoría y Tratos
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Notas de Proveedores</h1>
          <p className="text-sm text-gris-calido/75">Control de acuerdos de compra, recepción de mercancía y escaneo de tickets asistido por IA.</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-bold px-5 py-3 rounded-xl transition-all shadow-lg"
        >
          <HiPlus className="text-xl font-black" />
          Nueva Nota / Trato
        </motion.button>
      </motion.div>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className="flex border-b border-dark-border bg-dark-card px-6 pt-3 rounded-xl shadow-sm">
        <button
          type="button"
          onClick={() => setTab('activas')}
          className={`pb-3 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
            tab === 'activas' ? 'border-neo-mint text-neo-mint' : 'border-transparent text-gris-calido/60 hover:text-white'
          }`}
        >
          <HiOutlineClock className="text-base" /> Notas Activas / Pendientes
        </button>
        <button
          type="button"
          onClick={() => setTab('historial')}
          className={`pb-3 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
            tab === 'historial' ? 'border-neo-mint text-neo-mint' : 'border-transparent text-gris-calido/60 hover:text-white'
          }`}
        >
          <HiOutlineCheckBadge className="text-base" /> Historial (Confirmadas / Pagadas)
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar por empresa proveedora o estatus..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gris-calido/50"
        />
      </div>

      {/* TABLA DE NOTAS ANIMADA */}
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
                <th className="py-3.5 px-6">ID Nota</th>
                <th className="py-3.5 px-6">Proveedor</th>
                <th className="py-3.5 px-6 text-right">Monto Total</th>
                <th className="py-3.5 px-6 text-center">Estatus</th>
                <th className="py-3.5 px-6">F. Entrega</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neo-mint font-semibold animate-pulse">Cargando notas de proveedores...</td>
                </tr>
              ) : notasFiltradas.length > 0 ? (
                notasFiltradas.map((nota, index) => {
                  const isPending = nota.status === 'pending';
                  const isConfirmed = nota.status === 'confirmed';
                  const isPaid = nota.status === 'paid';
                  const fechaLimpia = nota.delivery_date ? nota.delivery_date.split('T')[0] : 'N/A';

                  return (
                    <motion.tr 
                      key={nota.id} 
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.3 + (index * 0.05) }}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                      className="transition-colors"
                    >
                      <td className="py-4 px-6 font-mono text-xs text-ghost-blue font-bold">
                        #{nota.id}
                      </td>

                      <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                        <div className="p-2 bg-ghost-blue/10 rounded-xl text-ghost-blue border border-ghost-blue/20 shrink-0">
                          <HiOutlineBuildingStorefront className="text-lg" />
                        </div>
                        <span>{nota.supplier?.company_name || `Proveedor #${nota.supplier_id}`}</span>
                      </td>

                      <td className="py-4 px-6 text-right font-black text-white text-base">
                        ${Number(nota.total_amount).toFixed(2)}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          isPaid 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : isConfirmed 
                              ? 'bg-ghost-blue/10 text-ghost-blue border-ghost-blue/20' 
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {nota.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-xs text-gris-calido/70 font-mono">
                        {fechaLimpia}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Ver Detalle y Escaneo"
                            onClick={() => navigate(`/notas-proveedor/${nota.id}`)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                          >
                            <HiOutlineEye className="text-lg" />
                          </motion.button>

                          {isConfirmed && (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              title="Marcar como Pagada"
                              onClick={() => handlePayNote(nota.id)}
                              className="p-1.5 hover:bg-dark-bg rounded-md text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              <HiOutlineCurrencyDollar className="text-lg" />
                            </motion.button>
                          )}

                          {isPending && (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              title="Eliminar Nota"
                              onClick={() => handleDeleteNote(nota.id)}
                              className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                            >
                              <HiOutlineTrash className="text-lg" />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gris-calido/50">
                    No se encontraron notas de proveedores en esta sección.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <CrearNotaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </motion.div>
  );
}