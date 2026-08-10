import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { 
  HiOutlineBanknotes, 
  HiOutlineLockClosed, 
  HiOutlineLockOpen, 
  HiOutlineEye, 
  HiPlus, 
  HiXMark,
  HiOutlineClock,
  HiOutlineUser
} from 'react-icons/hi2';

interface CashRegister {
  id: number;
  employee_id: number;
  opening_cash: number;
  expected_cash?: number;
  actual_cash?: number;
  opened_at: string;
  closed_at?: string;
  employee?: {
    first_name: string;
    last_name: string;
  };
  sales?: any[];
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function CashRegistersScreen() {
  const [turnos, setTurnos] = useState<CashRegister[]>([]);
  const [activeTurno, setActiveTurno] = useState<CashRegister | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modales
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTurnoDetail, setSelectedTurnoDetail] = useState<CashRegister | null>(null);

  // Inputs para modales
  const [openingCashInput, setOpeningCashInput] = useState('');
  const [closedCashInput, setClosedCashInput] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resIndex, resActive] = await Promise.all([
          axios.get('https://api.yahirdev.dev/api/cash-registers', { headers }),
          axios.get('https://api.yahirdev.dev/api/cash-registers/active', { headers }).catch(() => ({ data: { data: null } }))
        ]);

        const listData = resIndex.data.data || resIndex.data;
        setTurnos(Array.isArray(listData) ? listData : []);

        const activeData = resActive.data.data || resActive.data;
        setActiveTurno(activeData && activeData.id ? activeData : null);
      } catch (error) {
        console.error('Error al cargar datos de caja:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const handleOpenTurno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://api.yahirdev.dev/api/cash-registers/open', {
        opening_cash: Number(openingCashInput)
      }, { headers });

      alert('Turno abierto exitosamente.');
      setIsOpeningModal(false);
      setOpeningCashInput('');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      alert(extraerMensajeError(error));
    }
  };

  const handleCloseTurno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`https://api.yahirdev.dev/api/cash-registers/${activeTurno?.id}/close`, {
        closed_cash: Number(closedCashInput)
      }, { headers });

      alert('Turno cerrado exitosamente.');
      setIsClosingModal(false);
      setClosedCashInput('');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      alert(extraerMensajeError(error));
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const response = await axios.get(`https://api.yahirdev.dev/api/cash-registers/${id}`, { headers });
      const detalle = response.data.data || response.data;
      setSelectedTurnoDetail(detalle);
      setIsDetailModalOpen(true);
    } catch (error) {
      alert(extraerMensajeError(error));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      
      {/* HEADER DINÁMICO */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-neo-mint/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-ghost-blue/10 text-ghost-blue border border-ghost-blue/20 mb-1">
            <HiOutlineBanknotes className="text-sm" /> Control Financiero
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Cortes de Caja</h1>
          <p className="text-sm text-gris-calido/75">Apertura, supervisión de turnos activos y cierres de caja.</p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          {!activeTurno ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpeningModal(true)}
              className="flex items-center gap-2 bg-neo-mint text-dark-bg font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-neo-mint/20"
            >
              <HiPlus className="text-xl font-black" />
              Abrir Turno de Caja
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsClosingModal(true)}
              className="flex items-center gap-2 bg-rose-600 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-rose-600/20"
            >
              <HiOutlineLockClosed className="text-xl" />
              Cerrar Turno Actual
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* ESTADO DE TURNO ACTIVO (BANNER RESALTADO) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 ${
          activeTurno 
            ? 'bg-gradient-to-r from-emerald-950/40 via-dark-card to-dark-card border-emerald-500/40' 
            : 'bg-dark-card border-dark-border'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl border ${activeTurno ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-dark-bg text-gris-calido/50 border-dark-border'}`}>
            {activeTurno ? <HiOutlineLockOpen className="text-3xl" /> : <HiOutlineLockClosed className="text-3xl" />}
          </div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
              activeTurno ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-dark-bg text-gris-calido/60 border-dark-border'
            }`}>
              {activeTurno ? 'Turno en Curso' : 'Sin Turno Activo'}
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              {activeTurno ? `Caja abierta con fondo inicial de: $${Number(activeTurno.opening_cash).toFixed(2)}` : 'No hay ninguna caja abierta en este momento.'}
            </h2>
            {activeTurno && (
              <p className="text-xs text-gris-calido/70 mt-0.5 flex items-center gap-2">
                <HiOutlineClock /> Abierto el: {activeTurno.opened_at.replace('T', ' ').substring(0, 16)}
              </p>
            )}
          </div>
        </div>

        {activeTurno && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewDetail(activeTurno.id)}
            className="px-4 py-2 bg-dark-bg text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/10 transition-colors shrink-0"
          >
            Ver Transacciones del Turno
          </motion.button>
        )}
      </motion.div>

      {/* HISTORIAL DE TURNOS DE CAJA */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-4"
      >
        <h2 className="text-lg font-bold text-white">Historial General de Turnos</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gris-calido">
            <thead className="bg-dark-bg/90 text-xs uppercase font-bold text-white/70 border-b border-dark-border rounded-lg">
              <tr>
                <th className="py-3.5 px-4 rounded-l-lg">ID Turno</th>
                <th className="py-3.5 px-4">Cajero / Empleado</th>
                <th className="py-3.5 px-4 text-right">Fondo Inicial</th>
                <th className="py-3.5 px-4 text-right">Esperado</th>
                <th className="py-3.5 px-4 text-right">Real en Caja</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4">Apertura / Cierre</th>
                <th className="py-3.5 px-4 text-right rounded-r-lg">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-neo-mint font-semibold animate-pulse">Cargando registros de caja...</td>
                </tr>
              ) : turnos.length > 0 ? (
                turnos.map((t, index) => {
                  const isOpen = !t.closed_at;
                  const diferencia = t.actual_cash !== undefined && t.expected_cash !== undefined 
                    ? Number(t.actual_cash) - Number(t.expected_cash) 
                    : 0;

                  return (
                    <motion.tr 
                      key={t.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                      className="transition-colors"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-ghost-blue">
                        #{t.id}
                      </td>

                      <td className="py-4 px-4 font-medium text-white flex items-center gap-2">
                        <div className="p-1.5 bg-neo-mint/10 text-neo-mint rounded-lg">
                          <HiOutlineUser />
                        </div>
                        {t.employee ? `${t.employee.first_name} ${t.employee.last_name}` : `Empleado #${t.employee_id}`}
                      </td>

                      <td className="py-4 px-4 text-right font-semibold text-white">
                        ${Number(t.opening_cash).toFixed(2)}
                      </td>

                      <td className="py-4 px-4 text-right font-semibold text-gris-calido">
                        {t.expected_cash !== undefined ? `$${Number(t.expected_cash).toFixed(2)}` : 'En curso'}
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-emerald-400">
                        {t.actual_cash !== undefined ? `$${Number(t.actual_cash).toFixed(2)}` : 'En curso'}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          isOpen 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-dark-bg text-gris-calido/70 border border-dark-border'
                        }`}>
                          {isOpen ? 'Abierto' : diferencia === 0 ? 'Cierre Exacto' : diferencia > 0 ? `Sobrante +$${diferencia.toFixed(2)}` : `Faltante -$${Math.abs(diferencia).toFixed(2)}`}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs text-gris-calido/70 font-mono">
                        <p>A: {t.opened_at.replace('T', ' ').substring(0, 16)}</p>
                        {t.closed_at && <p>C: {t.closed_at.replace('T', ' ').substring(0, 16)}</p>}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          title="Ver Detalle de Turno"
                          onClick={() => handleViewDetail(t.id)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                        >
                          <HiOutlineEye className="text-lg" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gris-calido/50">
                    No hay turnos de caja registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* MODAL APERTURA DE CAJA */}
      <AnimatePresence>
        {isOpeningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpeningModal(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-dark-card border border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HiOutlineBanknotes className="text-neo-mint text-xl" /> Apertura de Turno
                </h3>
                <button onClick={() => setIsOpeningModal(false)} className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg"><HiXMark className="text-xl" /></button>
              </div>
              <form onSubmit={handleOpenTurno} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Efectivo Inicial en Caja ($) *</label>
                  <input type="number" step="0.01" min="0" required value={openingCashInput} onChange={(e) => setOpeningCashInput(e.target.value)} placeholder="Ej. 500.00" className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neo-mint font-bold" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                  <button type="button" onClick={() => setIsOpeningModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gris-calido hover:bg-dark-bg">Cancelar</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 shadow-lg shadow-neo-mint/20">Abrir Caja</motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CIERRE DE CAJA */}
      <AnimatePresence>
        {isClosingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsClosingModal(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-dark-card border border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HiOutlineLockClosed className="text-rose-400 text-xl" /> Cierre de Turno Actual
                </h3>
                <button onClick={() => setIsClosingModal(false)} className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg"><HiXMark className="text-xl" /></button>
              </div>
              <form onSubmit={handleCloseTurno} className="p-6 space-y-4">
                <div className="p-4 bg-dark-bg rounded-xl border border-dark-border text-xs space-y-1">
                  <p className="text-gris-calido">Fondo inicial registrado: <span className="text-white font-bold">${Number(activeTurno?.opening_cash || 0).toFixed(2)}</span></p>
                  <p className="text-gris-calido/60">El sistema calculará automáticamente el total de ventas en efectivo y tarjeta realizadas durante este turno.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Efectivo Físico Contado en Caja ($) *</label>
                  <input type="number" step="0.01" min="0" required value={closedCashInput} onChange={(e) => setClosedCashInput(e.target.value)} placeholder="Ej. 2450.00" className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 font-bold" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                  <button type="button" onClick={() => setIsClosingModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gris-calido hover:bg-dark-bg">Cancelar</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/20">Finalizar Cierre</motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DETALLE DE TURNO */}
      <AnimatePresence>
        {isDetailModalOpen && selectedTurnoDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-dark-card border border-dark-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
                <h3 className="text-lg font-bold text-white">Detalle del Turno #{selectedTurnoDetail.id}</h3>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg"><HiXMark className="text-xl" /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-dark-bg p-3 rounded-xl border border-dark-border">
                    <p className="text-gris-calido/60 uppercase">Fondo Inicial</p>
                    <p className="text-white font-bold text-base mt-1">${Number(selectedTurnoDetail.opening_cash).toFixed(2)}</p>
                  </div>
                  <div className="bg-dark-bg p-3 rounded-xl border border-dark-border">
                    <p className="text-gris-calido/60 uppercase">Esperado</p>
                    <p className="text-white font-bold text-base mt-1">{selectedTurnoDetail.expected_cash !== undefined ? `$${Number(selectedTurnoDetail.expected_cash).toFixed(2)}` : 'N/A'}</p>
                  </div>
                  <div className="bg-dark-bg p-3 rounded-xl border border-dark-border">
                    <p className="text-gris-calido/60 uppercase">Real en Caja</p>
                    <p className="text-emerald-400 font-bold text-base mt-1">{selectedTurnoDetail.actual_cash !== undefined ? `$${Number(selectedTurnoDetail.actual_cash).toFixed(2)}` : 'Abierto'}</p>
                  </div>
                  <div className="bg-dark-bg p-3 rounded-xl border border-dark-border">
                    <p className="text-gris-calido/60 uppercase">Empleado</p>
                    <p className="text-ghost-blue font-bold text-xs mt-1 truncate">{selectedTurnoDetail.employee?.first_name || 'N/A'}</p>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-neo-mint uppercase tracking-wider pt-2">Ventas Asociadas a este Turno ({selectedTurnoDetail.sales?.length || 0})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gris-calido">
                    <thead className="bg-dark-bg text-white/70 border-b border-dark-border">
                      <tr>
                        <th className="py-2.5 px-3">ID Venta</th>
                        <th className="py-2.5 px-3">Método</th>
                        <th className="py-2.5 px-3 text-right">Efectivo</th>
                        <th className="py-2.5 px-3 text-right">Tarjeta</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                      {selectedTurnoDetail.sales && selectedTurnoDetail.sales.length > 0 ? (
                        selectedTurnoDetail.sales.map((s: any) => (
                          <tr key={s.id} className="hover:bg-dark-bg/40">
                            <td className="py-2.5 px-3 font-mono text-ghost-blue">#{s.id}</td>
                            <td className="py-2.5 px-3 uppercase">{s.payment_method}</td>
                            <td className="py-2.5 px-3 text-right">${Number(s.cash_amount || 0).toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-right">${Number(s.card_amount || 0).toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-emerald-400">${Number(s.total_price || 0).toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gris-calido/50">No hay ventas registradas en este turno.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end px-6 py-4 border-t border-dark-border bg-dark-bg/50">
                <button type="button" onClick={() => setIsDetailModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-semibold bg-dark-bg border border-dark-border text-white hover:bg-dark-card">Cerrar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}