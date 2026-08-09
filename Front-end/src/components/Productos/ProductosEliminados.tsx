import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlineTrash, 
  HiOutlineArrowPath, 
  HiOutlineXMark,
  HiOutlineArchiveBoxXMark
} from 'react-icons/hi2';

export interface ProductoEliminado {
  id: number;
  nombre: string;
  categoria: string;
  fechaEliminacion: string;
}

export default function ProductosEliminados() {
  const [trashedProducts, setTrashedProducts] = useState<ProductoEliminado[]>([
    {
      id: 101,
      nombre: 'Galletas Chokis 90g',
      categoria: 'Botanas',
      fechaEliminacion: '05/08/2026',
    },
  ]);

  const handleRestore = (id: number) => {
    if (confirm('¿Deseas restaurar este producto al catálogo activo?')) {
      setTrashedProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleForceDelete = (id: number) => {
    if (confirm('¡Atención! Esta acción eliminará permanentemente el producto y no se podrá recuperar. ¿Continuar?')) {
      setTrashedProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div>
        <Link 
          to="/products" 
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
              {trashedProducts.length > 0 ? (
                trashedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-dark-bg/40 transition-colors">
                    <td className="py-4 px-6 font-medium text-white">{prod.nombre}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-dark-bg text-gris-calido border border-dark-border">
                        {prod.categoria}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-rose-400/80 font-medium">{prod.fechaEliminacion}</td>
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
                ))
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
