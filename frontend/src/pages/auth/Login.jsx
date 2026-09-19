import { useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import {
  faUser,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    correo: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("Personal Médico");

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await api.post("/auth/login", formulario);

      const usuario = respuesta.data.usuario;
      const token = respuesta.data.token;
      const rol = usuario.rol;

      if (tipoUsuario === "Paciente" && rol !== "PACIENTE") {
        setError("Este usuario no pertenece al acceso de pacientes");
        return;
      }

      if (tipoUsuario === "Personal Médico" && rol === "PACIENTE") {
        setError("Este usuario no pertenece al acceso de personal médico");
        return;
      }

      login(usuario, token);

      if (rol === "PACIENTE") {
        navigate("/dashboard-paciente");
      } else {
        navigate("/dashboard");
      }

      console.log("Login correcto:", respuesta.data);

    } catch (error) {
      setError("Correo o contraseña incorrectos");
    }
  };

  const estilos = {
    container: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      overflow: "hidden",
      backgroundColor: "#ffffff",
      fontFamily: "Arial, Helvetica, sans-serif",
    },

    left: {
      width: "42%",
      height: "100vh",
      background:
        "linear-gradient(rgba(11, 44, 95, 0.78), rgba(11, 44, 95, 0.9)), url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1974&auto=format&fit=crop')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },

    overlay: {
      width: "100%",
      height: "100%",
      padding: "25px 40px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },

    titleLeft: {
      color: "#ffffff",
      fontSize: "34px",
      marginBottom: "20px",
      fontWeight: "700",
    },

    description: {
      color: "rgba(255,255,255,0.92)",
      fontSize: "15px",
      padding: "0 20px",
      lineHeight: "1.7",
      maxWidth: "460px",
    },

    footer: {
      marginTop: "35px",
      color: "rgba(255,255,255,0.82)",
      fontSize: "13px",
      lineHeight: "1.8",
    },

    right: {
      width: "58%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff",
    },

    card: {
      width: "430px",
    },

    header: {
      textAlign: "center",
      marginBottom: "28px",
    },

    title: {
      fontSize: "58px",
      color: "#0b2c5f",
      marginBottom: "8px",
      fontWeight: "700",
    },

    subtitle: {
      color: "#8a94a6",
      fontSize: "18px",
      marginBottom: "0",
    },

    roleSelector: {
      display: "flex",
      gap: "12px",
      marginBottom: "22px",
    },

    roleButton: {
      flex: 1,
      height: "43px",
      border: "1px solid #e1e7f0",
      borderRadius: "9px",
      backgroundColor: "#f8faff",
      color: "#0b2c5f",
      fontWeight: "700",
      cursor: "pointer",
      fontSize: "14px",
    },

    roleButtonActive: {
      backgroundColor: "#0b2c5f",
      color: "#ffffff",
      borderColor: "#0b2c5f",
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },

    inputGroup: {
      position: "relative",
      width: "100%",
    },

    inputIcon: {
      position: "absolute",
      top: "50%",
      left: "16px",
      transform: "translateY(-50%)",
      color: "#8a94a6",
      fontSize: "17px",
    },

    input: {
      width: "100%",
      height: "48px",
      border: "1px solid #e1e7f0",
      borderRadius: "9px",
      padding: "0 15px 0 48px",
      fontSize: "15px",
      color: "#1d2b4f",
      backgroundColor: "#ffffff",
      outline: "none",
    },

    error: {
      color: "#c62828",
      fontSize: "14px",
      textAlign: "center",
    },

    submitButton: {
      height: "50px",
      border: "none",
      borderRadius: "9px",
      backgroundColor: "#0b2c5f",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "4px",
    },

    secure: {
      display: "block",
      marginTop: "18px",
      color: "#8a94a6",
      fontSize: "13px",
      textAlign: "center",
    },
  };

  return (
    <div style={estilos.container}>
      <div style={estilos.left}>
        <div style={estilos.overlay}>

          <h1 style={estilos.titleLeft}>Bienvenido a Farmacia Gaby</h1>

          <p style={estilos.description}>
            Sistema de Expediente Clínico Electrónico diseñado para optimizar la
            gestión de productos, compras y servicios de farmacia de forma
            segura y eficiente.
          </p>

          <div style={estilos.footer}>
            <p>© 2026 Farmacia Gaby. Todos los derechos reservados.</p>
            <p>Desarrollado por Samir López</p>
          </div>
        </div>
      </div>

      <div style={estilos.right}>
        <div style={estilos.card}>
          <div style={estilos.header}>

            <h2 style={estilos.title}>Farmacia Gaby</h2>

            <p style={estilos.subtitle}>
              Sistema de Expediente Clínico Electrónico
            </p>
          </div>

          <div style={estilos.roleSelector}>
            <button
              type="button"
              onClick={() => setTipoUsuario("Personal Médico")}
              style={{
                ...estilos.roleButton,
                ...(tipoUsuario === "Personal Médico"
                  ? estilos.roleButtonActive
                  : {}),
              }}
            >
              Personal Médico
            </button>

            <button
              type="button"
              onClick={() => setTipoUsuario("Paciente")}
              style={{
                ...estilos.roleButton,
                ...(tipoUsuario === "Paciente" ? estilos.roleButtonActive : {}),
              }}
            >
              Paciente
            </button>
          </div>

          <form onSubmit={iniciarSesion} style={estilos.form}>
            <div style={estilos.inputGroup}>
              <FontAwesomeIcon
                icon={faUser}
                style={estilos.inputIcon}
              />
              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={formulario.correo}
                onChange={manejarCambio}
                required
                style={estilos.input}
              />
            </div>

            <div style={estilos.inputGroup}>
              <FontAwesomeIcon
                icon={faLock}
                style={estilos.inputIcon}
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formulario.password}
                onChange={manejarCambio}
                required
                style={estilos.input}
              />
            </div>

            {error && <p style={estilos.error}>{error}</p>}

            <button type="submit" style={estilos.submitButton}>
              Iniciar sesión
            </button>
          </form>

          <span style={estilos.secure}>Acceso seguro protegido con JWT</span>
        </div>
      </div>
    </div>
  );
};

export default Login;