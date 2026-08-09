import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import EmpleadoModal, { type EmpleadoData } from './EmpleadoModal';

export default function EmpleadosScreen() {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState<EmpleadoData[]>([
    { id: 1, idNomina: 'CAJ-001', nombre: 'Rosa', apellido: 'Melano', rol: 'Cajero', tarifaHora: 80.00, email: 'rosa.cajera@tienda.com', telefono: '3300002222', domicilio: 'Av. Las Palmas 120', cuentaDeposito: '4152313188991200', fechaRegistro: '03 de Mar, 2026', estado: 'Activo' },
    { id: 2, idNomina: 'ALM-001', nombre: 'Alberto', apellido: 'Macen', rol: 'Almacenista', tarifaHora: 85.00, email: 'alberto.stock@tienda.com', telefono: '3300003333', domicilio: 'Calle Roble 45', cuentaDeposito: '4152313188991201', fechaRegistro: '03 de Mar, 2026', estado: 'Activo' },
    { id: 3, idNomina: 'ADM-002', nombre: 'Yahir', apellido: 'Hernández', rol: 'Administrador', tarifaHora: 0.00, email: 'yahir@gmail.com', telefono: '3319800229', domicilio: 'Hacienda Santa Fe', cuentaDeposito: '4152313188991202', fechaRegistro: '01 de Ene, 2026', estado: 'Activo' },
    { id: 4, idNomina: 'Gui-0403', nombre: 'Guillermo', apellido: 'Esparza', rol: 'Almacenista', tarifaHora: 90.00, email: 'guillermo@gmail.com', telefono: '2233134678', domicilio: 'Av. Vallarta 890', cuentaDeposito: '4152313188991203', fechaRegistro: '03 de Mar, 2026', estado: 'Activo' },
  ]);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<EmpleadoData | null>(null);

  const handleOpenNewModal = () => {
    setSelectedEmpleado(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp: EmpleadoData) => {
    setSelectedEmpleado(emp);
    setIsModalOpen(true);
  };

  const handleSaveEmpleado = (data: EmpleadoData) => {
    if (data.id) {
      setEmpleados(prev => prev.map(e => e.id === data.id ? data : e));
    } else {
      const newEmp = { ...data, id: Date.now(), fechaRegistro: '06 de Ago, 2026' };
      setEmpleados(prev => [newEmp, ...prev]);
    }
  };

  const handleDeleteEmpleado = (id: number) => {
    if (confirm('¿Deseas dar de baja a este empleado?')) {
      setEmpleados(prev => prev.filter(e => e.id !== id));
    }
  };

  const empleadosFiltrados = empleados.filter(e => {
    const query = search.toLowerCase();
    const nombreCompleto = `${e.nombre} ${e.apellido}`.toLowerCase();
    return nombreCompleto.includes(query) || e.idNomina.toLowerCase().includes(query) || e.rol.toLowerCase().includes(query);
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
              {empleadosFiltrados.length > 0 ? (
                empleadosFiltrados.map((emp) => (
                  <tr key={emp.id} className="hover:bg-dark-bg/40 transition-colors">
                    
                    <td className="py-4 px-6 font-semibold text-ghost-blue font-mono">
                      {emp.idNomina}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neo-mint/10 rounded-full text-neo-mint shrink-0">
                          <HiOutlineUser className="text-base" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{emp.nombre} {emp.apellido}</p>
                          <p className="text-xs text-gris-calido/60">Tarifa: ${emp.tarifaHora.toFixed(2)}/hr</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-ghost-blue/10 text-ghost-blue border border-ghost-blue/20">
                        {emp.rol}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs space-y-0.5">
                      <div className="flex items-center gap-2 text-gris-calido">
                        <HiOutlineEnvelope className="text-ghost-blue shrink-0" />
                        <span>{emp.email}</span>
                      </div>
                      {emp.telefono && (
                        <div className="flex items-center gap-2 text-gris-calido">
                          <HiOutlinePhone className="text-neo-mint shrink-0" />
                          <span>{emp.telefono}</span>
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