import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineDocumentText, 
  HiOutlineEye, 
  HiOutlineArrowPath, 
  HiOutlineNoSymbol,
  HiOutlineMagnifyingGlass,
  HiOutlineUser
} from 'react-icons/hi2';

// 1. Interfaz adaptada al controlador (quantity ahora es number para soportar decimales por peso/granel)
export interface Venta {
  id: number;
  sale_group_id?: string;
  quantity: number;
  sale_unit_type?: 'unit' | 'package' | 'weight';
  total_price: number;
  status?: string;
  created_at: string;
  product?: {
    name: string;
    price: number;
  };
  employee?: {
    first_name: string;
    last_name: string;
  };
}

export default function HistorialVentasScreen() {
  const navigate = useNavigate();

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 2. Petición para traer el historial de ventas desde Laravel
  useEffect(() => {
    const fetchVentas = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.yahirdev.dev/api/sales', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const dataRevisada = response.data.data || response.data;
        setVentas(Array.isArray(dataRevisada) ? dataRevisada : []);
      } catch (error) {
        console.error('Error al cargar el historial de ventas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVentas();
  }, [refreshTrigger]);

  // 3. Función conectada a tu backend para cancelar una venta
  const handleCancelVenta = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta venta? Se devolverá el stock al inventario.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`https://api.yahirdev.dev/api/sales/${id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Refrescamos la lista de ventas para ver el cambio de estado
        setRefreshTrigger(prev => prev + 1);
        alert('Venta cancelada exitosamente.');
      } catch (error: any) {
        console.error('Error al cancelar la venta:', error);
        const mensaje = error.response?.data?.message || 'No se pudo cancelar la venta.';
        alert(mensaje);
      }
    }
  };

  // Filtrado optimizado considerando las relaciones de la API
  const ventasFiltradas = (Array.isArray(ventas) ? ventas : []).filter(v => {
    const query = search.toLowerCase();
    const folio = String(v.id || '').toLowerCase();
    const grupo = (v.sale_group_id || '').toLowerCase();
    const producto = (v.product?.name || '').toLowerCase();
    const vendedor = `${v.employee?.first_name || ''} ${v.employee?.last_name || ''}`.toLowerCase();

    return folio.includes(query) || grupo.includes(query) || producto.includes(query) || vendedor.includes(query);
  });

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Historial de Ventas</h1>
          <p className="text-sm text-gris-calido/70">Registro General de Operaciones.</p>
        </div>
        
        <button 
          onClick={() => navigate('/pos')}
          className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
        >
          <HiPlus className="text-lg font-bold" />
          Nueva Venta
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar por ID, producto o vendedor..."
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
                <th className="py-3.5 px-6">ID / Folio</th>
                <th className="py-3.5 px-6">Producto</th>
                <th className="py-3.5 px-6 text-center">Cantidad</th>
                <th className="py-3.5 px-6 text-right">Total</th>
                <th className="py-3.5 px-6">Vendedor</th>
                <th className="py-3.5 px-6">Fecha y Hora</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neo-mint">
                    Cargando historial de ventas...
                  </td>
                </tr>
              ) : ventasFiltradas.length > 0 ? (
                ventasFiltradas.map((v) => {
                  const fechaPartes = v.created_at ? v.created_at.split('T') : ['N/A', 'N/A'];
                  const fecha = fechaPartes[0];
                  const hora = fechaPartes[1] ? fechaPartes[1].substring(0, 5) : '';
                  const isCancelled = v.status === 'cancelled';

                  // Identificador de la unidad de medida según el backend
                  let unidadTexto = 'unidad(es)';
                  if (v.sale_unit_type === 'weight') unidadTexto = 'kg';
                  if (v.sale_unit_type === 'package') unidadTexto = 'paquete(s)';

                  return (
                    <tr key={v.id} className={`hover:bg-dark-bg/40 transition-colors ${isCancelled ? 'opacity-50 bg-rose-500/5' : ''}`}>
                      
                      <td className="py-4 px-6 font-semibold text-ghost-blue font-mono">
                        #{v.id}
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-medium text-white">{v.product?.name || 'Producto desconocido'}</p>
                        <p className="text-xs text-gris-calido/60">
                          ${v.product?.price ? Number(v.product.price).toFixed(2) : '0.00'} c/u
                        </p>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-dark-bg text-gris-calido border border-dark-border">
                          {v.quantity} {unidadTexto}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right font-bold text-emerald-400">
                        ${Number(v.total_price || 0).toFixed(2)}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-white">
                          <HiOutlineUser className="text-neo-mint" />
                          <span>{v.employee ? `${v.employee.first_name} ${v.employee.last_name}` : 'N/A'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gris-calido">
                        <p>{fecha}</p>
                        <p className="text-gris-calido/50">{hora}</p>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          <button 
                            title="Descargar PDF"
                            onClick={() => alert(`Generando PDF del ticket #${v.id}`)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <HiOutlineDocumentText className="text-lg" />
                          </button>

                          <button 
                            title="Ver Ticket"
                            onClick={() => navigate(`/Ventas/${v.id}`)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                          >
                            <HiOutlineEye className="text-lg" />
                          </button>

                          <button 
                            title="Devolución"
                            onClick={() => alert(`Devolución de la venta #${v.id}`)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <HiOutlineArrowPath className="text-lg" />
                          </button>

                          {!isCancelled && (
                            <button 
                              title="Cancelar Venta"
                              onClick={() => handleCancelVenta(v.id)}
                              className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                            >
                              <HiOutlineNoSymbol className="text-lg" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gris-calido/50">
                    No se encontraron registros de ventas.
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