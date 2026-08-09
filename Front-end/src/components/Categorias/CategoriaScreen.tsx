import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiPlus, 
  HiOutlineFolder, 
  HiOutlineEye, 
  HiOutlinePencilSquare, 
  HiOutlineTrash,
  HiOutlineMagnifyingGlass
} from 'react-icons/hi2';
import CategoriaModal from './CategoriaModal';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  totalProductos: number;
}

export default function Categorias() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 1, nombre: 'Abarrotes', descripcion: 'Productos básicos de despensa', totalProductos: 2 },
    { id: 2, nombre: 'Bebidas', descripcion: 'Bebidas frías y calientes', totalProductos: 2 },
    { id: 3, nombre: 'Botanas', descripcion: 'Snacks y frituras', totalProductos: 1 },
    { id: 4, nombre: 'Carnes y Embutidos', descripcion: 'Cortes de carne y salchichonería', totalProductos: 1 },
    { id: 5, nombre: 'Farmacia', descripcion: 'Medicamentos básicos y aseo personal', totalProductos: 0 },
    { id: 6, nombre: 'Frutas y Verduras', descripcion: 'Productos del campo frescos', totalProductos: 0 },
    { id: 7, nombre: 'Lácteos', descripcion: 'Productos derivados de la leche', totalProductos: 2 },
    { id: 8, nombre: 'Limpieza', descripcion: 'Artículos de limpieza del hogar', totalProductos: 1 },
    { id: 9, nombre: 'Mascotas', descripcion: 'Alimento y accesorios para animales', totalProductos: 0 },
    { id: 10, nombre: 'Panadería', descripcion: 'Pan fresco y repostería', totalProductos: 1 },
  ]);

  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);

  const handleOpenNewModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Categoria) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (data: { id?: number; nombre: string; descripcion: string }) => {
    if (data.id) {
      setCategorias(prev =>
        prev.map(item =>
          item.id === data.id
            ? { ...item, nombre: data.nombre, descripcion: data.descripcion }
            : item
        )
      );
    } else {
      const newCategory: Categoria = {
        id: Date.now(),
        nombre: data.nombre,
        descripcion: data.descripcion,
        totalProductos: 0,
      };
      setCategorias(prev => [newCategory, ...prev]);
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      setCategorias(prev => prev.filter(item => item.id !== id));
    }
  };

  const categoriasFiltradas = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(search.toLowerCase()) ||
    cat.descripcion.toLowerCase().includes(search.toLowerCase())
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
              {categoriasFiltradas.length > 0 ? (
                categoriasFiltradas.map((cat) => (
                  <tr key={cat.id} className="hover:bg-dark-bg/40 transition-colors">
                    
                    <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                      <div className="p-2 bg-neo-mint/10 rounded-lg text-neo-mint">
                        <HiOutlineFolder className="text-lg" />
                      </div>
                      <span>{cat.nombre}</span>
                    </td>

                    <td className="py-4 px-6 text-gris-calido/80">
                      {cat.descripcion || 'Sin descripción'}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-ghost-blue/10 text-ghost-blue border border-ghost-blue/20">
                        {cat.totalProductos} {cat.totalProductos === 1 ? 'artículo' : 'artículos'}
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