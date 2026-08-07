import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './views/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import CategoriaScreen from './components/Categorias/CategoriaScreen';
import CategoriaDetalle from './components/Categorias/CategoriaDetalle';
import ProductosScreen from './components/Productos/ProductoScreen';
import ProductoDetalle from './components/Productos/ProductoDetalle';
import HistorialVentasScreen from './components/Historial/HistorialVentasScreen';
import VentaDetalle from './components/Historial/VentaDetalle';
import ClientesScreen from './components/Clientes/ClientesScreen';
import ClienteDetalle from './components/Clientes/ClienteDetalle';
import DeudaClienteDetalle from './components/Deuda_Clientes/DeudaClienteDetalle';
import CobrosClientesScreen from './components/Deuda_Clientes/CobrosClientesScreen';
import EmpleadosScreen from './components/Empleados/EmpleadosScreen';
import EmpleadoDetalle from './components/Empleados/EmpleadoDetalle';
import ProductosEliminados from './components/Productos/ProductosEliminados';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route 
          path="/Categorias" 
          element={
            <Layout>
              <CategoriaScreen />
            </Layout>
          } 
        />
        <Route 
          path="/Categorias/:id" 
          element={
            <Layout>
              <CategoriaDetalle />
            </Layout>
          } 
        />
        <Route 
          path="/Productos" 
          element={
            <Layout>
              <ProductosScreen />
            </Layout>
          } 
        />
        <Route 
          path="/Productos/:id" 
          element={
            <Layout>
              <ProductoDetalle />
            </Layout>
          } 
        />
        <Route 
          path="/Productos-eliminados" 
          element={
            <Layout>
              <ProductosEliminados />
            </Layout>} 
        />
        <Route 
          path="/Ventas" 
          element={
            <Layout>
              <HistorialVentasScreen />
            </Layout>
          } 
        />
        <Route 
          path="/Ventas/:id" 
          element={
            <Layout>
              <VentaDetalle />
            </Layout>
          } 
        />
        <Route 
          path="/Clientes" 
          element={
            <Layout>
              <ClientesScreen />
            </Layout>
          } 
        />
        <Route 
          path="/Clientes/:id" 
          element={
            <Layout>
              <ClienteDetalle />
            </Layout>
          } 
        />
        <Route 
          path="/Cliente-deudas" 
          element={
            <Layout>
              <CobrosClientesScreen />
            </Layout>
          } 
        />
        <Route 
          path="/Cliente-deudas/:id" 
          element={
            <Layout>
              <DeudaClienteDetalle />
            </Layout>
          } 
        />
        <Route 
          path="/Empleados" 
          element={
            <Layout>
              <EmpleadosScreen />
            </Layout>
          } 
        />
        <Route 
          path="/Empleados/:id" 
          element={
            <Layout>
              <EmpleadoDetalle />
            </Layout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;