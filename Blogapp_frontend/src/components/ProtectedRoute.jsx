import { Navigate } from "react-router";
// Difference between Navigate and useNavigate is that 
// Navigate is a component used for declarative navigation in JSX, while useNavigate is a hook 
// that provides a function for programmatic navigation within event handlers or effects.
import { useAuth } from "../store/authStore";

function ProtectedRoute({ children, allowedRoles }) {
  const {loading, currentUser, isAuthenticated} = useAuth();
  // Still checking auth status = show loading
  if (loading) {
    return <p className="text-center mt-10 text-lg">Checking authentication...</p>;
  }

  // Not logged in = redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role = redirect to home
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/" replace />; 
  }

  return children; 
}

export default ProtectedRoute;