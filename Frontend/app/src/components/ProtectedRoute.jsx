import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // User is not authenticated; kick them back to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User role is not authorized for this route; redirect somewhere safe
    return <Navigate to="/unauthorized" replace />;
  }

  // If everything matches up, render the child component pages
  return <Outlet />;
};

export default ProtectedRoute;