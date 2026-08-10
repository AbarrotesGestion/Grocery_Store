import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineShieldCheck, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles
} from 'react-icons/hi2';
import RolModal from './RolModal';

export interface Rol {
  id?: number;
  name: string;
  description: string;
  created_at?: string;
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function RolesScreen() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.yahirdev.dev/api/roles', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data.data || response.data;
        setRoles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar roles:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [refreshTrigger]);

  const handleOpenNewModal = () => {
    setSelectedRol(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rol: Rol) => {
    setSelectedRol(rol);
    setIsModalOpen(true);
  };

  const handleDeleteRol = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este rol del sistema?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yahirdev.dev/api/roles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRefreshTrigger(prev => prev + 1);
        alert('Rol eliminado exitosamente.');
      } catch (error) {
        alert(extraerMensajeError(error));
      }
    }
  };

  const rolesFiltrados = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      
      {/* HEADER DE LA VISTA CON ESTILO CINE */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-ghost-blue/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-ghost-blue/10 text-ghost-blue border border-ghost-blue/20 mb-1">
            <HiOutlineSparkles className="text-sm" /> Permisos y Accesos
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Gestión de Roles</h1>
          <p className="text-sm text-gris-calido/75">Configuración de perfiles de usuario y jerarquías del personal.</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleOpenNewModal}
          className="relative z-10 flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-bold px-5 py-3 rounded-xl transition-all shadow-lg"
        >
          <HiPlus className="text-xl font-black" />
          Nuevo Rol
        </motion.button>
      </motion.div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar rol por nombre o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gris-calido/50"
        />
      </div>

      {/* TABLA DE ROLES ANIMADA */}
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
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Nombre del Rol</th>
                <th className="py-3.5 px-6">Descripción</th>
                <th className="py-3.5 px-6">Fecha de Creación</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neo-mint font-semibold animate-pulse">Cargando roles del sistema...</td>
                </tr>
              ) : rolesFiltrados.length > 0 ? (
                rolesFiltrados.map((rol, index) => {
                  const fechaLimpia = rol.created_at ? rol.created_at.split('T')[0] : 'N/A';

                  return (
                    <motion.tr 
                      key={rol.id} 
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.3 + (index * 0.05) }}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                      className="transition-colors"
                    >
                      <td className="py-4 px-6 font-mono text-xs text-ghost-blue font-bold">
                        #{rol.id}
                      </td>

                      <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                        <div className="p-2 bg-ghost-blue/10 rounded-xl text-ghost-blue border border-ghost-blue/20 shrink-0">
                          <HiOutlineShieldCheck className="text-lg" />
                        </div>
                        <span>{rol.name}</span>
                      </td>

                      <td className="py-4 px-6 text-gris-calido/80 text-xs max-w-md">
                        {rol.description}
                      </td>

                      <td className="py-4 px-6 text-xs text-gris-calido/60 font-mono">
                        {fechaLimpia}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Editar"
                            onClick={() => handleOpenEditModal(rol)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Eliminar"
                            onClick={() => handleDeleteRol(rol.id!)}
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
                  <td colSpan={5} className="py-12 text-center text-gris-calido/50">
                    No se encontraron roles registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <RolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedRol}
        onSuccess={() => {
          setIsModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </motion.div>
  );
}