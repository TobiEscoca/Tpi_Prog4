import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEFAULT_ALLOWED_ROLES = ["DuenoComplejo"];

function ProtectedRoute({ children, roles = DEFAULT_ALLOWED_ROLES }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
