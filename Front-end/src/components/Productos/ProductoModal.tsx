import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HiXMark, 
  HiOutlineCube, 
  HiOutlineQrCode, 
  HiOutlineScale, 
  HiOutlineInboxStack 
} from 'react-icons/hi2';

export interface ProductoData {
  id?: number;
  name: string;
  description: string;
  price: number;
  purchase_price: number;
  stock?: number;
  min_stock?: number;
  category_id: number;
  supplier_id?: number | null;
  barcode?: string;
  package_size?: number;
  stock_in_units?: number;
  price_per_unit?: number;
  price_per_package?: number;
  price_per_kg?: number;
  allows_unit_sale?: boolean;
  allows_package_sale?: boolean;
  allows_weight_sale?: boolean;
}

interface Categoria {
  id: number;
  name: string;
}

interface Proveedor {
  id: number;
  company_name: string;
}

interface ProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ProductoData | null;
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function ProductoModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: ProductoModalProps) {
  
  const [categoriasList, setCategoriasList] = useState<Categoria[]>([]);
  const [proveedoresList, setProveedoresList] = useState<Proveedor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<ProductoData>({
    name: '',
    description: '',
    price: 0,
    purchase_price: 0,
    stock: 0,
    min_stock: 5,
    category_id: 0,
    supplier_id: null,
    barcode: '',
    package_size: 1,
    stock_in_units: 0,
    price_per_unit: 0,
    price_per_package: 0,
    price_per_kg: 0,
    allows_unit_sale: true,
    allows_package_sale: false,
    allows_weight_sale: false,
  });

  useEffect(() => {
    if (isOpen) {
      // 1. Cargar datos iniciales o resetear formulario
      if (initialData) {
        setFormData({
          ...initialData,
          price: Number(initialData.price),
          purchase_price: Number(initialData.purchase_price),
          price_per_unit: Number(initialData.price_per_unit || 0),
          price_per_package: Number(initialData.price_per_package || 0),
          price_per_kg: Number(initialData.price_per_kg || 0),
        });
      } else {
        setFormData({
          name: '', description: '', price: 0, purchase_price: 0, stock: 0, min_stock: 5,
          category_id: categoriasList[0]?.id || 0, supplier_id: null, barcode: '',
          package_size: 1, stock_in_units: 0, price_per_unit: 0, price_per_package: 0, price_per_kg: 0,
          allows_unit_sale: true, allows_package_sale: false, allows_weight_sale: false,
        });
      }

      // 2. Fetch de catálogos necesarios para los selectores
      const fetchCatalogos = async () => {
        try {
          const token = localStorage.getItem('token');
          const [resCat, resProv] = await Promise.all([
            axios.get('https://api.yahirdev.dev/api/categories', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('https://api.yahirdev.dev/api/suppliers', { headers: { Authorization: `Bearer ${token}` } })
          ]);
          
          const cats = resCat.data.data || resCat.data;
          const provs = resProv.data.data || resProv.data;
          
          setCategoriasList(cats);
          setProveedoresList(provs);

          // Si es un producto nuevo, pre-seleccionar la primera categoría una vez que cargue
          if (!initialData && cats.length > 0) {
            setFormData(prev => ({ ...prev, category_id: cats[0].id }));
          }
        } catch (error) {
          console.error('Error cargando catálogos:', extraerMensajeError(error));
        }
      };
      
      fetchCatalogos();
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData };
      
      // Limpiar supplier_id si está vacío para evitar errores de llave foránea
      if (!payload.supplier_id) payload.supplier_id = null;

      if (initialData?.id) {
        // Actualizar producto existente
        await axios.put(`https://api.yahirdev.dev/api/products/${initialData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Producto actualizado exitosamente.');
      } else {
        // Crear nuevo producto
        await axios.post('https://api.yahirdev.dev/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Producto creado exitosamente.');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      alert(extraerMensajeError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-dark-card border border-dark-border w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden my-8">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HiOutlineCube className="text-neo-mint text-xl" />
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gris-calido/60 hover:text-white rounded-lg hover:bg-dark-bg transition-colors"
          >
            <HiXMark className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-neo-mint uppercase tracking-wider">
              Información General
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Galletas Emperador 12pk"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Código de Barras
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={255}
                    value={formData.barcode || ''}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="7501000123456"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint font-mono"
                  />
                  <HiOutlineQrCode className="absolute left-3 top-3 text-gris-calido/60 text-lg" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Categoría *
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                >
                  <option value="" disabled className="bg-dark-card text-gris-calido/50">Seleccionar categoría...</option>
                  {categoriasList.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-dark-card text-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                  Proveedor Predeterminado
                </label>
                <select
                  value={formData.supplier_id || ''}
                  onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value ? Number(e.target.value) : null })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint"
                >
                  <option value="" className="bg-dark-card text-gris-calido/50">Ninguno / Seleccionar...</option>
                  {proveedoresList.map((prov) => (
                    <option key={prov.id} value={prov.id} className="bg-dark-card text-white">
                      {prov.company_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gris-calido uppercase tracking-wider mb-2">
                Descripción *
              </label>
              <textarea
                rows={2}
                required
                maxLength={1000}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción detallada del contenido del producto..."
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neo-mint resize-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-dark-border">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Inventario Base y Precios
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gris-calido uppercase tracking-wider mb-1">
                  P. Compra *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.purchase_price}
                  onChange={(e) => setFormData({ ...formData, purchase_price: Number(e.target.value) })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neo-mint"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gris-calido uppercase tracking-wider mb-1">
                  P. Venta Base *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neo-mint"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gris-calido uppercase tracking-wider mb-1">
                  Stock Principal
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock || 0}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neo-mint"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gris-calido uppercase tracking-wider mb-1">
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.min_stock || 0}
                  onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neo-mint"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-dark-border">
            <h4 className="text-xs font-bold text-ghost-blue uppercase tracking-wider flex items-center gap-2">
              <HiOutlineInboxStack className="text-base" />
              Modalidades de Venta y Presentaciones
            </h4>

            {/* Venta por Paquete */}
            <div className="bg-dark-bg/60 border border-dark-border p-4 rounded-xl space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allows_package_sale || false}
                  onChange={(e) => setFormData({ ...formData, allows_package_sale: e.target.checked })}
                  className="w-4 h-4 accent-neo-mint rounded"
                />
                <span className="text-xs font-semibold text-white">
                  Permitir Venta por Paquete / Caja
                </span>
              </label>

              {formData.allows_package_sale && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dark-border/50 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] text-gris-calido mb-1">
                      Piezas por Paquete
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.package_size || 1}
                      onChange={(e) => setFormData({ ...formData, package_size: Number(e.target.value) })}
                      placeholder="Ej. 12, 24"
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neo-mint"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gris-calido mb-1">
                      Precio por Paquete $
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price_per_package || 0}
                      onChange={(e) => setFormData({ ...formData, price_per_package: Number(e.target.value) })}
                      placeholder="$250.00"
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neo-mint"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Venta por Unidad */}
            <div className="bg-dark-bg/60 border border-dark-border p-4 rounded-xl space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allows_unit_sale || false}
                  onChange={(e) => setFormData({ ...formData, allows_unit_sale: e.target.checked })}
                  className="w-4 h-4 accent-neo-mint rounded"
                />
                <span className="text-xs font-semibold text-white">
                  Permitir Venta por Pieza / Unidad
                </span>
              </label>

              {formData.allows_unit_sale && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dark-border/50 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] text-gris-calido mb-1">
                      Stock en Unidades Sueltas (`stock_in_units`)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock_in_units || 0}
                      onChange={(e) => setFormData({ ...formData, stock_in_units: Number(e.target.value) })}
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neo-mint"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gris-calido mb-1">
                      Precio Individual por Unidad $
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price_per_unit || 0}
                      onChange={(e) => setFormData({ ...formData, price_per_unit: Number(e.target.value) })}
                      placeholder="$15.00"
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neo-mint"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Venta a Granel */}
            <div className="bg-dark-bg/60 border border-dark-border p-4 rounded-xl space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allows_weight_sale || false}
                  onChange={(e) => setFormData({ ...formData, allows_weight_sale: e.target.checked })}
                  className="w-4 h-4 accent-neo-mint rounded"
                />
                <span className="text-xs font-semibold text-white flex items-center gap-2">
                  <HiOutlineScale className="text-amber-400" />
                  Permitir Venta a Granel / Peso
                </span>
              </label>

              {formData.allows_weight_sale && (
                <div className="pt-2 border-t border-dark-border/50 animate-in fade-in duration-150">
                  <label className="block text-[11px] text-gris-calido mb-1">
                    Precio por Kilogramo $
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_per_kg || 0}
                    onChange={(e) => setFormData({ ...formData, price_per_kg: Number(e.target.value) })}
                    placeholder="$32.00"
                    className="w-full sm:w-1/2 bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neo-mint"
                  />
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gris-calido hover:bg-dark-bg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name || !formData.category_id}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-neo-mint text-dark-bg hover:bg-neo-mint/90 transition-all shadow-md shadow-neo-mint/10 disabled:opacity-50"
            >
              {isLoading ? 'Procesando...' : initialData ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}