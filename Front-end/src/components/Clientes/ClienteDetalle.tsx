import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  HiOutlineArrowLeft, 
  HiOutlineUser, 
  HiOutlinePencilSquare, 
  HiOutlinePhone, 
  HiOutlineEnvelope, 
  HiOutlineMapPin, 
  HiOutlineBanknotes 
} from 'react-icons/hi2';
import ClienteModal, { type ClienteData } from './ClienteModal';

export default function ClienteDetalle() {
  const { id } = useParams();

  const [cliente, setCliente] = useState<ClienteData>({
    id: Number(id) || 1,
    nombre: 'Ana',
    apellido: 'García',
    email: 'ana.g@email.com',
    telefono: '3310002201',
    calleNumero: 'Av. Juárez 500',
    colonia: 'Centro',
  });

  const [historialCredito] = useState([
    { id: 101, fecha: '03/03/2026', monto: 45.00, estado: 'PAID', totalPagado: 45.00 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link 
          to="/clients" 
          className="inline-flex items-center gap-2 text-sm text-gris-calido/70 hover:text-neo-mint transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          Volver a clientes
        </Link>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          <HiOutlinePencilSquare className="text-lg" />
          Editar Perfil
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 bg-neo-mint/10 text-neo-mint rounded-full flex items-center justify-center border border-neo-mint/20">
              <HiOutlineUser className="text-4xl" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white">{cliente.nombre} {cliente.apellido}</h1>
              <p className="text-xs text-gris-calido/60 font-mono">ID Cliente: #CLI-000{cliente.id}</p>
            </div>
          </div>

          <div className="border-t border-dark-border pt-4 space-y-3 text-xs">
            <p className="font-semibold text-gris-calido/60 uppercase tracking-wider">Contacto</p>
            <div className="flex items-center gap-2.5 text-white">
              <HiOutlinePhone className="text-neo-mint text-base" />
              <span>{cliente.telefono}</span>
            </div>
            <div className="flex items-center gap-2.5 text-white">
              <HiOutlineEnvelope className="text-ghost-blue text-base" />
              <span>{cliente.email || 'Sin correo registrado'}</span>
            </div>

            <p className="font-semibold text-gris-calido/60 uppercase tracking-wider pt-2">Ubicación</p>
            <div className="flex items-start gap-2.5 text-white">
              <HiOutlineMapPin className="text-rose-400 text-base shrink-0 mt-0.5" />
              <div>
                <p>{cliente.calleNumero}</p>
                <p className="text-gris-calido/60">{cliente.colonia}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HiOutlineBanknotes className="text-neo-mint text-xl" />
            Historial de Crédito
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gris-calido">
              <thead className="bg-dark-bg/80 text-xs uppercase font-semibold text-white/70 border-b border-dark-border">
                <tr>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Total Pagado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {historialCredito.map((cred, index) => (
                  <motion.tr 
                    key={cred.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-dark-bg/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-white font-medium">{cred.fecha}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">${cred.monto.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {cred.estado}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400">${cred.totalPagado.toFixed(2)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => setCliente(data)}
        initialData={cliente}
      />
    </motion.div>
  );
}