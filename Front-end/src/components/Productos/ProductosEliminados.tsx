import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, 
  HiOutlineTrash, 
  HiOutlineArrowPath, 
  HiOutlineXMark,
  HiOutlineArchiveBoxXMark
} from 'react-icons/hi2';

// 1. Interfaz alineada a la respuesta del backend
export interface ProductoEliminado {
  id: number;
  name: string;
  deleted_at: string;
  category?: {
    id: number;
    name: string;
  };
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function ProductosEliminados() {
  const [trashedProducts, setTrashedProducts] = useState<ProductoEliminado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 2. Cargar productos en la papelera
  useEffect(() => {
    const fetchTrashedProducts = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.yahirdev.dev/api/products/trashed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Asumiendo que el backend devuelve un array directo o envuelto en { data: [...] }
        const data = response.data.data || response.data;
        setTrashedProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar papelera:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrashedProducts();
  }, [refreshTrigger]);

  // 3. Restaurar producto
  const handleRestore = async (id: number) => {
    if (window.confirm('¿Deseas restaurar este producto al catálogo activo?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`https://api.yahirdev.dev/api/products/${id}/restore`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Producto restaurado exitosamente.');
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        alert(extraerMensajeError(error));
      }
    }
  };

  // 4. Eliminar permanentemente
  const handleForceDelete = async (id: number) => {
    if (window.confirm('¡Atención! Esta acción eliminará permanentemente el producto de la base de datos y no se podrá recuperar. ¿Continuar?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yahirdev.dev/api/products/${id}/force-delete`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Producto eliminado permanentemente.');
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        alert(extraerMensajeError(error));
      }
    }
  };

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div>
        <Link 
          to="/Inventario" 
          className="inline-flex items-center gap-2 text-sm text-gris-calido/70 hover:text-neo-mint transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          Volver al Catálogo
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
          <HiOutlineTrash className="text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Productos Eliminados</h1>
          <p className="text-sm text-gris-calido/70">Elementos en la Papelera que pueden ser restaurados o borrados definitivamente.</p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gris-calido">
            <thead className="bg-dark-bg/80 text-xs uppercase font-semibold text-white/70 border-b border-dark-border">
              <tr>
                <th className="py-3.5 px-6">Producto</th>
                <th className="py-3.5 px-6">Categoría</th>
                <th className="py-3.5 px-6">Fecha Eliminación</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-neo-mint">Cargando papelera...</td>
                </tr>
              ) : trashedProducts.length > 0 ? (
                trashedProducts.map((prod) => {
                  // Limpieza básica de la fecha (si viene con formato ISO)
                  const fechaLimpia = prod.deleted_at ? prod.deleted_at.split('T')[0] : 'Desconocida';

                  return (
                    <tr key={prod.id} className="hover:bg-dark-bg/40 transition-colors">
                      <td className="py-4 px-6 font-medium text-white">{prod.name}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-dark-bg text-gris-calido border border-dark-border">
                          {prod.category?.name || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-rose-400/80 font-medium">{fechaLimpia}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            type="button"
                            title="Restaurar Producto"
                            onClick={() => handleRestore(prod.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                          >
                            <HiOutlineArrowPath className="text-sm" />
                            Restaurar
                          </button>

                          <button 
                            type="button"
                            title="Eliminar Definitivamente"
                            onClick={() => handleForceDelete(prod.id)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                          >
                            <HiOutlineXMark className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-4 bg-dark-bg rounded-full border border-dark-border text-gris-calido/40">
                        <HiOutlineArchiveBoxXMark className="text-4xl" />
                      </div>
                      <p className="text-sm text-gris-calido/60">La papelera está vacía.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}