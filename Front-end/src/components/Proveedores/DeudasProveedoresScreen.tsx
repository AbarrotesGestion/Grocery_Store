import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineBanknotes, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineMagnifyingGlass,
  HiOutlineBuildingStorefront,
  HiOutlineSparkles
} from 'react-icons/hi2';
import DeudaProveedorModal from './DeudaProveedorModal';

export interface SupplierDebt {
  id?: number;
  supplier_id: number | string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  supplier?: {
    id: number;
    company_name: string;
    contact_name: string;
  };
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function DeudasProveedoresScreen() {
  const [deudas, setDeudas] = useState<SupplierDebt[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeuda, setSelectedDeuda] = useState<SupplierDebt | null>(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchDeudas = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://api.yahirdev.dev/api/supplier-debts', { headers });
        const data = response.data.data || response.data;
        setDeudas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar deudas de proveedores:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeudas();
  }, [refreshTrigger]);

  const handleOpenNewModal = () => {
    setSelectedDeuda(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (deuda: SupplierDebt) => {
    setSelectedDeuda(deuda);
    setIsModalOpen(true);
  };

  const handleDeleteDeuda = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este registro de deuda?')) {
      try {
        await axios.delete(`https://api.yahirdev.dev/api/supplier-debts/${id}`, { headers });
        setRefreshTrigger(prev => prev + 1);
        alert('Deuda eliminada exitosamente.');
      } catch (error) {
        alert(extraerMensajeError(error));
      }
    }
  };

  const totalPendiente = deudas
    .filter(d => d.status === 'pending' || d.status === 'overdue')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const deudasFiltradas = deudas.filter(d =>
    d.supplier?.company_name.toLowerCase().includes(search.toLowerCase()) ||
    d.status.toLowerCase().includes(search.toLowerCase())
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
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
            <HiOutlineSparkles className="text-sm" /> Cuentas por Pagar
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Deudas a Proveedores</h1>
          <p className="text-sm text-gris-calido/75">Control de compromisos financieros, vencimientos y estatus de pago con suministradores.</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(245, 158, 11, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleOpenNewModal}
          className="relative z-10 flex items-center justify-center gap-2 bg-amber-500 text-dark-bg font-bold px-5 py-3 rounded-xl transition-all shadow-lg"
        >
          <HiPlus className="text-xl font-black" />
          Registrar Deuda
        </motion.button>
      </motion.div>

      {/* TARJETA KPI FINANCIERA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-dark-card border border-dark-border p-5 rounded-2xl shadow-xl">
          <p className="text-xs font-bold text-gris-calido/60 uppercase tracking-wider">Total Registros</p>
          <h3 className="text-2xl font-black text-white mt-1">{deudas.length}</h3>
        </div>
        <div className="bg-dark-card border-l-4 border-amber-500 border-y border-r border-dark-border p-5 rounded-2xl shadow-xl sm:col-span-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Deuda Total Activa (Pendiente + Vencida)</p>
            <h3 className="text-3xl font-black text-white mt-1">${totalPendiente.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <HiOutlineBanknotes className="text-3xl" />
          </div>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar por nombre de empresa o estatus..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gris-calido/50"
        />
      </div>

      {/* TABLA DE DEUDAS ANIMADA */}
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
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Proveedor</th>
                <th className="py-3.5 px-6 text-right">Monto</th>
                <th className="py-3.5 px-6 text-center">Estatus</th>
                <th className="py-3.5 px-6">Vencimiento</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-amber-400 font-semibold animate-pulse">Cargando cuentas por pagar...</td>
                </tr>
              ) : deudasFiltradas.length > 0 ? (
                deudasFiltradas.map((deuda, index) => {
                  const isPaid = deuda.status === 'paid';
                  const isOverdue = deuda.status === 'overdue';
                  const fechaLimpia = deuda.due_date ? deuda.due_date.split('T')[0] : 'N/A';

                  return (
                    <motion.tr 
                      key={deuda.id} 
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.3 + (index * 0.05) }}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                      className="transition-colors"
                    >
                      <td className="py-4 px-6 font-mono text-xs text-ghost-blue font-bold">
                        #{deuda.id}
                      </td>

                      <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20 shrink-0">
                          <HiOutlineBuildingStorefront className="text-lg" />
                        </div>
                        <span>{deuda.supplier?.company_name || `Proveedor #${deuda.supplier_id}`}</span>
                      </td>

                      <td className="py-4 px-6 text-right font-black text-white text-base">
                        ${Number(deuda.amount).toFixed(2)}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          isPaid 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : isOverdue 
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {deuda.status}
                        </span>
                      </td>

                      <td className={`py-4 px-6 text-xs font-mono ${isOverdue ? 'text-rose-400 font-bold' : 'text-gris-calido/70'}`}>
                        {fechaLimpia}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Editar Deuda"
                            onClick={() => handleOpenEditModal(deuda)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Eliminar"
                            onClick={() => handleDeleteDeuda(deuda.id!)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                          >
                            <HiOutlineTrash className="text-lg" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gris-calido/50">
                    No se encontraron deudas registradas con proveedores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <DeudaProveedorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedDeuda}
        onSuccess={() => {
          setIsModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </motion.div>
  );
}