import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiPlus, 
  HiOutlineUser, 
  HiOutlineEye, 
  HiOutlinePencilSquare, 
  HiOutlineTrash,
  HiOutlineBanknotes,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import DeudaClienteModal, { type DeudaClienteData } from './DeudaClienteModal';

export default function CobrosClientesScreen() {
  const navigate = useNavigate();

  const clientesList = [
    { id: 1, nombre: 'Ana García' },
    { id: 2, nombre: 'Carlos López' },
    { id: 3, nombre: 'Elena Torres' },
    { id: 4, nombre: 'Fernando Castro' },
    { id: 5, nombre: 'Jorge Martínez' },
    { id: 7, nombre: 'Luis Yahir' },
    { id: 8, nombre: 'María Rodríguez' },
    { id: 9, nombre: 'Ricardo Sánchez' },
    { id: 10, nombre: 'Sofía Ramírez' },
  ];

  const [deudas, setDeudas] = useState<DeudaClienteData[]>([
    { id: 1, clienteId: 3, clienteNombre: 'Elena Torres', fechaInicio: '01/01/25', fechaVencimiento: '15/01/25', monto: 200.00, estado: 'Overdue' },
    { id: 2, clienteId: 1, clienteNombre: 'Ana García', fechaInicio: '03/03/26', fechaVencimiento: '10/03/26', monto: 150.00, estado: 'Pending' },
    { id: 3, clienteId: 2, clienteNombre: 'Carlos López', fechaInicio: '03/03/26', fechaVencimiento: '10/03/26', monto: 45.00, estado: 'Paid' },
    { id: 4, clienteId: 7, clienteNombre: 'Luis Yahir', fechaInicio: '03/03/26', fechaVencimiento: '10/03/26', monto: 120.00, estado: 'Pending' },
    { id: 5, clienteId: 10, clienteNombre: 'Sofía Ramírez', fechaInicio: '03/03/26', fechaVencimiento: '10/03/26', monto: 35.00, estado: 'Pending' },
    { id: 6, clienteId: 8, clienteNombre: 'María Rodríguez', fechaInicio: '03/03/26', fechaVencimiento: '10/03/26', monto: 10.00, estado: 'Pending' },
    { id: 7, clienteId: 5, clienteNombre: 'Jorge Martínez', fechaInicio: '03/03/26', fechaVencimiento: '10/03/26', monto: 95.00, estado: 'Pending' },
    { id: 8, clienteId: 4, clienteNombre: 'Fernando Castro', fechaInicio: '03/03/26', fechaVencimiento: '18/03/26', monto: 65.00, estado: 'Pending' },
    { id: 9, clienteId: 9, clienteNombre: 'Ricardo Sánchez', fechaInicio: '03/03/26', fechaVencimiento: '18/03/26', monto: 69.00, estado: 'Pending' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeuda, setSelectedDeuda] = useState<DeudaClienteData | null>(null);

  const pendienteCobro = deudas.filter(d => d.estado === 'Pending').reduce((acc, curr) => acc + curr.monto, 0);
  const totalVencido = deudas.filter(d => d.estado === 'Overdue').reduce((acc, curr) => acc + curr.monto, 0);
  const totalRecuperado = deudas.filter(d => d.estado === 'Paid').reduce((acc, curr) => acc + curr.monto, 0);

  const handleOpenNewModal = () => {
    setSelectedDeuda(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (d: DeudaClienteData) => {
    setSelectedDeuda(d);
    setIsModalOpen(true);
  };

  const handleSaveDeuda = (data: DeudaClienteData) => {
    if (data.id) {
      setDeudas(prev => prev.map(item => item.id === data.id ? data : item));
    } else {
      const newDeuda = { ...data, id: Date.now() };
      setDeudas(prev => [newDeuda, ...prev]);
    }
  };

  const handleDeleteDeuda = (id: number) => {
    if (confirm('¿Eliminar registro de deuda?')) {
      setDeudas(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Cuentas por Cobrar (Clientes)</h1>
          <p className="text-sm text-gris-calido/70">Control de deudas, fechas de vencimiento y pagos.</p>
        </div>
        
        <button 
          onClick={handleOpenNewModal}
          className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
        >
          <HiPlus className="text-lg font-bold" />
          Registrar Deuda
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-dark-card border-l-4 border-amber-500 border-y border-r border-dark-border p-5 rounded-xl">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">PENDIENTE DE COBRO</p>
          <h3 className="text-2xl font-bold text-white mt-1">${pendienteCobro.toFixed(2)}</h3>
        </div>

        <div className="bg-dark-card border-l-4 border-rose-500 border-y border-r border-dark-border p-5 rounded-xl">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">TOTAL VENCIDO</p>
          <h3 className="text-2xl font-bold text-rose-400 mt-1">${totalVencido.toFixed(2)}</h3>
        </div>

        <div className="bg-dark-card border-l-4 border-emerald-500 border-y border-r border-dark-border p-5 rounded-xl">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">TOTAL RECUPERADO</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">${totalRecuperado.toFixed(2)}</h3>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gris-calido">
            <thead className="bg-dark-bg/80 text-xs uppercase font-semibold text-white/70 border-b border-dark-border">
              <tr>
                <th className="py-3.5 px-6">Cliente</th>
                <th className="py-3.5 px-6">F. Inicio</th>
                <th className="py-3.5 px-6">Vencimiento</th>
                <th className="py-3.5 px-6 text-right">Monto</th>
                <th className="py-3.5 px-6 text-center">Estado</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {deudas.map((d) => {
                const isOverdue = d.estado === 'Overdue';
                const isPaid = d.estado === 'Paid';

                return (
                  <tr key={d.id} className="hover:bg-dark-bg/40 transition-colors">
                    
                    <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                      <div className="p-2 bg-neo-mint/10 rounded-full text-neo-mint">
                        <HiOutlineUser className="text-base" />
                      </div>
                      <span>ID: #{d.clienteId}</span>
                    </td>

                    <td className="py-4 px-6 text-xs text-gris-calido/80">
                      {d.fechaInicio}
                    </td>

                    <td className={`py-4 px-6 text-xs font-semibold ${isOverdue ? 'text-rose-400' : 'text-gris-calido/80'}`}>
                      {d.fechaVencimiento}
                    </td>

                    <td className="py-4 px-6 text-right font-bold text-white">
                      ${d.monto.toFixed(2)}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                        isPaid 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : isOverdue 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {d.estado}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          title="Ver Detalle"
                          onClick={() => navigate(`/Cliente-deudas/${d.id}`)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                        >
                          <HiOutlineEye className="text-lg" />
                        </button>

                        <button 
                          title="Editar Cobro"
                          onClick={() => handleOpenEditModal(d)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <HiOutlinePencilSquare className="text-lg" />
                        </button>

                        <button 
                          title="Eliminar"
                          onClick={() => handleDeleteDeuda(d.id!)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                        >
                          <HiOutlineTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <DeudaClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDeuda}
        initialData={selectedDeuda}
        clientesList={clientesList}
      />
    </div>
  );
}