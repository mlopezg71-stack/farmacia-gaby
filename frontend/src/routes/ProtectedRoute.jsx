import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, rolesPermitidos }) => {
  const { estaAutenticado, usuario } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/" />;
  }

  if (
    rolesPermitidos &&
    !rolesPermitidos.some((rol) => usuario?.roles?.includes(rol))
  ) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;