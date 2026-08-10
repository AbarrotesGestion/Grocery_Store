import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { 
  HiOutlineWallet, 
  HiOutlineBanknotes, 
  HiOutlineArrowDownTray, 
  HiOutlinePencilSquare, 
  HiOutlineSparkles,
  HiXMark 
} from 'react-icons/hi2';

interface ProviderFund {
  id: number;
  defined_amount: number;
  extraction_limit: number;
  available_balance: number;
  created_by?: number;
  created_at?: string;
  created_by_user?: {
    first_name?: string;
    last_name?: string;
    name?: string;
  };
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function ProviderFundsScreen() {
  const [funds, setFunds] = useState<ProviderFund[]>([]);
  const [suppliersPending, setSuppliersPending] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modales
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<ProviderFund | null>(null);
  const [extractionAmount, setExtractionAmount] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    defined_amount: '',
    extraction_limit: '',
    available_balance: ''
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchFunds = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://api.yahirdev.dev/api/provider-funds', { headers });
        const resData = response.data;
        
        setFunds(Array.isArray(resData.data) ? resData.data : []);
        setSuppliersPending(Array.isArray(resData.suppliers_pending) ? resData.suppliers_pending : []);
      } catch (error) {
        console.error('Error al cargar fondos de proveedores:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunds();
  }, [refreshTrigger]);

  const handleOpenExtract = (fund: ProviderFund) => {
    setSelectedFund(fund);
    setExtractionAmount('');
    setIsExtractModalOpen(true);
  };

  const handleExtractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFund) return;

    try {
      await axios.post(`https://api.yahirdev.dev/api/provider-funds/${selectedFund.id}/extract`, {
        amount: Number(extractionAmount)
      }, { headers });

      alert('Extracción realizada con éxito.');
      setIsExtractModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      alert(extraerMensajeError(error));
    }
  };

  const handleOpenEdit = (fund: ProviderFund) => {
    setSelectedFund(fund);
    setEditFormData({
      defined_amount: String(fund.defined_amount),
      extraction_limit: String(fund.extraction_limit),
      available_balance: String(fund.available_balance)
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFund) return;

    try {
      await axios.put(`https://api.yahirdev.dev/api/provider-funds/${selectedFund.id}`, {
        defined_amount: Number(editFormData.defined_amount),
        extraction_limit: Number(editFormData.extraction_limit),
        available_balance: Number(editFormData.available_balance)
      }, { headers });

      alert('Fondo actualizado exitosamente.');
      setIsEditModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      alert(extraerMensajeError(error));
    }
  };

  const totalBalance = funds.reduce((acc, curr) => acc + Number(curr.available_balance || 0), 0);

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
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-neo-mint/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neo-mint/10 text-neo-mint border border-neo-mint/20 mb-1">
            <HiOutlineSparkles className="text-sm" /> Tesorería y Fondos
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Fondos de Proveedores</h1>
          <p className="text-sm text-gris-calido/75">Supervisión de saldos disponibles, límites de extracción y pagos a proveedores.</p>
        </div>

        <div className="bg-dark-bg px-5 py-3 rounded-xl border border-dark-border text-right relative z-10">
          <p className="text-[10px] font-bold text-gris-calido/60 uppercase tracking-widest">Balance Global Disponible</p>
          <p className="text-2xl font-black text-emerald-400">${totalBalance.toFixed(2)}</p>
        </div>
      </motion.div>

      {/* LISTADO DE FONDOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-neo-mint font-semibold animate-pulse">Cargando fondos disponibles...</div>
        ) : funds.length > 0 ? (
          funds.map((fund, index) => (
            <motion.div 
              key={fund.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-neo-mint/10 text-neo-mint rounded-xl border border-neo-mint/20">
                    <HiOutlineWallet className="text-2xl" />
                  </div>
                  <span className="text-xs font-mono font-bold text-ghost-blue bg-dark-bg px-2.5 py-1 rounded-lg border border-dark-border">
                    Fondo #{fund.id}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-gris-calido/60 uppercase tracking-wider">Saldo Disponible</p>
                  <h3 className="text-3xl font-black text-white mt-1">${Number(fund.available_balance).toFixed(2)}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dark-border text-xs">
                  <div className="bg-dark-bg p-3 rounded-xl border border-dark-border/60">
                    <p className="text-gris-calido/60">Monto Definido</p>
                    <p className="text-white font-bold text-sm mt-0.5">${Number(fund.defined_amount).toFixed(2)}</p>
                  </div>
                  <div className="bg-dark-bg p-3 rounded-xl border border-dark-border/60">
                    <p className="text-gris-calido/60">Límite Extracción</p>
                    <p className="text-amber-400 font-bold text-sm mt-0.5">${Number(fund.extraction_limit).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenExtract(fund)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all shadow-sm"
                >
                  <HiOutlineArrowDownTray className="text-base" /> Extraer Saldo
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenEdit(fund)}
                  className="flex items-center justify-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all shadow-sm"
                >
                  <HiOutlinePencilSquare className="text-base" /> Editar
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gris-calido/50">
            No hay registros de fondos de proveedores.
          </div>
        )}
      </div>

      {/* SECCIÓN INFORMATIVA DE PROVEEDORES CON DEUDAS PENDIENTES */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-4"
      >
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HiOutlineBanknotes className="text-neo-mint text-xl" /> Resumen de Deudas Activas por Proveedor
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gris-calido">
            <thead className="bg-dark-bg/90 text-xs uppercase font-bold text-white/70 border-b border-dark-border rounded-lg">
              <tr>
                <th className="py-3.5 px-4 rounded-l-lg">Proveedor / Empresa</th>
                <th className="py-3.5 px-4">Contacto</th>
                <th className="py-3.5 px-4 text-right rounded-r-lg">Deuda Acumulada Pendiente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {suppliersPending.length > 0 ? (
                suppliersPending.map((sup: any) => (
                  <tr key={sup.id} className="hover:bg-dark-bg/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{sup.company_name}</td>
                    <td className="py-3.5 px-4 text-xs">{sup.contact_name} ({sup.phone || 'Sin teléfono'})</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-rose-400">
                      ${Number(sup.debts_sum_amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gris-calido/50">No hay deudas activas registradas con proveedores.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* MODAL DE EXTRACCIÓN */}
      <AnimatePresence>
        {isExtractModalOpen && selectedFund && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsExtractModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-dark-card border border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HiOutlineArrowDownTray className="text-emerald-400 text-xl" /> Extraer Saldo de Fondo #{selectedFund.id}
                </h3>
                <button onClick={() => setIsExtractModalOpen(false)} className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg"><HiXMark className="text-xl" /></button>
              </div>
              <form onSubmit={handleExtractSubmit} className="p-6 space-y-4">
                <div className="p-4 bg-dark-bg rounded-xl border border-dark-border text-xs space-y-1">
                  <p className="text-gris-calido">Saldo actual disponible: <span className="text-emerald-400 font-bold">${Number(selectedFund.available_balance).toFixed(2)}</span></p>
                  <p className="text-gris-calido/60">Límite permitido de extracción: ${Number(selectedFund.extraction_limit).toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Monto a Extraer ($) *</label>
                  <input type="number" step="0.01" min="0.01" max={selectedFund.available_balance} required value={extractionAmount} onChange={(e) => setExtractionAmount(e.target.value)} placeholder="Ej. 1000.00" className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                  <button type="button" onClick={() => setIsExtractModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gris-calido hover:bg-dark-bg">Cancelar</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-dark-bg hover:bg-emerald-400 shadow-lg shadow-emerald-500/20">Confirmar Extracción</motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE EDICIÓN */}
      <AnimatePresence>
        {isEditModalOpen && selectedFund && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-dark-card border border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HiOutlinePencilSquare className="text-amber-400 text-xl" /> Editar Fondo #{selectedFund.id}
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg"><HiXMark className="text-xl" /></button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Monto Definido ($)</label>
                  <input type="number" step="0.01" min="0" required value={editFormData.defined_amount} onChange={(e) => setEditFormData({ ...editFormData, defined_amount: e.target.value })} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Límite de Extracción ($)</label>
                  <input type="number" step="0.01" min="0" required value={editFormData.extraction_limit} onChange={(e) => setEditFormData({ ...editFormData, extraction_limit: e.target.value })} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Saldo Disponible ($)</label>
                  <input type="number" step="0.01" min="0" required value={editFormData.available_balance} onChange={(e) => setEditFormData({ ...editFormData, available_balance: e.target.value })} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gris-calido hover:bg-dark-bg">Cancelar</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-dark-bg hover:bg-amber-400 shadow-lg shadow-amber-500/20">Guardar Cambios</motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}