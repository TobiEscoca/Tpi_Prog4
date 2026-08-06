import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ALLOWED_ROLES = ["DuenoComplejo"];

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!ALLOWED_ROLES.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
