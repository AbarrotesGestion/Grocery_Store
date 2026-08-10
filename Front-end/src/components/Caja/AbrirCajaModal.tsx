import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiXMark, HiOutlineBanknotes } from 'react-icons/hi2';

interface AbrirCajaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCaja: (openingCash: number) => void;
}

export default function AbrirCajaModal({ isOpen, onClose, onOpenCaja }: AbrirCajaModalProps) {
  const [openingCash, setOpeningCash] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenCaja(Number(openingCash));
    setOpeningCash('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-dark-card border border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10">
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HiOutlineBanknotes className="text-neo-mint text-xl" /> Apertura de Turno
            </h3>
            <button onClick={onClose} className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg"><HiXMark className="text-xl" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">Efectivo Inicial en Caja ($) *</label>
              <input type="number" step="0.01" min="0" required value={openingCash} onChange={(e) => setOpeningCash(e.target.value)} placeholder="Ej. 500.00" className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neo-mint font-bold" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gris-calido hover:bg-dark-bg">Cancelar</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 shadow-lg shadow-neo-mint/20">Abrir Caja</motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}