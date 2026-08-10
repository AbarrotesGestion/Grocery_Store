import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineUser, 
  HiOutlineEye, 
  HiOutlinePencilSquare, 
  HiOutlineTrash
} from 'react-icons/hi2';
import DeudaClienteModal, { type Deuda } from './DeudaClienteModal';

interface Cliente {
  id: number;
  first_name: string;
  last_name: string;
}

export default function CobrosClientesScreen() {
  const navigate = useNavigate();

  const [clientesList, setClientesList] = useState<Cliente[]>([]);
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeuda, setSelectedDeuda] = useState<Deuda | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchDatos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [clientesRes, deudasRes] = await Promise.all([
          axios.get('https://api.yahirdev.dev/api/clients', { headers }),
          axios.get('https://api.yahirdev.dev/api/client-debts', { headers })
        ]);

        const clientesData = clientesRes.data.data || clientesRes.data;
        const deudasData = deudasRes.data.data || deudasRes.data;

        setClientesList(Array.isArray(clientesData) ? clientesData : []);
        setDeudas(Array.isArray(deudasData) ? deudasData : []);

      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatos();
  }, [refreshTrigger]);

  const obtenerMonto = (d: Deuda) => Number(d.balance_due || 0);

  const pendienteCobro = deudas.filter(d => d.status === 'pending').reduce((acc, curr) => acc + obtenerMonto(curr), 0);
  const totalVencido = deudas.filter(d => d.status === 'overdue').reduce((acc, curr) => acc + obtenerMonto(curr), 0);
  const totalRecuperado = deudas.filter(d => d.status === 'paid').reduce((acc, curr) => acc + obtenerMonto(curr), 0);

  const handleOpenNewModal = () => {
    setSelectedDeuda(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (d: Deuda) => {
    setSelectedDeuda(d);
    setIsModalOpen(true);
  };

  const handleSaveDeuda = async (data: Deuda) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (data.id) {
        await axios.put(`https://api.yahirdev.dev/api/client-debts/${data.id}`, data, { headers });
      } else {
        await axios.post('https://api.yahirdev.dev/api/client-debts', data, { headers });
      }
      
      setRefreshTrigger(prev => prev + 1);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar la deuda:', error);
      alert('Hubo un error al guardar el registro. Revisa la consola para más detalles.');
    }
  };

  const handleDeleteDeuda = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este registro de deuda?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yahirdev.dev/api/client-debts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setDeudas(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar. El servidor respondió con un error (probablemente la deuda sigue pendiente).');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Cuentas por Cobrar (Clientes)</h1>
          <p className="text-sm text-gris-calido/70">Control de deudas, fechas de vencimiento y pagos.</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenNewModal}
          className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
        >
          <HiPlus className="text-lg font-bold" />
          Registrar Deuda
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-dark-card border-l-4 border-amber-500 border-y border-r border-dark-border p-5 rounded-xl shadow-sm"
        >
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">PENDIENTE DE COBRO</p>
          <h3 className="text-2xl font-bold text-white mt-1">${pendienteCobro.toFixed(2)}</h3>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-dark-card border-l-4 border-rose-500 border-y border-r border-dark-border p-5 rounded-xl shadow-sm"
        >
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">TOTAL VENCIDO</p>
          <h3 className="text-2xl font-bold text-rose-400 mt-1">${totalVencido.toFixed(2)}</h3>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-dark-card border-l-4 border-emerald-500 border-y border-r border-dark-border p-5 rounded-xl shadow-sm"
        >
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">TOTAL RECUPERADO</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">${totalRecuperado.toFixed(2)}</h3>
        </motion.div>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neo-mint">
                    Cargando información...
                  </td>
                </tr>
              ) : deudas.length > 0 ? (
                deudas.map((d, index) => {
                  const isOverdue = d.status === 'overdue';
                  const isPaid = d.status === 'paid';
                  
                  const fechaInicioLimpia = d.start_date?.split('T')[0] || 'N/A';
                  const fechaVencimientoLimpia = d.due_date?.split('T')[0] || 'N/A';

                  return (
                    <motion.tr 
                      key={d.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-dark-bg/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                        <div className="p-2 bg-neo-mint/10 rounded-full text-neo-mint">
                          <HiOutlineUser className="text-base" />
                        </div>
                        <div className="flex flex-col">
                          <span>{d.client ? `${d.client.first_name} ${d.client.last_name}` : `Cliente #${d.client_id}`}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gris-calido/80">
                        {fechaInicioLimpia}
                      </td>

                      <td className={`py-4 px-6 text-xs font-semibold ${isOverdue ? 'text-rose-400' : 'text-gris-calido/80'}`}>
                        {fechaVencimientoLimpia}
                      </td>

                      <td className="py-4 px-6 text-right font-bold text-white">
                        ${obtenerMonto(d).toFixed(2)}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                          isPaid 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : isOverdue 
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {d.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Ver Detalle"
                            onClick={() => navigate(`/Cliente-deudas/${d.id}`)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                          >
                            <HiOutlineEye className="text-lg" />
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Editar Cobro"
                            onClick={() => handleOpenEditModal(d)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Eliminar"
                            onClick={() => handleDeleteDeuda(d.id!)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                          >
                            <HiOutlineTrash className="text-lg" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gris-calido/50">
                    No hay deudas registradas.
                  </td>
                </tr>
              )}
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
    </motion.div>
  );
}