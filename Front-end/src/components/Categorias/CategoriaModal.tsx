import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiXMark } from 'react-icons/hi2';

interface CategoriaData {
  id?: number;
  name: string;
  description: string;
}

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoriaData) => void;
  initialData?: CategoriaData | null;
}

export default function CategoriaModal({ isOpen, onClose, onSave, initialData }: CategoriaModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setDescription(initialData?.description || '');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: initialData?.id, name, description });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative bg-dark-card border border-dark-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'Editar Categoría' : 'Nueva Categoría'}
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
                  Nombre de la Categoría *
                </label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Abarrotes, Bebidas..."
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors placeholder:text-gris-calido/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Descripción
                </label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descripción de los productos..."
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors placeholder:text-gris-calido/40 resize-none"
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
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 transition-all shadow-md shadow-neo-mint/10"
                >
                  {initialData ? 'Guardar Cambios' : 'Crear Categoría'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}