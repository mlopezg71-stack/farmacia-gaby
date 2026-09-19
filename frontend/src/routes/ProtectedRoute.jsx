import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;