import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineCube, 
  HiOutlineEye, 
  HiOutlinePencilSquare, 
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineArchiveBox
} from 'react-icons/hi2';
import ProductoModal from './ProductoModal';

export interface Producto {
  id: number;
  name: string;
  description: string;
  price: number | string;
  purchase_price: number | string;
  stock?: number;
  min_stock?: number;
  category_id: number;
  supplier_id?: number | null;
  barcode?: string;
  package_size?: number;
  stock_in_units?: number;
  price_per_unit?: number | string;
  price_per_package?: number | string;
  price_per_kg?: number | string;
  allows_unit_sale?: boolean;
  allows_package_sale?: boolean;
  allows_weight_sale?: boolean;
  category?: {
    id: number;
    name: string;
  };
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function ProductosScreen() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.yahirdev.dev/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = response.data.data || response.data;
        setProductos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar productos:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductos();
  }, [refreshTrigger]);

  const handleOpenNewModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Producto) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('¿Deseas enviar este producto a eliminados?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yahirdev.dev/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        alert(extraerMensajeError(error));
      }
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Catálogo de Productos</h1>
          <p className="text-sm text-gris-calido/70">Administración de precios, stock e inventario general.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigate('/Productos-Eliminados')}
            className="flex items-center justify-center gap-2 border border-dark-border bg-dark-card text-gris-calido hover:text-white px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <HiOutlineArchiveBox className="text-lg" />
            Ver Eliminados
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleOpenNewModal}
            className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
          >
            <HiPlus className="text-lg font-bold" />
            Nuevo Producto
          </motion.button>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar producto por nombre, código o categoría..."
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
                <th className="py-3.5 px-6">Producto</th>
                <th className="py-3.5 px-6">Categoría</th>
                <th className="py-3.5 px-6 text-right">P. Compra</th>
                <th className="py-3.5 px-6 text-right">P. Venta</th>
                <th className="py-3.5 px-6 text-right text-emerald-400">Ganancia Unit.</th>
                <th className="py-3.5 px-6 text-center">Stock</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neo-mint">Cargando catálogo de productos...</td>
                </tr>
              ) : productosFiltrados.length > 0 ? (
                productosFiltrados.map((prod, index) => {
                  const pCompra = parseFloat(String(prod.purchase_price || 0));
                  const pVenta = parseFloat(String(prod.price || 0));
                  const ganancia = (pVenta - pCompra).toFixed(2);
                  
                  const currentStock = prod.stock || 0;
                  const minStock = prod.min_stock || 0;
                  const isStockBajo = currentStock <= minStock;

                  return (
                    <motion.tr 
                      key={prod.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-dark-bg/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                        <div className="p-2 bg-neo-mint/10 rounded-lg text-neo-mint shrink-0">
                          <HiOutlineCube className="text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold">{prod.name}</p>
                          {prod.barcode && <p className="text-[10px] text-gris-calido/50 font-mono">BC: {prod.barcode}</p>}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-dark-bg text-gris-calido border border-dark-border">
                          {prod.category?.name || 'Sin categoría'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right font-medium text-gris-calido">
                        ${pCompra.toFixed(2)}
                      </td>

                      <td className="py-4 px-6 text-right font-bold text-white">
                        ${pVenta.toFixed(2)}
                      </td>

                      <td className="py-4 px-6 text-right font-bold text-emerald-400">
                        ${ganancia}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          isStockBajo 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {currentStock}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Ver detalle"
                            onClick={() => navigate(`/Productos/${prod.id}`)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                          >
                            <HiOutlineEye className="text-lg" />
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Editar"
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Eliminar"
                            onClick={() => handleDeleteProduct(prod.id!)}
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
                  <td colSpan={7} className="py-8 text-center text-gris-calido/50">
                    No se encontraron productos en el catálogo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedProduct}
        onSuccess={() => {
          setIsModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </motion.div>
  );
}