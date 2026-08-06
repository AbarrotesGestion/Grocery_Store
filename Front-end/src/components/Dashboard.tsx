import React from 'react';
import { 
  HiOutlineShoppingBag, 
  HiOutlineTicket, 
  HiOutlineExclamationTriangle, 
  HiOutlineCurrencyDollar, 
  HiPlus, 
  HiOutlineArrowTrendingUp, 
  HiOutlineChartPie 
} from 'react-icons/hi2';

interface KpiItem {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  border: string;
}
export default function Dashboard() {
  // Datos estáticos de ejemplo
const kpiData: KpiItem[] = [
    { title: 'VENTAS HOY', value: '$0.00', icon: HiOutlineShoppingBag, color: 'text-neo-mint', border: 'border-neo-mint/30' },
    { title: 'TICKETS', value: '0', icon: HiOutlineTicket, color: 'text-ghost-blue', border: 'border-ghost-blue/30' },
    { title: 'STOCK BAJO', value: '0', icon: HiOutlineExclamationTriangle, color: 'text-amber-400', border: 'border-amber-500/30' },
    { title: 'POR COBRAR', value: '$1,244.00', icon: HiOutlineCurrencyDollar, color: 'text-emerald-400', border: 'border-emerald-500/30' },
  ];

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      {/* HEADER DE LA VISTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Vista General</h1>
          <p className="text-sm text-gris-calido/70">Métricas principales del negocio en tiempo real.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10">
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
              Rendimiento Semanal
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
          
          <div className="h-64 w-full flex items-center justify-center border border-dashed border-dark-border rounded-lg bg-dark-bg/40 text-gris-calido/50 text-sm">
            {/* [ Espacio para Chart Component (ej. Recharts) ] */}
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
          </div>

          <div className="pt-3 border-t border-dark-border flex justify-between items-center text-sm">
            <span className="text-gris-calido">Total Productos:</span>
            <span className="font-bold text-white text-base">10</span>
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
                <th className="py-3 px-4">Folio</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Vendedor</th>
                <th className="py-3 px-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              <tr>
                <td colSpan={5} className="py-8 text-center text-gris-calido/50">
                  No hay ventas registradas el día de hoy.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}