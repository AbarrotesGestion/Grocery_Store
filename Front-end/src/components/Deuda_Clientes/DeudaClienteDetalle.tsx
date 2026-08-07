import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlinePencilSquare, 
  HiOutlinePhone, 
  HiOutlineInformationCircle,
  HiOutlineBanknotes
} from 'react-icons/hi2';
import DeudaClienteModal, { type DeudaClienteData } from './DeudaClienteModal';

export default function DeudaClienteDetalle() {
  const { id } = useParams();

  const [deuda, setDeuda] = useState<DeudaClienteData>({
    id: Number(id) || 5,
    clienteId: 2,
    clienteNombre: 'Carlos López',
    fechaInicio: '01 Jan, 2025',
    fechaVencimiento: '15 Jan, 2025',
    monto: 200.00,
    estado: 'Overdue',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex items-center justify-between">
        <Link 
          to="/client-debts" 
          className="inline-flex items-center gap-2 text-sm text-gris-calido/70 hover:text-neo-mint transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          Volver a cobros
        </Link>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          <HiOutlinePencilSquare className="text-lg" />
          Editar
        </button>
      </div>

      <div className="max-w-xl mx-auto bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-2xl">
        
        <div className="bg-dark-bg/90 border-b border-dark-border p-6 text-center">
          <p className="text-xs font-bold text-gris-calido/60 uppercase tracking-widest">
            SALDO PENDIENTE DEL CLIENTE
          </p>
          <h1 className="text-4xl font-extrabold text-white mt-2">
            ${deuda.monto.toFixed(2)}
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-end">
            <span className="px-3 py-1 rounded text-xs font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {deuda.estado}
            </span>
          </div>

          <div className="space-y-4 text-xs divide-y divide-dark-border">
            <div className="flex justify-between py-2">
              <span className="text-gris-calido/70">Fecha del Crédito:</span>
              <span className="text-white font-medium">{deuda.fechaInicio}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gris-calido/70">Fecha de Vencimiento:</span>
              <span className="text-rose-400 font-bold">{deuda.fechaVencimiento}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gris-calido/70">Teléfono Cliente:</span>
              <span className="text-white font-medium flex items-center gap-1.5">
                <HiOutlinePhone className="text-neo-mint" />
                3310002202
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 bg-dark-bg rounded-lg border border-dark-border text-xs text-gris-calido/60">
            <HiOutlineInformationCircle className="text-lg text-amber-400 shrink-0" />
            <p>Esta deuda fue registrada originalmente en el sistema.</p>
          </div>
        </div>
      </div>

      <DeudaClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(updated) => setDeuda(updated)}
        initialData={deuda}
        clientesList={[{ id: 2, nombre: 'Carlos López' }]}
      />
    </div>
  );
}