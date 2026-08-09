import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, 
  HiOutlineTag, 
  HiOutlinePencilSquare, 
  HiOutlineCube 
} from 'react-icons/hi2';
import CategoriaModal from './CategoriaModal';

// Interfaces actualizadas al inglés para coincidir con la BD
interface Producto {
  id: number;
  name: string; 
  stock: number;
  price: number; 
}

interface Categoria {
  id: number;
  name: string;
  description: string;
  products: Producto[];
}

export default function CategoriaDetalle() {
  const { id } = useParams();

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://api.yahirdev.dev/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCategoria(response.data);
      } catch (error) {
        console.error('Error al cargar la categoría:', error);
        setErrorMsg('No se pudo cargar la información de la categoría.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoria();
  }, [id]);

  // Actualizado para enviar 'name' y 'description' al backend
  const handleSaveModal = async (updatedData: { name: string; description: string }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://api.yahirdev.dev/api/categories/${categoria?.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategoria(prev => prev ? {
        ...prev,
        name: updatedData.name,
        description: updatedData.description
      } : null);
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      alert('Hubo un error al guardar los cambios en el servidor.');
    }
  };

  if (isLoading) {
    return <div className="p-6 bg-dark-bg text-neo-mint min-h-screen flex items-center justify-center">Cargando categoría...</div>;
  }

  if (errorMsg || !categoria) {
    return <div className="p-6 bg-dark-bg text-rose-500 min-h-screen flex items-center justify-center">{errorMsg || 'Categoría no encontrada'}</div>;
  }

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div>
        <Link 
          to="/Categorias" 
          className="inline-flex items-center gap-2 text-sm text-gris-calido/70 hover:text-neo-mint transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          Volver a categorías
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col items-center text-center justify-between space-y-6">
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="p-5 bg-neo-mint/10 text-neo-mint rounded-2xl border border-neo-mint/20">
              <HiOutlineTag className="text-4xl" />
            </div>
            
            <h1 className="text-2xl font-bold text-white">{categoria.name}</h1>
            
            <div className="w-full border-t border-dark-border pt-4 text-left">
              <p className="text-xs font-semibold text-gris-calido/60 uppercase tracking-wider mb-1">
                Descripción
              </p>
              <p className="text-sm text-gris-calido">
                {categoria.description || 'Sin descripción asignada.'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            <HiOutlinePencilSquare className="text-lg" />
            Editar Categoría
          </button>
        </div>

        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <HiOutlineCube className="text-neo-mint text-xl" />
            Productos en esta categoría
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gris-calido">
              <thead className="bg-dark-bg/80 text-xs uppercase font-semibold text-white/70 border-b border-dark-border">
                <tr>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-right">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {categoria.products && categoria.products.length > 0 ? (
                  categoria.products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-dark-bg/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-neo-mint hover:underline cursor-pointer">
                        {prod.name}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {prod.stock} unid.
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        ${Number(prod.price).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gris-calido/50">
                      No hay productos asignados a esta categoría.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {categoria && (
        <CategoriaModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveModal}
          // Pasamos los datos iniciales con las llaves en inglés
          initialData={{ id: categoria.id, name: categoria.name, description: categoria.description }}
        />
      )}
    </div>
  );
}