import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HiOutlineShoppingBag, 
  HiOutlineTicket, 
  HiOutlineExclamationTriangle, 
  HiOutlineCurrencyDollar, 
  HiPlus, 
  HiOutlineArrowTrendingUp, 
  HiOutlineChartPie 
} from 'react-icons/hi2';

interface UltimaVenta {
  sale_group_id: string;
  fecha: string;
  total: number;
  empleado: string;
  cliente: string;
  items_count: number;
}

interface DashboardData {
  ventasHoy: number;
  ventasHoyTotal: number;
  productosConBajoStock: number;
  deudasPendientes: number;
  clientesActivos: number;
  ultimasVentas: UltimaVenta[];
  totalProductos: number;
  diasLabels: string[];
  gananciasData: number[];
  gastosData: number[];
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.yahirdev.dev/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error('Error al cargar métricas del dashboard:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Definición de KPIs dinámicos basados en la respuesta del backend
  const kpiData = [
    { 
      title: 'VENTAS HOY', 
      value: isLoading ? '...' : `$${Number(data?.ventasHoyTotal || 0).toFixed(2)}`, 
      icon: HiOutlineShoppingBag, 
      color: 'text-neo-mint', 
      border: 'border-neo-mint/30' 
    },
    { 
      title: 'TICKETS', 
      value: isLoading ? '...' : String(data?.ventasHoy || 0), 
      icon: HiOutlineTicket, 
      color: 'text-ghost-blue', 
      border: 'border-ghost-blue/30' 
    },
    { 
      title: 'STOCK BAJO', 
      value: isLoading ? '...' : String(data?.productosConBajoStock || 0), 
      icon: HiOutlineExclamationTriangle, 
      color: 'text-amber-400', 
      border: 'border-amber-500/30' 
    },
    { 
      title: 'POR COBRAR', 
      value: isLoading ? '...' : `$${Number(data?.deudasPendientes || 0).toFixed(2)}`, 
      icon: HiOutlineCurrencyDollar, 
      color: 'text-emerald-400', 
      border: 'border-emerald-500/30' 
    },
  ];

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      {/* HEADER DE LA VISTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Vista General</h1>
          <p className="text-sm text-gris-calido/70">Métricas principales del negocio en tiempo real.</p>
        </div>
        <button 
          onClick={() => alert('Redirigiendo al POS...')}
          className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
        >
          <HiPlus className="w-5 h-5 text-xl" />
          Nueva Venta
        </button>
      </div>

      {/* TARJETAS KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`bg-dark-card border-l-4 ${kpi.border} border-y border-r border-dark-border p-5 rounded-xl flex items-center justify-between shadow-sm hover:border-dark-border/80 transition-all`}
            >
              <div>
                <p className="text-xs font-semibold text-gris-calido uppercase tracking-wider">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{kpi.value}</h3>
              </div>
              <div className={`p-3 bg-dark-bg/60 rounded-lg ${kpi.color}`}>
                <Icon className="text-2xl" />
              </div>
            </div>
          );
        })}
      </div>

      {/* SECCIÓN DE GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICA RENDIMIENTO SEMANAL */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <HiOutlineArrowTrendingUp className="text-xl text-neo-mint" />
              Rendimiento Semanal (Últimos 7 días)
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-neo-mint">
                <span className="w-2.5 h-2.5 rounded-full bg-neo-mint inline-block"></span> Ingresos
              </span>
              <span className="flex items-center gap-1.5 text-amber-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Gastos
              </span>
            </div>
          </div>
          
          <div className="h-64 w-full flex flex-col items-center justify-center border border-dashed border-dark-border rounded-lg bg-dark-bg/40 text-gris-calido/70 text-xs p-4 space-y-2">
            <p className="font-semibold text-white">Fechas registradas: {data?.diasLabels?.join(', ') || 'Cargando...'}</p>
            <p className="text-center text-gris-calido/50">[ Gráfica de Rendimiento Semanal conectada a los arrays gananciasData y gastosData del backend ]</p>
          </div>
        </div>

        {/* GRÁFICA STOCK POR CATEGORÍA */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <HiOutlineChartPie className="text-xl text-ghost-blue" />
              Stock por Categoría
            </h2>
          </div>

          <div className="h-48 w-full flex items-center justify-center border border-dashed border-dark-border rounded-lg bg-dark-bg/40 text-gris-calido/50 text-sm my-2">
            {/* [ Espacio para Donut Chart ] */}
            <span className="text-xs text-center px-4">Datos listos desde el backend (labelsCategorias y conteoProductos)</span>
          </div>

          <div className="pt-3 border-t border-dark-border flex justify-between items-center text-sm">
            <span className="text-gris-calido">Total Productos:</span>
            <span className="font-bold text-white text-base">
              {isLoading ? '...' : (data?.totalProductos || 0)}
            </span>
          </div>
        </div>

      </div>

      {/* TABLA DE ÚLTIMAS VENTAS */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Últimas Ventas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gris-calido">
            <thead className="bg-dark-bg/80 text-xs uppercase font-semibold text-white/70 border-b border-dark-border">
              <tr>
                <th className="py-3 px-4">Folio / Grupo</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4">Vendedor</th>
                <th className="py-3 px-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neo-mint">Cargando últimas ventas...</td>
                </tr>
              ) : data?.ultimasVentas && data.ultimasVentas.length > 0 ? (
                data.ultimasVentas.map((venta) => (
                  <tr key={venta.sale_group_id} className="hover:bg-dark-bg/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-ghost-blue font-semibold">
                      #{venta.sale_group_id.substring(0, 8)}...
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {venta.cliente}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      ${Number(venta.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {venta.empleado}
                    </td>
                    <td className="py-3 px-4 text-xs text-gris-calido/70">
                      {venta.fecha}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gris-calido/50">
                    No hay ventas registradas recientemente.
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