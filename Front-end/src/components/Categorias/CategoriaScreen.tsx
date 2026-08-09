import { useState, useEffect } from 'react'; // Quitamos 'React' para limpiar el primer warning
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineFolder, 
  HiOutlineEye, 
  HiOutlinePencilSquare, 
  HiOutlineTrash,
  HiOutlineMagnifyingGlass
} from 'react-icons/hi2';
import CategoriaModal from './CategoriaModal';

// 1. Creamos una interfaz básica para callar el error de "Unexpected any"
interface Producto {
  id: number;
}

interface Categoria {
  id: number;
  name: string;
  description: string;
  products?: Producto[]; // Ya usamos un tipo definido en lugar de 'any'
}

export default function Categorias() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Creamos un disparador para recargar la lista
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 3. Metemos la función DENTRO del useEffect para cumplir la regla del linter
useEffect(() => {
    const fetchCategorias = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.yahirdev.dev/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // LA CORRECCIÓN: Revisamos si Laravel envolvió los datos en la propiedad 'data'
        const dataRevisada = response.data.data || response.data;
        
        // Nos aseguramos al 100% de que sea un arreglo antes de guardarlo en el estado
        setCategorias(Array.isArray(dataRevisada) ? dataRevisada : []);
        
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // ¡Aquí es donde le decimos a React que ejecute la función!
    fetchCategorias(); 
  }, [refreshTrigger]); // Se vuelve a ejecutar mágicamente cada vez que refreshTrigger cambia

  const handleOpenNewModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Categoria) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (data: { id?: number; name: string; description: string }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (data.id) {
        await axios.put(`https://api.yahirdev.dev/api/categories/${data.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('https://api.yahirdev.dev/api/categories', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // 4. Movemos el disparador para que el useEffect re-consulte la base de datos
      setRefreshTrigger(prev => prev + 1);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      alert('Hubo un error al guardar la categoría.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yahirdev.dev/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCategorias(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        alert('Hubo un error al intentar eliminar la categoría.');
      }
    }
  };

 const categoriasFiltradas = (Array.isArray(categorias) ? categorias : []).filter(cat =>
    cat.name?.toLowerCase().includes(search.toLowerCase()) ||
    cat.description?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Categorías de Productos</h1>
          <p className="text-sm text-gris-calido/70">Gestión y clasificación del catálogo de inventario.</p>
        </div>
        <button 
          onClick={handleOpenNewModal}
          className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
        >
          <HiPlus className="text-lg font-bold" />
          Nueva Categoría
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar categoría por nombre o descripción..."
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
                <th className="py-3.5 px-6">Nombre de Categoría</th>
                <th className="py-3.5 px-6">Descripción</th>
                <th className="py-3.5 px-6 text-center">Productos</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-neo-mint">
                    Cargando categorías...
                  </td>
                </tr>
              ) : categoriasFiltradas.length > 0 ? (
                categoriasFiltradas.map((cat) => (
                  <tr key={cat.id} className="hover:bg-dark-bg/40 transition-colors">
                    
                    <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                      <div className="p-2 bg-neo-mint/10 rounded-lg text-neo-mint">
                        <HiOutlineFolder className="text-lg" />
                      </div>
                      <span>{cat.name}</span>
                    </td>

                    <td className="py-4 px-6 text-gris-calido/80">
                      {cat.description || 'Sin descripción'}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-ghost-blue/10 text-ghost-blue border border-ghost-blue/20">
                        {cat.products?.length || 0} {(cat.products?.length || 0) === 1 ? 'artículo' : 'artículos'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          title="Ver detalle"
                          onClick={() => navigate(`/Categorias/${cat.id}`)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                        >
                          <HiOutlineEye className="text-lg" />
                        </button>

                        <button 
                          title="Editar"
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <HiOutlinePencilSquare className="text-lg" />
                        </button>

                        <button 
                          title="Eliminar"
                          onClick={() => handleDeleteCategory(cat.id)}
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
                    No se encontraron categorías.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={selectedCategory}
      />
    </div>
  );
}