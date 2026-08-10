import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Landing from './views/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import CategoriaScreen from './components/Categorias/CategoriaScreen';
import CategoriaDetalle from './components/Categorias/CategoriaDetalle';
import ProductosScreen from './components/Productos/ProductoScreen';
import ProductoDetalle from './components/Productos/ProductoDetalle';
import ProductosEliminados from './components/Productos/ProductosEliminados';
import HistorialVentasScreen from './components/Historial/HistorialVentasScreen';
import VentaDetalle from './components/Historial/VentaDetalle';
import ClientesScreen from './components/Clientes/ClientesScreen';
import ClienteDetalle from './components/Clientes/ClienteDetalle';
import CobrosClientesScreen from './components/Deuda_Clientes/CobrosClientesScreen';
import DeudaClienteDetalle from './components/Deuda_Clientes/DeudaClienteDetalle';
import EmpleadosScreen from './components/Empleados/EmpleadosScreen';
import EmpleadoDetalle from './components/Empleados/EmpleadoDetalle';

// Nuevos módulos integrados y optimizados
import AjustesInventarioScreen from './components/inventarios/AjustesInventarioScreen';
import CashRegistersScreen from './components/Caja/CashRegistersScreen';
import RolesScreen from './components/Roles/RolesScreen';
import ProveedoresScreen from './components/Proveedores/ProveedoresScreen';
import ProveedorDetalle from './components/Proveedores/ProveedorDetalle';
import DeudasProveedoresScreen from './components/Proveedores/DeudasProveedoresScreen';
import ProviderFundsScreen from './components/Proveedores/ProviderFundsScreen';
import NotasProveedorScreen from './components/NotasProveedor/NotasProveedorScreen';
import NotaTratoDetalleScreen from './components/NotasProveedor/NotaTratoDetalleScreen';

// Componente wrapper para dar animación fluida de entrada a cada vista
function AnimatedRoute({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <Layout>
              <AnimatedRoute><Dashboard /></AnimatedRoute>
            </Layout>
          }
        />
        <Route 
          path="/Categorias" 
          element={
            <Layout>
              <AnimatedRoute><CategoriaScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/Categorias/:id" 
          element={
            <Layout>
              <AnimatedRoute><CategoriaDetalle /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/Productos" 
          element={
            <Layout>
              <AnimatedRoute><ProductosScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/Productos/:id" 
          element={
            <Layout>
              <AnimatedRoute><ProductoDetalle /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/Productos-eliminados" 
          element={
            <Layout>
              <AnimatedRoute><ProductosEliminados /></AnimatedRoute>
            </Layout>
          } 
        />

        <Route 
          path="/ajustes-inventario" 
          element={
            <Layout>
              <AnimatedRoute><AjustesInventarioScreen /></AnimatedRoute>
            </Layout>
          } 
        />

        <Route 
          path="/Ventas" 
          element={
            <Layout>
              <AnimatedRoute><HistorialVentasScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/Ventas/:id" 
          element={
            <Layout>
              <AnimatedRoute><VentaDetalle /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/Clientes" 
          element={
            <Layout>
              <AnimatedRoute><ClientesScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/Clientes/:id" 
          element={
            <Layout>
              <AnimatedRoute><ClienteDetalle /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/Cliente-deudas" 
          element={
            <Layout>
              <AnimatedRoute><CobrosClientesScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/Cliente-deudas/:id" 
          element={
            <Layout>
              <AnimatedRoute><DeudaClienteDetalle /></AnimatedRoute>
            </Layout>
          } 
        />

        <Route 
          path="/caja" 
          element={
            <Layout>
              <AnimatedRoute><CashRegistersScreen /></AnimatedRoute>
            </Layout>
          } 
        />

        <Route 
          path="/Empleados" 
          element={
            <Layout>
              <AnimatedRoute><EmpleadosScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/Empleados/:id" 
          element={
            <Layout>
              <AnimatedRoute><EmpleadoDetalle /></AnimatedRoute>
            </Layout>
          } 
        />

        <Route 
          path="/roles" 
          element={
            <Layout>
              <AnimatedRoute><RolesScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/proveedores" 
          element={
            <Layout>
              <AnimatedRoute><ProveedoresScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/proveedores/:id" 
          element={
            <Layout>
              <AnimatedRoute><ProveedorDetalle /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/deudas-proveedores" 
          element={
            <Layout>
              <AnimatedRoute><DeudasProveedoresScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/fondos-proveedores" 
          element={
            <Layout>
              <AnimatedRoute><ProviderFundsScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        
        {/* Rutas para las notas de proveedores */}
        <Route 
          path="/notas-proveedor" 
          element={
            <Layout>
              <AnimatedRoute><NotasProveedorScreen /></AnimatedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/notas-proveedor/:id" 
          element={
            <Layout>
              <AnimatedRoute><NotaTratoDetalleScreen /></AnimatedRoute>
            </Layout>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;