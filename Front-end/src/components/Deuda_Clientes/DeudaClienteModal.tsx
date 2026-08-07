import React, { useState, useEffect } from 'react';
import { HiXMark, HiOutlineBanknotes } from 'react-icons/hi2';

export interface DeudaClienteData {
  id?: number;
  clienteId: number | string;
  clienteNombre?: string;
  fechaInicio: string;
  fechaVencimiento: string;
  monto: number;
  estado: 'Pending' | 'Overdue' | 'Paid';
}

interface DeudaClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DeudaClienteData) => void;
  initialData?: DeudaClienteData | null;
  clientesList: { id: number; nombre: string }[];
}

export default function DeudaClienteModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  clientesList,
}: DeudaClienteModalProps) {
  const [formData, setFormData] = useState<DeudaClienteData>({
    clienteId: clientesList[0]?.id || '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    monto: 0,
    estado: 'Pending',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        clienteId: clientesList[0]?.id || '',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaVencimiento: '',
        monto: 0,
        estado: 'Pending',
      });
    }
  }, [initialData, isOpen, clientesList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clienteObj = clientesList.find(c => Number(c.id) === Number(formData.clienteId));
    onSave({
      ...formData,
      clienteNombre: clienteObj ? clienteObj.nombre : `ID: #${formData.clienteId}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-dark-card border border-dark-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden my-8">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HiOutlineBanknotes className="text-neo-mint text-xl" />
            {initialData ? 'Editar Cobro Pendiente' : 'Registrar Nueva Deuda'}
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
              Cliente *
            </label>
            <select
              value={formData.clienteId}
              onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors"
            >
              {clientesList.map((cli) => (
                <option key={cli.id} value={cli.id} className="bg-dark-card text-white">
                  {cli.nombre} (ID: #{cli.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                Fecha Inicio *
              </label>
              <input
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neo-mint"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                Fecha Vencimiento *
              </label>
              <input
                type="date"
                required
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neo-mint"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                Monto a Cobrar ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                Actualizar Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'Pending' | 'Overdue' | 'Paid' })}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint transition-colors"
              >
                <option value="Pending" className="bg-dark-card text-amber-400">Pendiente (Pending)</option>
                <option value="Overdue" className="bg-dark-card text-rose-400">Vendido / Vencido (Overdue)</option>
                <option value="Paid" className="bg-dark-card text-emerald-400">Pagado (Paid)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gris-calido hover:bg-dark-bg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 transition-all shadow-md shadow-neo-mint/10"
            >
              {initialData ? 'Guardar Cambios' : 'Registrar Deuda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}