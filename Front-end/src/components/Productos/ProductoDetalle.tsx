import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, 
  HiOutlineCube, 
  HiOutlinePencilSquare, 
  HiOutlineInformationCircle,
  HiOutlineScale,
  HiOutlineInboxStack
} from 'react-icons/hi2';
import ProductoModal, { type ProductoData } from './ProductoModal';

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

export default function ProductoDetalle() {
  const { id } = useParams();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://api.yahirdev.dev/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProducto(response.data.data || response.data);
      } catch (error) {
        console.error('Error al cargar el producto:', extraerMensajeError(error));
        setErrorMsg('No se pudo encontrar la información de este producto.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducto();
  }, [id, refreshTrigger]);

  if (isLoading) {
    return <div className="p-6 bg-dark-bg text-neo-mint min-h-screen flex items-center justify-center">Cargando producto...</div>;
  }

  if (errorMsg || !producto) {
    return <div className="p-6 bg-dark-bg text-rose-500 min-h-screen flex items-center justify-center">{errorMsg || 'Producto no encontrado'}</div>;
  }

  const precioVenta = parseFloat(String(producto.price || 0));
  const costoCompra = parseFloat(String(producto.purchase_price || 0));
  const ganancia = precioVenta - costoCompra;
  const margenUtilidad = costoCompra > 0 
    ? ((ganancia / costoCompra) * 100).toFixed(1)
    : '0.0';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link 
          to="/Inventario" 
          className="inline-flex items-center gap-2 text-sm text-gris-calido/70 hover:text-neo-mint transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          Volver al catálogo
        </Link>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber-500 text-dark-bg px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-400 transition-all shadow-md"
        >
          <HiOutlinePencilSquare className="text-lg" />
          Editar Información
        </motion.button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md shrink-0">
            <HiOutlineCube className="text-4xl text-neo-mint" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{producto.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className="px-3 py-0.5 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                Categoría: {producto.category?.name || `#${producto.category_id}`}
              </span>
              {producto.barcode && (
                <span className="text-xs font-mono opacity-80">
                  BC: {producto.barcode}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-dark-card border border-dark-border p-5 rounded-xl text-center shadow-sm">
          <p className="text-xs font-semibold text-gris-calido/60 uppercase tracking-wider">Costo de Compra</p>
          <h3 className="text-2xl font-bold text-white mt-1">${costoCompra.toFixed(2)}</h3>
        </div>

        <div className="bg-dark-card border border-dark-border p-5 rounded-xl text-center shadow-sm">
          <p className="text-xs font-semibold text-ghost-blue uppercase tracking-wider">Precio Base de Venta</p>
          <h3 className="text-2xl font-bold text-ghost-blue mt-1">${precioVenta.toFixed(2)}</h3>
        </div>

        <div className="bg-dark-card border border-dark-border p-5 rounded-xl text-center shadow-sm">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Ganancia Unit.</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">${ganancia.toFixed(2)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-gris-calido uppercase tracking-wider mb-2">Descripción del Producto</h3>
            <p className="text-sm text-white bg-dark-bg p-4 rounded-lg border border-dark-border">
              {producto.description || 'Sin descripción detallada.'}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gris-calido uppercase tracking-wider mb-2">Estado del Inventario</h3>
            <div className="flex items-center gap-4 bg-dark-bg p-4 rounded-lg border border-dark-border">
              <span className="text-3xl font-extrabold text-white">{producto.stock || 0}</span>
              <div>
                <p className="text-xs text-gris-calido/70">Unidades disponibles principales</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  producto.min_stock && (producto.stock || 0) <= producto.min_stock 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  Stock Mínimo: {producto.min_stock || 0}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gris-calido uppercase tracking-wider mb-2">Modalidades de Venta Habilitadas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                producto.allows_unit_sale 
                  ? 'bg-neo-mint/10 border-neo-mint/30 text-neo-mint' 
                  : 'bg-dark-bg border-dark-border text-gris-calido/40'
              }`}>
                <HiOutlineCube className="text-lg shrink-0" />
                <span>Por Pieza/Unidad</span>
              </div>

              <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                producto.allows_package_sale 
                  ? 'bg-ghost-blue/10 border-ghost-blue/30 text-ghost-blue' 
                  : 'bg-dark-bg border-dark-border text-gris-calido/40'
              }`}>
                <HiOutlineInboxStack className="text-lg shrink-0" />
                <span>Por Paquete</span>
              </div>

              <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                producto.allows_weight_sale 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : 'bg-dark-bg border-dark-border text-gris-calido/40'
              }`}>
                <HiOutlineScale className="text-lg shrink-0" />
                <span>A Granel / Peso</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Resumen de Rentabilidad</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gris-calido">Margen de Utilidad:</span>
                <span className="font-bold text-emerald-400">{margenUtilidad}%</span>
              </div>

              <div className="w-full bg-dark-bg h-3 rounded-full overflow-hidden border border-dark-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Number(margenUtilidad), 100)}%` }}
                  transition={{ duration: 0.6 }}
                  className="bg-emerald-400 h-full rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-dark-bg rounded-lg border border-dark-border text-xs text-gris-calido/70">
            <HiOutlineInformationCircle className="text-xl text-neo-mint shrink-0 mt-0.5" />
            <p>Este margen representa el porcentaje de beneficio directo calculado sobre el precio de compra original del producto.</p>
          </div>
        </div>
      </div>

      <ProductoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={producto as ProductoData}
        onSuccess={() => {
          setIsModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </motion.div>
  );
}