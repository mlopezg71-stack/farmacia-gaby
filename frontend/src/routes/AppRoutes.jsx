import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/home/Home";
import Productos from "../pages/productos/Productos";
import Categorias from "../pages/categorias/Categorias";
import EnfermedadesComunes from "../pages/enfermedades/EnfermedadesComunes";
import DetalleEnfermedad from "../pages/enfermedades/DetalleEnfermedad";
import Ofertas from "../pages/ofertas/Ofertas";
import Sucursales from "../pages/sucursales/Sucursales";
import Contacto from "../pages/contacto/Contacto";

import ForgotPassword from "../pages/auth/ForgotPassword";

import DashboardAdmin from "../pages/dashboard/DashboardAdmin";

import CatalogoAdmin from "../pages/catalogo/CatalogoAdmin";
import NuevoProducto from "../pages/catalogo/NuevoProducto";
import VisualizarProducto from "../pages/catalogo/VisualizarProducto";
import ModificarProducto from "../pages/catalogo/ModificarProducto";

import InventarioAdmin from "../pages/inventario/InventarioAdmin";

import Usuarios from "../pages/usuarios/Usuarios";
import UsuarioForm from "../pages/usuarios/UsuarioForm";
import UsuarioDetalle from "../pages/usuarios/UsuarioDetalle";

import Bitacora from "../pages/Bitacora/Bitacora";

import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

const AppRoutes = () => {
  const { usuario } = useAuth();

  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          usuario?.roles?.includes("ADMINISTRADOR")
            ? <Navigate to="/dashboard" replace />
            : <Home />
        }
      />

      {/* PRODUCTOS */}
      <Route path="/productos" element={<Productos />} />

      {/* CATEGORIAS */}
      <Route path="/categorias" element={<Categorias />} />

      {/* ENFERMEDADES COMUNES */}
      <Route
        path="/enfermedades"
        element={<EnfermedadesComunes />}
      />

      <Route
        path="/enfermedades-comunes"
        element={<EnfermedadesComunes />}
      />

      {/* DETALLE ENFERMEDADES */}
      <Route
        path="/enfermedades/:slug"
        element={<DetalleEnfermedad />}
      />

      {/* OFERTAS */}
      <Route
        path="/ofertas"
        element={<Ofertas />}
      />

      {/* SUCURSALES */}
      <Route
        path="/sucursales"
        element={<Sucursales />}
      />

      {/* CONTACTO */}
      <Route
        path="/contacto"
        element={<Contacto />}
      />

      {/* RECUPERAR CONTRASEÑA */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute rolesPermitidos={["ADMINISTRADOR"]}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />

      {/* CATÁLOGO ADMINISTRATIVO */}
      <Route
        path="/admin/catalogo"
        element={
          <ProtectedRoute rolesPermitidos={["ADMINISTRADOR"]}>
            <CatalogoAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/catalogo/nuevo"
        element={
          <ProtectedRoute rolesPermitidos={["ADMINISTRADOR"]}>
            <NuevoProducto />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/catalogo/ver/:id"
        element={
          <ProtectedRoute rolesPermitidos={["ADMINISTRADOR"]}>
            <VisualizarProducto />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/catalogo/modificar/:id"
        element={
          <ProtectedRoute rolesPermitidos={["ADMINISTRADOR"]}>
            <ModificarProducto />
          </ProtectedRoute>
        }
      />

      {/* INVENTARIO ADMINISTRATIVO */}
      <Route
        path="/admin/inventario"
        element={
          <ProtectedRoute rolesPermitidos={["ADMINISTRADOR"]}>
            <InventarioAdmin />
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