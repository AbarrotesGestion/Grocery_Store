import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiXMark, HiOutlineLockClosed } from 'react-icons/hi2';

interface CerrarCajaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseCaja: (closedCash: number) => void;
  openingCash: number;
}

export default function CerrarCajaModal({ isOpen, onClose, onCloseCaja, openingCash }: CerrarCajaModalProps) {
  const [closedCash, setClosedCash] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCloseCaja(Number(closedCash));
    setClosedCash('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-dark-card border border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10">
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HiOutlineLockClosed className="text-rose-400 text-xl" /> Cierre de Turno Actual
            </h3>
            <button onClick={onClose} className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg"><HiXMark className="text-xl" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-4 bg-dark-bg rounded-xl border border-dark-border text-xs space-y-1">
              <p className="text-gris-calido">Fondo inicial registrado: <span className="text-white font-bold">${Number(openingCash).toFixed(2)}</span></p>
              <p className="text-gris-calido/60">El sistema calculará automáticamente el efectivo y tarjeta esperados frente a lo que ingreses físicamente.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Efectivo Físico Contado ($) *</label>
              <input type="number" step="0.01" min="0" required value={closedCash} onChange={(e) => setClosedCash(e.target.value)} placeholder="Ej. 2450.00" className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 font-bold" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gris-calido hover:bg-dark-bg">Cancelar</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/20">Finalizar Cierre</motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}