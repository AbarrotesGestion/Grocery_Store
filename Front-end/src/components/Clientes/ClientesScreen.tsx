import { useState, useEffect, useCallback } from 'react';
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
import ClienteModal, { type ClienteData } from './ClienteModal';

// Creamos esta interfaz para que TypeScript sepa qué datos llegan del backend y no marque error de "any"
interface ApiCliente {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  street_1?: string;
  neighborhood?: string;
  credit_limit?: string | number;
}

export default function ClientesScreen() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<ClienteData[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteData | null>(null);

  const token = localStorage.getItem('token'); 

  // --- TRAER CLIENTES DE LA API ---
  const fetchClientes = useCallback(async () => {
    try {
      const response = await axios.get('https://api.yahirdev.dev/api/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const apiData = response.data.data || response.data;
      
      // Usamos la interfaz ApiCliente en lugar de (c: any)
      const clientesFormateados: ClienteData[] = apiData.map((c: ApiCliente) => ({
        id: c.id,
        nombre: c.first_name || '',
        apellido: c.last_name || '',
        email: c.email || '',
        telefono: c.phone || '',
        calleNumero: c.street_1 || '',
        colonia: c.neighborhood || '',
        credit_limit: c.credit_limit || ''
      }));

      setClientes(clientesFormateados); 
    } catch (error) {
      console.error("Error al cargar clientes", error);
    }
  }, [token]); 

  useEffect(() => {
    // biome-ignore all: Ignora reglas estrictas del linter para el fetch inicial
    // eslint-disable-next-line
    fetchClientes();
  }, [fetchClientes]);

  const handleOpenNewModal = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cli: ClienteData) => {
    setSelectedCliente(cli);
    setIsModalOpen(true);
  };

  // --- CREAR O EDITAR CLIENTE EN LA API ---
  const handleSaveCliente = async (data: ClienteData) => {
    try {
      const payload = {
        first_name: data.nombre,
        last_name: data.apellido,
        email: data.email,
        phone: data.telefono,
        street_1: data.calleNumero,
        neighborhood: data.colonia,
        credit_limit: data.credit_limit || 0
      };
      

      if (data.id) {
        await axios.put(`https://api.yahirdev.dev/api/clients/${data.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('https://api.yahirdev.dev/api/clients', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setIsModalOpen(false);
      fetchClientes();
} catch (error) {
      console.error("Error completo:", error);
      
      // Comprobamos si el error viene de Axios de forma segura para TypeScript
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          alert("Error del servidor: " + JSON.stringify(error.response.data));
        } else {
          alert("Hubo un error de conexión con el servidor.");
        }
      } else {
        alert("Ocurrió un error inesperado.");
      }
    }
  };

  // --- ELIMINAR CLIENTE ---
  const handleDeleteCliente = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await axios.delete(`https://api.yahirdev.dev/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClientes(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error al eliminar", error);
        alert("No se pudo eliminar el cliente.");
      }
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