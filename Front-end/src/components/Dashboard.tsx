import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  HiOutlineShoppingBag, 
  HiOutlineTicket, 
  HiOutlineExclamationTriangle, 
  HiOutlineCurrencyDollar, 
  HiPlus, 
  HiOutlineArrowTrendingUp, 
  HiOutlineChartPie,
  HiOutlineSparkles
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
  labelsCategorias: string[];
  conteoProductos: number[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

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

  const kpiData = [
    { 
      title: 'VENTAS HOY', 
      value: isLoading ? '...' : `$${Number(data?.ventasHoyTotal || 0).toFixed(2)}`, 
      icon: HiOutlineShoppingBag, 
      color: 'text-neo-mint', 
      bgIcon: 'bg-neo-mint/10',
      border: 'border-neo-mint/40',
      glow: 'shadow-neo-mint/5' 
    },
    { 
      title: 'TICKETS', 
      value: isLoading ? '...' : String(data?.ventasHoy || 0), 
      icon: HiOutlineTicket, 
      color: 'text-ghost-blue', 
      bgIcon: 'bg-ghost-blue/10',
      border: 'border-ghost-blue/40',
      glow: 'shadow-ghost-blue/5' 
    },
    { 
      title: 'STOCK BAJO', 
      value: isLoading ? '...' : String(data?.productosConBajoStock || 0), 
      icon: HiOutlineExclamationTriangle, 
      color: 'text-amber-400', 
      bgIcon: 'bg-amber-500/10',
      border: 'border-amber-500/40',
      glow: 'shadow-amber-500/5' 
    },
    { 
      title: 'POR COBRAR', 
      value: isLoading ? '...' : `$${Number(data?.deudasPendientes || 0).toFixed(2)}`, 
      icon: HiOutlineCurrencyDollar, 
      color: 'text-emerald-400', 
      bgIcon: 'bg-emerald-500/10',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/5' 
    },
  ];

  const chartData = data?.diasLabels ? data.diasLabels.map((dia, index) => ({
    name: dia,
    Ingresos: data.gananciasData[index] || 0,
    Gastos: data.gastosData[index] || 0,
  })) : [];

  const pieData = data?.labelsCategorias ? data.labelsCategorias.map((cat, index) => ({
    name: cat,
    value: data.conteoProductos[index] || 0,
  })) : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6 overflow-hidden"
    >
      
      {/* HEADER DE LA VISTA CON DESTELLO */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-2xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-neo-mint/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neo-mint/10 text-neo-mint border border-neo-mint/20 mb-1">
            <HiOutlineSparkles className="text-sm" /> Panel en Vivo
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Vista General</h1>
          <p className="text-sm text-gris-calido/70">Métricas clave y rendimiento de operaciones en tiempo real.</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 255, 170, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => alert('Redirigiendo al POS...')}
          className="relative z-10 flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-bold px-5 py-3 rounded-xl transition-all shadow-lg"
        >
          <HiPlus className="text-xl font-black" />
          Nueva Venta
        </motion.button>
      </motion.div>

      {/* TARJETAS KPI ULTRA DINÁMICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.2 } }}
              className={`bg-dark-card border-l-4 ${kpi.border} border-y border-r border-dark-border p-5 rounded-2xl flex items-center justify-between shadow-lg ${kpi.glow} relative overflow-hidden`}
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-white/[0.02] rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-gris-calido/70 uppercase tracking-widest">{kpi.title}</p>
                <motion.h3 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-black text-white mt-1 tracking-tight"
                >
                  {kpi.value}
                </motion.h3>
              </div>
              <div className={`p-3.5 ${kpi.bgIcon} rounded-xl ${kpi.color} border border-white/5 shadow-inner`}>
                <Icon className="text-2xl" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SECCIÓN DE GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICA RENDIMIENTO SEMANAL CON ANIMACIÓN LENTA Y PROGRESIVA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="p-2 bg-neo-mint/10 text-neo-mint rounded-lg border border-neo-mint/20">
                <HiOutlineArrowTrendingUp className="text-lg" />
              </div>
              Rendimiento Semanal (Últimos 7 días)
            </h2>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#10B981]"></span> Ingresos
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_#F59E0B]"></span> Gastos
              </span>
            </div>
          </div>
          
          <div className="h-72 w-full pt-4">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-neo-mint text-xs font-semibold animate-pulse">
                Cargando métricas financieras...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }} 
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, '']}
                  />
                  {/* Animación configurada para iniciar despacio desde cero y deslizarse suavemente hasta su punto */}
                  <Area 
                    type="monotone" 
                    dataKey="Ingresos" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorIngresos)" 
                    isAnimationActive={true}
                    animationBegin={300}
                    animationDuration={2800}
                    animationEasing="ease-out"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Gastos" 
                    stroke="#F59E0B" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorGastos)" 
                    isAnimationActive={true}
                    animationBegin={600}
                    animationDuration={3200}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* GRÁFICA STOCK POR CATEGORÍA (DONUT ANIMADO) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between shadow-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="p-2 bg-ghost-blue/10 text-ghost-blue rounded-lg border border-ghost-blue/20">
                <HiOutlineChartPie className="text-lg" />
              </div>
              Stock por Categoría
            </h2>
          </div>

          <div className="h-56 w-full flex items-center justify-center relative">
            {isLoading ? (
              <div className="text-ghost-blue text-xs font-semibold animate-pulse">Cargando distribución...</div>
            ) : pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                    isAnimationActive={true}
                    animationBegin={500}
                    animationDuration={2200}
                    animationEasing="ease-out"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gris-calido/50">Sin categorías registradas</p>
            )}
          </div>

          <div className="pt-4 border-t border-dark-border flex justify-between items-center text-sm">
            <span className="text-gris-calido font-medium">Total Catálogo:</span>
            <span className="font-extrabold text-white text-base bg-dark-bg px-3 py-1 rounded-lg border border-dark-border">
              {isLoading ? '...' : (data?.totalProductos || 0)} unids.
            </span>
          </div>
        </motion.div>

      </div>

      {/* TABLA DE ÚLTIMAS VENTAS ANIMADA EN CASCADA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Últimas Ventas Registradas</h2>
          <span className="text-xs font-mono text-neo-mint bg-neo-mint/10 px-2.5 py-1 rounded-full border border-neo-mint/20">Actualizado</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gris-calido">
            <thead className="bg-dark-bg/90 text-xs uppercase font-bold text-white/70 border-b border-dark-border rounded-lg">
              <tr>
                <th className="py-3.5 px-4 rounded-l-lg">Folio / Grupo</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4">Vendedor</th>
                <th className="py-3.5 px-4 rounded-r-lg">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-neo-mint font-semibold animate-pulse">Sincronizando operaciones...</td>
                </tr>
              ) : data?.ultimasVentas && data.ultimasVentas.length > 0 ? (
                data.ultimasVentas.map((venta, index) => (
                  <motion.tr 
                    key={venta.sale_group_id} 
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.5 + (index * 0.06) }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                    className="transition-colors"
                  >
                    <td className="py-4 px-4 font-mono text-xs text-ghost-blue font-bold">
                      #{venta.sale_group_id.substring(0, 8)}...
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {venta.cliente}
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-emerald-400">
                      ${Number(venta.total).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium">
                      {venta.empleado}
                    </td>
                    <td className="py-4 px-4 text-xs text-gris-calido/70 font-mono">
                      {venta.fecha}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gris-calido/50">
                    No hay ventas registradas recientemente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}