import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/common/LoadingScreen';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  // If not authenticated, still render children (public resources) but could show a notice
  // Previously: redirect to /login. Updated to allow access.
  return children;
}
