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
import ClienteModal, { type ClienteData } from './ClienteModal';

export default function ClientesScreen() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<ClienteData[]>([
    { id: 1, nombre: 'Ana', apellido: 'García', email: 'ana.g@email.com', telefono: '3310002201', calleNumero: 'Av. Juárez 500', colonia: 'Centro' },
    { id: 2, nombre: 'Carlos', apellido: 'López', email: 'c.lopez@email.com', telefono: '3310002202', calleNumero: 'Calle Hidalgo 12', colonia: 'Zapopan' },
    { id: 3, nombre: 'Elena', apellido: 'Torres', email: 'elena.t@email.com', telefono: '3310002205', calleNumero: 'Av. México 1500', colonia: 'Ladrón de Guevara' },
    { id: 4, nombre: 'Fernando', apellido: 'Castro', email: 'fer.c@email.com', telefono: '3310002208', calleNumero: 'López Mateos Sur', colonia: 'Santa Ana' },
    { id: 5, nombre: 'Jorge', apellido: 'Martínez', email: 'jorge.m@email.com', telefono: '3310002204', calleNumero: 'Calzada Independencia', colonia: 'San Juan' },
    { id: 6, nombre: 'Laura', apellido: 'Vázquez', email: 'laura.v@email.com', telefono: '3310002209', calleNumero: 'Niños Héroes', colonia: 'Moderna' },
    { id: 7, nombre: 'Luis Yahir', apellido: 'Hernández González', email: 'luis_@gmail.com', telefono: '3319800229', calleNumero: 'Colorado 163', colonia: 'Hacienda Santa Fe' },
    { id: 8, nombre: 'María', apellido: 'Rodríguez', email: 'maria.r@email.com', telefono: '3310002203', calleNumero: 'Paseo de las Aves', colonia: 'Bugambilias' },
    { id: 9, nombre: 'Ricardo', apellido: 'Sánchez', email: 'ric.s@email.com', telefono: '3310002206', calleNumero: 'Sierra de Tapalpa', colonia: 'Las Águilas' },
    { id: 10, nombre: 'Sofía', apellido: 'Ramírez', email: 'sofia.ram@email.com', telefono: '3310002207', calleNumero: 'Avenida Vallarta', colonia: 'Americana' },
  ]);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteData | null>(null);

  const handleOpenNewModal = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cli: ClienteData) => {
    setSelectedCliente(cli);
    setIsModalOpen(true);
  };

  const handleSaveCliente = (data: ClienteData) => {
    if (data.id) {
      setClientes(prev => prev.map(c => c.id === data.id ? data : c));
    } else {
      const newCli = { ...data, id: Date.now() };
      setClientes(prev => [newCli, ...prev]);
    }
  };

  const handleDeleteCliente = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      setClientes(prev => prev.filter(c => c.id !== id));
    }
  };

  const clientesFiltrados = clientes.filter(c => {
    const nombreCompleto = `${c.nombre} ${c.apellido}`.toLowerCase();
    const query = search.toLowerCase();
    return nombreCompleto.includes(query) || c.email.toLowerCase().includes(query) || c.telefono.includes(query);
  });

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Gestión de Clientes</h1>
          <p className="text-sm text-gris-calido/70">Directorio, datos de contacto e historial crediticio.</p>
        </div>
        
        <button 
          onClick={handleOpenNewModal}
          className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
        >
          <HiPlus className="text-lg font-bold" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar cliente por nombre, correo o teléfono..."
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
                <th className="py-3.5 px-6">Cliente</th>
                <th className="py-3.5 px-6">Contacto</th>
                <th className="py-3.5 px-6">Dirección</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cli) => (
                  <tr key={cli.id} className="hover:bg-dark-bg/40 transition-colors">
                    
                    <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                      <div className="p-2 bg-neo-mint/10 rounded-full text-neo-mint shrink-0">
                        <HiOutlineUser className="text-lg" />
                      </div>
                      <span>{cli.nombre} {cli.apellido}</span>
                    </td>

                    <td className="py-4 px-6 space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-gris-calido">
                        <HiOutlineEnvelope className="text-ghost-blue shrink-0" />
                        <span>{cli.email || 'Sin correo'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gris-calido">
                        <HiOutlinePhone className="text-neo-mint shrink-0" />
                        <span>{cli.telefono}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-gris-calido/80">
                      <p>{cli.calleNumero || 'Sin dirección'}</p>
                      <p className="text-gris-calido/50">{cli.colonia}</p>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          title="Ver Detalles"
                          onClick={() => navigate(`/Clientes/${cli.id}`)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                        >
                          <HiOutlineEye className="text-lg" />
                        </button>

                        <button 
                          title="Editar Perfil"
                          onClick={() => handleOpenEditModal(cli)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <HiOutlinePencilSquare className="text-lg" />
                        </button>

                        <button 
                          title="Eliminar"
                          onClick={() => handleDeleteCliente(cli.id!)}
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
                  <td colSpan={4} className="py-8 text-center text-gris-calido/50">
                    No se encontraron clientes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCliente}
        initialData={selectedCliente}
      />
    </div>
  );
}