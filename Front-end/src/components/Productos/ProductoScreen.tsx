import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiPlus, 
  HiOutlineCube, 
  HiOutlineEye, 
  HiOutlinePencilSquare, 
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineArchiveBox
} from 'react-icons/hi2';
import ProductoModal, { type ProductoData } from './ProductoModal';

export default function ProductosScreen() {
  const navigate = useNavigate();

  const categoriasList = [
    { id: 1, nombre: 'Bebidas' },
    { id: 2, nombre: 'Abarrotes' },
    { id: 3, nombre: 'Limpieza' },
    { id: 4, nombre: 'Carnes y Embutidos' },
    { id: 5, nombre: 'Lácteos' },
    { id: 6, nombre: 'Panadería' },
    { id: 7, nombre: 'Botanas' },
  ];

  const proveedoresList = [
    { id: 1, nombre: 'Distribuidora Central' },
    { id: 2, nombre: 'Comercializadora del Sur' },
  ];

  const [productos, setProductos] = useState<ProductoData[]>([
    { 
      id: 1, 
      name: 'Aceite Vegetal 900ml', 
      category_id: 1, 
      description: 'Aceite vegetal comestible, perfecto para freír y cocinar.', 
      stock: 30, 
      min_stock: 5, 
      purchase_price: 22.00, 
      price: 32.00,
      allows_unit_sale: true,
      allows_package_sale: false,
      allows_weight_sale: false 
    },
    { 
      id: 2, 
      name: 'Arroz Súper Extra 1kg', 
      category_id: 2, 
      description: 'Arroz de grano largo seleccionado.', 
      stock: 50, 
      min_stock: 10, 
      purchase_price: 12.50, 
      price: 18.00,
      allows_unit_sale: true,
      allows_package_sale: false,
      allows_weight_sale: false 
    },
    { 
      id: 3, 
      name: 'Coca Cola 2.5L', 
      category_id: 1, 
      description: 'Refresco embotellado no retornable.', 
      stock: 100, 
      min_stock: 15, 
      purchase_price: 28.00, 
      price: 38.00,
      allows_unit_sale: true,
      allows_package_sale: true,
      package_size: 12,
      price_per_package: 420.00,
      allows_weight_sale: false 
    },
  ]);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductoData | null>(null);

  const handleOpenNewModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: ProductoData) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (data: ProductoData) => {
    if (data.id) {
      setProductos(prev => prev.map(p => p.id === data.id ? data : p));
    } else {
      const newProd = { ...data, id: Date.now() };
      setProductos(prev => [newProd, ...prev]);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('¿Deseas enviar este producto a eliminados?')) {
      setProductos(prev => prev.filter(p => p.id !== id));
    }
  };

  const getNombreCategoria = (catId: number) => {
    return categoriasList.find(c => c.id === catId)?.nombre || 'Sin categoría';
  };

  const productosFiltrados = productos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Catálogo de Productos</h1>
          <p className="text-sm text-gris-calido/70">Administración de precios, stock e inventario general.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/Productos-Eliminados')}
            className="flex items-center justify-center gap-2 border border-dark-border bg-dark-card text-gris-calido hover:text-white px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <HiOutlineArchiveBox className="text-lg" />
            Ver Eliminados
          </button>
          
          <button 
            type="button"
            onClick={handleOpenNewModal}
            className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
          >
            <HiPlus className="text-lg font-bold" />
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar producto por nombre..."
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
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((prod) => {
                  const ganancia = (prod.price - prod.purchase_price).toFixed(2);
                  const currentStock = prod.stock || 0;
                  const minStock = prod.min_stock || 0;
                  const isStockBajo = currentStock <= minStock;

                  return (
                    <tr key={prod.id} className="hover:bg-dark-bg/40 transition-colors">
                      
                      <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                        <div className="p-2 bg-neo-mint/10 rounded-lg text-neo-mint">
                          <HiOutlineCube className="text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold">{prod.name}</p>
                          {prod.barcode && <p className="text-[10px] text-gris-calido/50 font-mono">BC: {prod.barcode}</p>}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-dark-bg text-gris-calido border border-dark-border">
                          {getNombreCategoria(prod.category_id)}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right font-medium text-gris-calido">
                        ${prod.purchase_price.toFixed(2)}
                      </td>

                      <td className="py-4 px-6 text-right font-bold text-white">
                        ${prod.price.toFixed(2)}
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
                          <button 
                            type="button"
                            title="Ver detalle"
                            onClick={() => navigate(`/Productos/${prod.id}`)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                          >
                            <HiOutlineEye className="text-lg" />
                          </button>

                          <button 
                            type="button"
                            title="Editar"
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </button>

                          <button 
                            type="button"
                            title="Eliminar"
                            onClick={() => handleDeleteProduct(prod.id!)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                          >
                            <HiOutlineTrash className="text-lg" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gris-calido/50">
                    No se encontraron productos.
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
        onSave={handleSaveProduct}
        initialData={selectedProduct}
        categoriasList={categoriasList}
        proveedoresList={proveedoresList}
      />
    </div>
  );
}