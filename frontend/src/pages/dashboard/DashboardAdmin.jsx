import { useAuth } from "../../context/AuthContext";
import {
  FaHome,
  FaUserInjured,
  FaFolderOpen,
  FaStethoscope,
  FaNotesMedical,
  FaPills,
  FaPrescriptionBottleAlt,
  FaCalendarAlt,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosClient from "../../api/axiosConfig";
import logo from "../../assets/logos/medicore-Copy.png";
import NotificacionesDropdown from "../../components/notificaciones/NotificacionesDropdown";


const DashboardAdmin = () => {
  const { usuario, logout } = useAuth();

  const navigate = useNavigate();

  const esAdmin = usuario?.rol === "ADMIN";

  const [resumen, setResumen] = useState({
    pacientes: 0,
    expedientes: 0,
    citas: 0,
    usuarios: 0
  });

  useEffect(() => {
    obtenerResumen();
  }, []);

  const obtenerResumen = async () => {
    try {

      const response = await axiosClient.get("/dashboard/resumen");

      console.log("RESUMEN DASHBOARD:", response.data);

      setResumen(response.data);

    } catch (error) {

      console.error("Error al obtener resumen:", error);

    }
  };

  const modulos = [
    { nombre: "Inicio", icono: <FaHome />, ruta: "/dashboard", visible: true },
    { nombre: "Pacientes", icono: <FaUserInjured />, ruta: "/pacientes", visible: true },
    { nombre: "Expedientes", icono: <FaFolderOpen />, ruta: "/expedientes", visible: true },
    { nombre: "Consultas", icono: <FaStethoscope />, ruta: "/consultas", visible: true },
    { nombre: "Diagnósticos", icono: <FaNotesMedical />, ruta: "/diagnosticos", visible: true },
    { nombre: "Tratamientos", icono: <FaPills />, ruta: "/tratamientos", visible: true },
    { nombre: "Recetas", icono: <FaPrescriptionBottleAlt />, ruta: "/recetas", visible: true },
    { nombre: "Citas", icono: <FaCalendarAlt />, ruta: "/citas", visible: true },
    { nombre: "Usuarios", icono: <FaUsers />, ruta: "/usuarios", visible: esAdmin },
    { nombre: "Bitácora", icono: <FaClipboardList />, ruta: "/bitacora", visible: esAdmin }
  ];

  const styles = {
    layout: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f5f7fb",
      fontFamily: "'Segoe UI', sans-serif"
    },
    sidebar: {
      width: "250px",
      background: "linear-gradient(180deg, #062b5f 0%, #031b3d 100%)",
      color: "#fff",
      padding: "25px 18px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    logo: {
      textAlign: "center",
      marginBottom: "35px"
    },
    logoImage: {
      width: "95px",
      marginBottom: "14px",
      backgroundColor: "#ffffff",
      padding: "10px",
      borderRadius: "14px",
      boxShadow: "0 8px 18px rgba(0,0,0,0.18)"
    },
    logoTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      margin: 0
    },
    logoSubtitle: {
      fontSize: "12px",
      opacity: 0.8,
      marginTop: "8px"
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "13px 14px",
      borderRadius: "8px",
      marginBottom: "8px",
      cursor: "pointer",
      fontSize: "15px",
      color: "#eef4ff"
    },
    activeItem: {
      backgroundColor: "#f4bd4f",
      color: "#08234d",
      fontWeight: "bold"
    },
    logout: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "13px",
      borderTop: "1px solid rgba(255,255,255,0.2)",
      cursor: "pointer",
      fontSize: "14px"
    },
    main: {
      flex: 1,
      padding: "25px 35px"
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e1e7f0",
      paddingBottom: "18px",
      marginBottom: "25px"
    },
    title: {
      fontSize: "30px",
      color: "#102b5c",
      margin: 0
    },
    userBox: {
      display: "flex",
      alignItems: "center",
      gap: "18px",
      color: "#102b5c",
      fontWeight: "bold"
    },
    welcomeCard: {
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "25px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      marginBottom: "25px",
      border: "1px solid #e8edf5"
    },
    welcomeTitle: {
      color: "#102b5c",
      fontSize: "24px",
      marginBottom: "8px"
    },
    welcomeText: {
      color: "#6b7890",
      margin: 0
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "18px",
      marginBottom: "25px"
    },
    statCard: {
      backgroundColor: "#ffffff",
      padding: "22px",
      borderRadius: "14px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      border: "1px solid #e8edf5"
    },
    statIcon: {
      fontSize: "28px",
      color: "#2f80ed",
      marginBottom: "12px"
    },
    statNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#102b5c",
      margin: 0
    },
    statLabel: {
      color: "#6b7890",
      marginTop: "5px"
    },
    contentGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "20px"
    },
    panel: {
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "22px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      border: "1px solid #e8edf5"
    },
    panelTitle: {
      color: "#102b5c",
      marginTop: 0,
      marginBottom: "18px"
    },
    activityItem: {
      padding: "13px 0",
      borderBottom: "1px solid #edf1f7",
      color: "#33415c",
      fontSize: "14px"
    },
    quickGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px"
    },
    quickButton: {
      backgroundColor: "#f8fafd",
      border: "1px solid #e1e7f0",
      borderRadius: "12px",
      padding: "18px",
      textAlign: "center",
      color: "#102b5c",
      fontWeight: "bold",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logo}>
            <img
              src={logo}
              alt="MediCore"
              style={styles.logoImage}
            />

            <h2 style={styles.logoTitle}>MediCore</h2>

            <p style={styles.logoSubtitle}>
              Sistema de Expediente Clínico Electrónico
            </p>
          </div>

          {modulos
            .filter((modulo) => modulo.visible)
            .map((modulo, index) => (
              <div
                key={index}
                onClick={() => navigate(modulo.ruta)}
                style={{
                  ...styles.menuItem,
                  ...(modulo.ruta === "/dashboard" ? styles.activeItem : {})
                }}
              >
                {modulo.icono}
                <span>{modulo.nombre}</span>
              </div>
            ))}
        </div>

        <div style={styles.logout} onClick={logout}>
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </div>
      </aside>

      <main style={styles.main}>
        <nav style={styles.navbar}>
          <h1 style={styles.title}>Dashboard</h1>

          <div style={styles.userBox}>
            <NotificacionesDropdown />

            <FaUserCircle size={35} />
            <span>{usuario?.rol}</span>
          </div>
        </nav>

        <section style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>
            Bienvenido, {usuario?.nombre_completo}
          </h2>
          <p style={styles.welcomeText}>
            Rol actual: {usuario?.rol}. Desde este panel puedes administrar los
            módulos principales de MediCore.
          </p>
        </section>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><FaUserInjured /></div>
            <h3 style={styles.statNumber}>
              {resumen.pacientes}
            </h3>
            <p style={styles.statLabel}>Pacientes registrados</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}><FaFolderOpen /></div>
            <h3 style={styles.statNumber}>
              {resumen.expedientes}
            </h3>
            <p style={styles.statLabel}>Expedientes activos</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}><FaCalendarAlt /></div>
            <h3 style={styles.statNumber}>
              {resumen.citas}
            </h3>
            <p style={styles.statLabel}>Citas programadas</p>
          </div>

          {esAdmin && (
            <div style={styles.statCard}>
              <div style={styles.statIcon}><FaUsers /></div>
              <h3 style={styles.statNumber}>
                {resumen.usuarios}
              </h3>
              <p style={styles.statLabel}>Usuarios del sistema</p>
            </div>
          )}
        </section>

        <section style={styles.contentGrid}>
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Actividad reciente</h3>

            <div style={styles.activityItem}>
              Se registró un nuevo paciente en el sistema.
            </div>
            <div style={styles.activityItem}>
              Se actualizó un expediente clínico.
            </div>
            <div style={styles.activityItem}>
              Se programó una nueva cita médica.
            </div>
            <div style={styles.activityItem}>
              Se registró una consulta médica.
            </div>
          </div>

          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Acciones rápidas</h3>

            <div style={styles.quickGrid}>
              <div style={styles.quickButton} onClick={() => navigate("/pacientes/crear")}>
                Nuevo paciente
              </div>

              <div style={styles.quickButton} onClick={() => navigate("/expedientes")}>
                Ver expedientes
              </div>

              <div style={styles.quickButton} onClick={() => navigate("/citas/crear")}>
                Agendar cita
              </div>

              <div style={styles.quickButton} onClick={() => navigate("/consultas/crear")}>
                Nueva consulta
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardAdmin;