import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiXMark, HiOutlineUserGroup } from 'react-icons/hi2';
import { type Empleado } from './EmpleadoDetalle';

interface EmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Empleado) => void;
  initialData?: Empleado | null;
}

export default function EmpleadoModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EmpleadoModalProps) {
  const [tab, setTab] = useState<'personales' | 'laborales'>('personales');

  const [formData, setFormData] = useState<Empleado>({
    payroll_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    full_address: '',
    hourly_rate: 80,
    card_number: '',
    role_id: 1,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          payroll_id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          full_address: '',
          hourly_rate: 80,
          card_number: '',
          role_id: 1,
        });
      }
      setTab('personales');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
            className="relative bg-dark-card border border-dark-border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden my-8 z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineUserGroup className="text-neo-mint text-xl" />
                {initialData ? `Editar Empleado: ${initialData.first_name}` : 'Registrar Nuevo Empleado'}
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg transition-colors"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <div className="flex border-b border-dark-border bg-dark-bg/50 px-6 pt-3">
              <button
                type="button"
                onClick={() => setTab('personales')}
                className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                  tab === 'personales'
                    ? 'border-neo-mint text-neo-mint'
                    : 'border-transparent text-gris-calido/60 hover:text-white'
                }`}
              >
                Datos Personales
              </button>
              <button
                type="button"
                onClick={() => setTab('laborales')}
                className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                  tab === 'laborales'
                    ? 'border-neo-mint text-neo-mint'
                    : 'border-transparent text-gris-calido/60 hover:text-white'
                }`}
              >
                Laboral y Pagos
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {tab === 'personales' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                        Nombre(s) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        placeholder="Ej. Rosa"
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                        Apellido(s) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        placeholder="Ej. Martinez"
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="correo@tienda.com"
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                        Teléfono Móvil *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="3300002222"
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                      Domicilio Completo *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.full_address}
                      onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                      placeholder="Calle, Número, Colonia, Municipio"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint resize-none"
                    />
                  </div>
                </div>
              )}

              {tab === 'laborales' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                        ID Nómina *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.payroll_id}
                        onChange={(e) => setFormData({ ...formData, payroll_id: e.target.value })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-ghost-blue font-semibold focus:outline-none focus:border-neo-mint"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                        Rol / Puesto (ID) *
                      </label>
                      <select
                        value={formData.role_id}
                        onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                      >
                        <option value={1} className="bg-dark-card text-white">Administrador (ID: 1)</option>
                        <option value={2} className="bg-dark-card text-white">Cajero (ID: 2)</option>
                        <option value={3} className="bg-dark-card text-white">Almacenista (ID: 3)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                        Pago por Hora ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={formData.hourly_rate}
                        onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                      Número de Tarjeta / Cuenta Depósito *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={255}
                      value={formData.card_number}
                      onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                      placeholder="Número de cuenta o tarjeta"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                    />
                  </div>

                  {!initialData && (
                    <div className="p-3.5 bg-neo-mint/10 border border-neo-mint/20 rounded-lg text-xs text-neo-mint">
                      <p className="font-semibold">Nota de Acceso:</p>
                      <p className="opacity-85">Se creará un acceso automático en el sistema para este empleado utilizando su correo electrónico.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-dark-border">
                {tab === 'personales' ? (
                  <button
                    type="button"
                    onClick={() => setTab('laborales')}
                    className="text-xs font-semibold text-ghost-blue hover:underline"
                  >
                    Siguiente: Datos Laborales →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTab('personales')}
                    className="text-xs font-semibold text-gris-calido hover:underline"
                  >
                    ← Volver a Datos Personales
                  </button>
                )}

                <div className="flex gap-3">
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
                    {initialData ? 'Actualizar Información' : 'Finalizar Registro'}
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