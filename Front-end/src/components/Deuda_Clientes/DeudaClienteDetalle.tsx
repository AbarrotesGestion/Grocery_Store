import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, 
  HiOutlinePencilSquare, 
  HiOutlinePhone, 
  HiOutlineInformationCircle
} from 'react-icons/hi2';
import DeudaClienteModal, { type Deuda } from './DeudaClienteModal';

interface Cliente {
  id: number;
  first_name: string;
  last_name: string;
  phone?: string;
}

export default function DeudaClienteDetalle() {
  const { id } = useParams();

  const [deuda, setDeuda] = useState<Deuda | null>(null);
  const [clientesList, setClientesList] = useState<Cliente[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchDatos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Hacemos ambas peticiones en paralelo: El detalle de la deuda y la lista de clientes para el modal
        const [deudaRes, clientesRes] = await Promise.all([
          axios.get(`https://api.yahirdev.dev/api/client-debts/${id}`, { headers }),
          axios.get('https://api.yahirdev.dev/api/clients', { headers })
        ]);

        const deudasData = deudaRes.data.data || deudaRes.data;
        const clientesData = clientesRes.data.data || clientesRes.data;

        setDeuda(deudasData);
        setClientesList(Array.isArray(clientesData) ? clientesData : []);
      } catch (error) {
        console.error('Error al cargar detalle:', error);
        setErrorMsg('No se pudo cargar la información de la deuda.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatos();
  }, [id, refreshTrigger]);

  const handleSaveDeuda = async (updatedData: Deuda) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://api.yahirdev.dev/api/client-debts/${updatedData.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Disparamos la recarga para obtener la información fresca de la base de datos
      setRefreshTrigger(prev => prev + 1);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar la deuda:', error);
      alert('Hubo un error al actualizar el registro en el servidor.');
    }
  };

  if (isLoading) {
    return <div className="p-6 bg-dark-bg text-neo-mint min-h-screen flex items-center justify-center">Cargando detalle de deuda...</div>;
  }

  if (errorMsg || !deuda) {
    return <div className="p-6 bg-dark-bg text-rose-500 min-h-screen flex items-center justify-center">{errorMsg || 'Deuda no encontrada'}</div>;
  }

  const isOverdue = deuda.status === 'Overdue';
  const isPaid = deuda.status === 'Paid';

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex items-center justify-between">
        <Link 
          to="/Cobros-Clientes" 
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
            ${Number(deuda.amount).toFixed(2)}
          </h1>
          {/* Pintamos el nombre real del cliente traído de la relación */}
          {deuda.client && (
             <p className="text-neo-mint mt-2 font-medium">{deuda.client.first_name} {deuda.client.last_name}</p>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-end">
            <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${
              isPaid
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : isOverdue
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {deuda.status}
            </span>
          </div>

          <div className="space-y-4 text-xs divide-y divide-dark-border">
            <div className="flex justify-between py-2">
              <span className="text-gris-calido/70">Fecha del Crédito:</span>
              <span className="text-white font-medium">{deuda.start_date}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gris-calido/70">Fecha de Vencimiento:</span>
              <span className={`font-bold ${isOverdue ? 'text-rose-400' : 'text-white'}`}>{deuda.due_date}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gris-calido/70">Teléfono Cliente:</span>
              <span className="text-white font-medium flex items-center gap-1.5">
                <HiOutlinePhone className="text-neo-mint" />
                {deuda.client?.phone || 'No registrado'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 bg-dark-bg rounded-lg border border-dark-border text-xs text-gris-calido/60">
            <HiOutlineInformationCircle className="text-lg text-amber-400 shrink-0" />
            <p>Esta deuda fue registrada originalmente en el sistema de forma segura.</p>
          </div>
        </div>
      </div>

      <DeudaClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDeuda}
        initialData={deuda}
        clientesList={clientesList}
      />
    </div>
  );
}