import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineEye, 
  HiOutlinePencilSquare, 
  HiOutlineTrash,
  HiOutlineMagnifyingGlass 
} from 'react-icons/hi2';
import EmpleadoModal from './EmpleadoModal';
import { type Empleado } from './EmpleadoDetalle';

export default function EmpleadosScreen() {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 1. Petición para listar empleados desde Laravel
  useEffect(() => {
    const fetchEmpleados = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.yahirdev.dev/api/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const dataRevisada = response.data.data || response.data;
        setEmpleados(Array.isArray(dataRevisada) ? dataRevisada : []);
      } catch (error) {
        console.error('Error al cargar empleados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpleados();
  }, [refreshTrigger]);

  const handleOpenNewModal = () => {
    setSelectedEmpleado(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp: Empleado) => {
    setSelectedEmpleado(emp);
    setIsModalOpen(true);
  };

  // 2. Guardar o actualizar un empleado en Laravel
  const handleSaveEmpleado = async (data: Empleado) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (data.id) {
        await axios.put(`https://api.yahirdev.dev/api/employees/${data.id}`, data, { headers });
      } else {
        await axios.post('https://api.yahirdev.dev/api/employees', data, { headers });
      }

      setRefreshTrigger(prev => prev + 1);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar el empleado:', error);
      alert('Hubo un error al guardar el registro en el servidor.');
    }
  };

  // 3. Eliminar empleado en Laravel
  const handleDeleteEmpleado = async (id: number) => {
    if (window.confirm('¿Deseas dar de baja a este empleado?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yahirdev.dev/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setEmpleados(prev => prev.filter(e => e.id !== id));
      } catch (error: any) {
        console.error('Error al eliminar:', error);
        const mensaje = error.response?.data?.error || 'No se pudo eliminar el empleado.';
        alert(mensaje);
      }
    }
  };

  // Filtrado seguro usando las propiedades de la API
  const empleadosFiltrados = (Array.isArray(empleados) ? empleados : []).filter(e => {
    const query = search.toLowerCase();
    const nombreCompleto = `${e.first_name || ''} ${e.last_name || ''}`.toLowerCase();
    const payroll = e.payroll_id || '';
    const rolNombre = e.role?.name || '';
    
    return nombreCompleto.includes(query) || payroll.toLowerCase().includes(query) || rolNombre.toLowerCase().includes(query);
  });

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Gestión de Empleados</h1>
          <p className="text-sm text-gris-calido/70">Equipo de trabajo, perfiles de usuario y nómina.</p>
        </div>
        
        <button 
          onClick={handleOpenNewModal}
          className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
        >
          <HiPlus className="text-lg font-bold" />
          Registrar Empleado
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar por nombre, ID nómina o puesto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gris-calido/50"
        />
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gris-calido">
            <thead className="bg-dark-bg/80 text-xs uppercase font-semibold text-white/70 border-b border-dark-border">
              <tr>
                <th className="py-3.5 px-6">ID Nómina</th>
                <th className="py-3.5 px-6">Nombre Completo</th>
                <th className="py-3.5 px-6 text-center">Rol / Puesto</th>
                <th className="py-3.5 px-6">Contacto</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neo-mint">
                    Cargando empleados...
                  </td>
                </tr>
              ) : empleadosFiltrados.length > 0 ? (
                empleadosFiltrados.map((emp) => (
                  <tr key={emp.id} className="hover:bg-dark-bg/40 transition-colors">
                    
                    <td className="py-4 px-6 font-semibold text-ghost-blue font-mono">
                      {emp.payroll_id}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neo-mint/10 rounded-full text-neo-mint shrink-0">
                          <HiOutlineUser className="text-base" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{emp.first_name} {emp.last_name}</p>
                          <p className="text-xs text-gris-calido/60">Tarifa: ${Number(emp.hourly_rate || 0).toFixed(2)}/hr</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-ghost-blue/10 text-ghost-blue border border-ghost-blue/20">
                        {emp.role ? emp.role.name : 'Sin rol'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs space-y-0.5">
                      <div className="flex items-center gap-2 text-gris-calido">
                        <HiOutlineEnvelope className="text-ghost-blue shrink-0" />
                        <span>{emp.email}</span>
                      </div>
                      {emp.phone && (
                        <div className="flex items-center gap-2 text-gris-calido">
                          <HiOutlinePhone className="text-neo-mint shrink-0" />
                          <span>{emp.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          title="Ver Detalle"
                          onClick={() => navigate(`/Empleados/${emp.id}`)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                        >
                          <HiOutlineEye className="text-lg" />
                        </button>

                        <button 
                          title="Editar Perfil"
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <HiOutlinePencilSquare className="text-lg" />
                        </button>

                        <button 
                          title="Eliminar"
                          onClick={() => handleDeleteEmpleado(emp.id!)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                        >
                          <HiOutlineTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gris-calido/50">
                    No se encontraron empleados registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmpleadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmpleado}
        initialData={selectedEmpleado}
      />
    </div>
  );
}