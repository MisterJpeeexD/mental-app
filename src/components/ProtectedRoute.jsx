import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingScreen from './common/LoadingScreen';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Soporta dos formas de uso:
  //  - <ProtectedRoute><ProfilePage /></ProtectedRoute>  (children directo)
  //  - <Route element={<ProtectedRoute />}><Route ... /></Route>  (rutas anidadas via Outlet)
  return children ?? <Outlet />;
};

export default ProtectedRoute;
