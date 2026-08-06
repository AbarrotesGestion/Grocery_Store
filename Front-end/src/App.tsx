import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './views/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import CategoriaScreen from './components/Categorias/CategoriaScreen';
import CategoriaDetalle from './components/Categorias/CategoriaDetalle';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;