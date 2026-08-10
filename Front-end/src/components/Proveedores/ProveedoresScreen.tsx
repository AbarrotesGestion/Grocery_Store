import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineTruck, 
  HiOutlineEye, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineMagnifyingGlass,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineSparkles
} from 'react-icons/hi2';
import ProveedorModal from './ProveedorModal';

export interface Proveedor {
  id?: number;
  company_name: string;
  contact_name: string;
  phone?: string;
  email?: string;
  debts?: any[];
  created_at?: string;
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function ProveedoresScreen() {
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);

  useEffect(() => {
    const fetchProveedores = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.yahirdev.dev/api/suppliers', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data.data || response.data;
        setProveedores(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar proveedores:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProveedores();
  }, [refreshTrigger]);

  const handleOpenNewModal = () => {
    setSelectedProveedor(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prov: Proveedor) => {
    setSelectedProveedor(prov);
    setIsModalOpen(true);
  };

  const handleDeleteProveedor = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yahirdev.dev/api/suppliers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRefreshTrigger(prev => prev + 1);
        alert('Proveedor eliminado exitosamente.');
      } catch (error) {
        alert(extraerMensajeError(error));
      }
    }
  };

  const proveedoresFiltrados = proveedores.filter(p =>
    p.company_name.toLowerCase().includes(search.toLowerCase()) ||
    p.contact_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      
      {/* HEADER DE LA VISTA */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-neo-mint/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neo-mint/10 text-neo-mint border border-neo-mint/20 mb-1">
            <HiOutlineSparkles className="text-sm" /> Red Comercial
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Gestión de Proveedores</h1>
          <p className="text-sm text-gris-calido/75">Directorio de empresas suministradoras, contactos y cuentas comerciales.</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 170, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleOpenNewModal}
          className="relative z-10 flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-bold px-5 py-3 rounded-xl transition-all shadow-lg"
        >
          <HiPlus className="text-xl font-black" />
          Nuevo Proveedor
        </motion.button>
      </motion.div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar proveedor por empresa, contacto o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gris-calido/50"
        />
      </div>

      {/* TABLA DE PROVEEDORES ANIMADA */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gris-calido">
            <thead className="bg-dark-bg/90 text-xs uppercase font-bold text-white/70 border-b border-dark-border">
              <tr>
                <th className="py-3.5 px-6">Empresa</th>
                <th className="py-3.5 px-6">Contacto Principal</th>
                <th className="py-3.5 px-6">Datos de Contacto</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-neo-mint font-semibold animate-pulse">Cargando proveedores...</td>
                </tr>
              ) : proveedoresFiltrados.length > 0 ? (
                proveedoresFiltrados.map((prov, index) => (
                  <motion.tr 
                    key={prov.id} 
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.3 + (index * 0.05) }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                    className="transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                      <div className="p-2.5 bg-neo-mint/10 rounded-xl text-neo-mint border border-neo-mint/20 shrink-0">
                        <HiOutlineTruck className="text-lg" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-base">{prov.company_name}</p>
                        <p className="text-[10px] text-gris-calido/60 font-mono">ID: #{prov.id}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-white font-medium">
                      {prov.contact_name}
                    </td>

                    <td className="py-4 px-6 text-xs space-y-1">
                      {prov.phone && (
                        <div className="flex items-center gap-2 text-gris-calido">
                          <HiOutlinePhone className="text-neo-mint shrink-0" />
                          <span>{prov.phone}</span>
                        </div>
                      )}
                      {prov.email && (
                        <div className="flex items-center gap-2 text-gris-calido">
                          <HiOutlineEnvelope className="text-ghost-blue shrink-0" />
                          <span>{prov.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          title="Ver Detalle"
                          onClick={() => navigate(`/Proveedores/${prov.id}`)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                        >
                          <HiOutlineEye className="text-lg" />
                        </motion.button>

                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          title="Editar"
                          onClick={() => handleOpenEditModal(prov)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <HiOutlinePencilSquare className="text-lg" />
                        </motion.button>

                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          title="Eliminar"
                          onClick={() => handleDeleteProveedor(prov.id!)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                        >
                          <HiOutlineTrash className="text-lg" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gris-calido/50">
                    No se encontraron proveedores registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <ProveedorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedProveedor}
        onSuccess={() => {
          setIsModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </motion.div>
  );
}