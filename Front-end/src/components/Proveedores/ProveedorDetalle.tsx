import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, 
  HiOutlineTruck, 
  HiOutlinePencilSquare, 
  HiOutlinePhone, 
  HiOutlineEnvelope,
  HiOutlineBanknotes
} from 'react-icons/hi2';
import ProveedorModal, { type ProveedorData } from './ProveedorModal';

export default function ProveedorDetalle() {
  const { id } = useParams();

  const [proveedor, setProveedor] = useState<ProveedorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProveedor = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://api.yahirdev.dev/api/suppliers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data.data || response.data;
        setProveedor(data);
      } catch (error) {
        console.error('Error al cargar proveedor:', error);
        setErrorMsg('No se pudo encontrar la información de este proveedor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProveedor();
  }, [id, refreshTrigger]);

  if (isLoading) {
    return <div className="p-6 bg-dark-bg text-neo-mint min-h-screen flex items-center justify-center">Cargando perfil del proveedor...</div>;
  }

  if (errorMsg || !proveedor) {
    return <div className="p-6 bg-dark-bg text-rose-500 min-h-screen flex items-center justify-center">{errorMsg || 'Proveedor no encontrado'}</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link 
          to="/Proveedores" 
          className="inline-flex items-center gap-2 text-sm text-gris-calido/70 hover:text-neo-mint transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          Volver a proveedores
        </Link>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <HiOutlinePencilSquare className="text-lg" />
          Editar Perfil
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col items-center text-center justify-between space-y-6 shadow-xl">
          <div className="w-full flex flex-col items-center space-y-3">
            <div className="w-20 h-20 bg-neo-mint/10 text-neo-mint rounded-full flex items-center justify-center border border-neo-mint/20 shadow-inner">
              <HiOutlineTruck className="text-4xl" />
            </div>
            
            <h1 className="text-2xl font-bold text-white">{proveedor.company_name}</h1>
            <p className="text-xs text-gris-calido/75">Contacto: <span className="text-white font-semibold">{proveedor.contact_name}</span></p>

            <div className="w-full border-t border-dark-border pt-4 text-left space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-white">
                <HiOutlinePhone className="text-neo-mint text-base shrink-0" />
                <span>{proveedor.phone || 'Sin teléfono registrado'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <HiOutlineEnvelope className="text-ghost-blue text-base shrink-0" />
                <span>{proveedor.email || 'Sin correo registrado'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6 shadow-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-dark-border pb-3">
            <HiOutlineBanknotes className="text-neo-mint text-xl" /> Deudas Asociadas al Proveedor ({proveedor.debts?.length || 0})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gris-calido">
              <thead className="bg-dark-bg text-xs uppercase font-semibold text-white/70 border-b border-dark-border">
                <tr>
                  <th className="py-3 px-4">ID Deuda</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Vencimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {proveedor.debts && proveedor.debts.length > 0 ? (
                  proveedor.debts.map((deb: any) => (
                    <tr key={deb.id} className="hover:bg-dark-bg/40">
                      <td className="py-3.5 px-4 font-mono text-ghost-blue">#{deb.id}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-white">${Number(deb.amount || deb.balance_due || 0).toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {deb.status || 'Pendiente'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs font-mono">{deb.due_date ? deb.due_date.split('T')[0] : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gris-calido/50">
                      No hay registros de deudas con este proveedor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProveedorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={proveedor}
        onSuccess={() => {
          setIsModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </motion.div>
  );
}