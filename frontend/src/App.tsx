import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import VehiculosPage from './pages/VehiculosPage';
import CitasPage from './pages/CitasPage';
import OrdenesPage from './pages/OrdenesPage';
import FacturasPage from './pages/FacturasPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/vehiculos" element={<VehiculosPage />} />
        <Route path="/citas" element={<CitasPage />} />
        <Route path="/ordenes" element={<OrdenesPage />} />
        <Route path="/facturas" element={<FacturasPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
