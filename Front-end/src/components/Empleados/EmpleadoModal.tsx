import React, { useState, useEffect } from 'react';
import { HiXMark, HiOutlineUserGroup, HiOutlineIdentification, HiOutlineCreditCard } from 'react-icons/hi2';

export interface EmpleadoData {
  id?: number;
  idNomina: string;
  nombre: string;
  apellido: string;
  rol: 'Cajero' | 'Almacenista' | 'Administrador';
  tarifaHora: number;
  email: string;
  telefono: string;
  domicilio: string;
  cuentaDeposito: string;
  fechaRegistro?: string;
  estado?: 'Activo' | 'Inactivo';
}

interface EmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmpleadoData) => void;
  initialData?: EmpleadoData | null;
}

export default function EmpleadoModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EmpleadoModalProps) {
  const [tab, setTab] = useState<'personales' | 'laborales'>('personales');

  const [formData, setFormData] = useState<EmpleadoData>({
    idNomina: '',
    nombre: '',
    apellido: '',
    rol: 'Cajero',
    tarifaHora: 0,
    email: '',
    telefono: '',
    domicilio: '',
    cuentaDeposito: '',
    estado: 'Activo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        idNomina: `EMP-${Math.floor(100 + Math.random() * 900)}`,
        nombre: '',
        apellido: '',
        rol: 'Cajero',
        tarifaHora: 80,
        email: '',
        telefono: '',
        domicilio: '',
        cuentaDeposito: '',
        estado: 'Activo',
      });
    }
    setTab('personales');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-dark-card border border-dark-border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden my-8">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HiOutlineUserGroup className="text-neo-mint text-xl" />
            {initialData ? `Editar Empleado: ${initialData.nombre}` : 'Registrar Nuevo Empleado'}
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
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Nombre(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    placeholder="Ej. Melano"
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
                    Teléfono Móvil
                  </label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="3300002222"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Domicilio Completo
                </label>
                <textarea
                  rows={2}
                  value={formData.domicilio}
                  onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
                  placeholder="Calle, Número, Colonia, Municipio"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint resize-none"
                />
              </div>
            </div>
          )}

          {tab === 'laborales' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    ID Nómina
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.idNomina}
                    onChange={(e) => setFormData({ ...formData, idNomina: e.target.value })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-ghost-blue font-semibold focus:outline-none focus:border-neo-mint"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Rol / Puesto *
                  </label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value as EmpleadoData['rol'] })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                  >
                    <option value="Cajero" className="bg-dark-card text-white">Cajero</option>
                    <option value="Almacenista" className="bg-dark-card text-white">Almacenista</option>
                    <option value="Administrador" className="bg-dark-card text-white">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                    Pago por Hora ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.tarifaHora}
                    onChange={(e) => setFormData({ ...formData, tarifaHora: Number(e.target.value) })}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Número de Tarjeta / Cuenta Depósito
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.cuentaDeposito}
                  onChange={(e) => setFormData({ ...formData, cuentaDeposito: e.target.value })}
                  placeholder="Número de 16 dígitos"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                />
              </div>

              {!initialData && (
                <div className="p-3.5 bg-neo-mint/10 border border-neo-mint/20 rounded-lg text-xs text-neo-mint">
                  <p className="font-semibold">Nota de Acceso:</p>
                  <p className="opacity-80">Se creará un acceso para el empleado usando su correo electrónico y la clave por defecto <code className="bg-black/30 px-1 rounded">password</code>.</p>
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
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 transition-all shadow-md shadow-neo-mint/10"
              >
                {initialData ? 'Actualizar Información' : 'Finalizar Registro'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}