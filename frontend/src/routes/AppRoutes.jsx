import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import DashboardAdmin from "../pages/dashboard/DashboardAdmin";

import Usuarios from "../pages/usuarios/Usuarios";
import UsuarioForm from "../pages/usuarios/UsuarioForm";
import UsuarioDetalle from "../pages/usuarios/UsuarioDetalle";

import Bitacora from "../pages/Bitacora/Bitacora";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />

      {/* USUARIOS */}
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios/crear"
        element={
          <ProtectedRoute>
            <UsuarioForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios/editar/:id"
        element={
          <ProtectedRoute>
            <UsuarioForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios/ver/:id"
        element={
          <ProtectedRoute>
            <UsuarioDetalle />
          </ProtectedRoute>
        }
      />

      {/* BITÁCORA */}
      <Route
        path="/bitacora"
        element={
          <ProtectedRoute>
            <Bitacora />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;