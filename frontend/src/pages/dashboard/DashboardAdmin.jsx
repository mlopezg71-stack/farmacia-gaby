import { useAuth } from "../../context/AuthContext";

import {
  FaHome,
  FaBoxes,
  FaWarehouse,
  FaShoppingCart,
  FaCreditCard,
  FaStore,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
  FaUserCircle,
  FaPills,
  FaBoxOpen,
  FaReceipt,
  FaArrowRight,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import logo from "../../assets/FarmaciasGaby.png";

const DashboardAdmin = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const esAdmin = usuario?.roles?.includes("ADMINISTRADOR");

  /*
   * Los contadores se conectarán posteriormente
   * con los microservicios reales.
   *
   * Catálogo   -> :3002
   * Inventario -> :3003
   * Pedidos    -> :3004
   * Auth       -> :3001
   */
  const resumen = {
    productos: 0,
    existencias: 0,
    pedidos: 0,
    usuarios: 0,
  };

  const modulos = [
    {
      nombre: "Inicio",
      icono: <FaHome />,
      ruta: "/dashboard",
      visible: true,
    },
    {
      nombre: "Catálogo",
      icono: <FaBoxes />,
      ruta: "/admin/catalogo",
      visible: true,
    },
    {
      nombre: "Inventario",
      icono: <FaWarehouse />,
      ruta: "/admin/inventario",
      visible: true,
    },
    {
      nombre: "Pedidos",
      icono: <FaShoppingCart />,
      ruta: "/admin/pedidos",
      visible: true,
    },
    {
      nombre: "Pagos",
      icono: <FaCreditCard />,
      ruta: "/admin/pagos",
      visible: true,
    },
    {
      nombre: "Sucursales",
      icono: <FaStore />,
      ruta: "/admin/sucursales",
      visible: true,
    },
    {
      nombre: "Usuarios",
      icono: <FaUsers />,
      ruta: "/usuarios",
      visible: esAdmin,
    },
    {
      nombre: "Bitácora",
      icono: <FaClipboardList />,
      ruta: "/bitacora",
      visible: esAdmin,
    },
  ];

  const obtenerNombreRol = () => {
    if (usuario?.roles?.includes("ADMINISTRADOR")) {
      return "Administrador";
    }

    if (usuario?.roles?.includes("CAJERO")) {
      return "Cajero";
    }

    if (usuario?.roles?.includes("INVENTARIO")) {
      return "Inventario";
    }

    if (usuario?.roles?.includes("DESPACHO")) {
      return "Despacho";
    }

    if (usuario?.roles?.includes("CLIENTE")) {
      return "Cliente";
    }

    return "Usuario";
  };

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  const styles = {
    layout: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f4f7f6",
      fontFamily: "'Segoe UI', sans-serif",
    },

    sidebar: {
      width: "250px",
      background:
        "linear-gradient(180deg, #082b4f 0%, #061f3a 55%, #04182c 100%)",
      color: "#ffffff",
      padding: "25px 18px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
    },

    logo: {
      textAlign: "center",
      marginBottom: "32px",
    },

    logoImageContainer: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      padding: "10px 14px",
      borderRadius: "14px",
      marginBottom: "14px",
      boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
    },

    logoImage: {
      width: "115px",
      display: "block",
    },

    logoTitle: {
      fontSize: "24px",
      fontWeight: "700",
      margin: 0,
    },

    logoTitleAccent: {
      color: "#159447",
    },

    logoSubtitle: {
      fontSize: "12px",
      opacity: 0.75,
      marginTop: "7px",
      lineHeight: "1.4",
    },

    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "13px 14px",
      borderRadius: "9px",
      marginBottom: "7px",
      cursor: "pointer",
      fontSize: "15px",
      color: "#eef5f3",
      transition: "0.2s ease",
    },

    activeItem: {
      backgroundColor: "#ffffff",
      color: "#082b4f",
      fontWeight: "700",
      boxShadow: "0 5px 14px rgba(0,0,0,0.13)",
    },

    logout: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "14px",
      borderTop: "1px solid rgba(255,255,255,0.16)",
      cursor: "pointer",
      fontSize: "14px",
      color: "#ffffff",
    },

    main: {
      flex: 1,
      padding: "25px 35px 40px",
      boxSizing: "border-box",
      overflow: "auto",
    },

    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #dde7e3",
      paddingBottom: "18px",
      marginBottom: "25px",
    },

    titleGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "3px",
    },

    title: {
      fontSize: "30px",
      color: "#082b4f",
      margin: 0,
      fontWeight: "750",
    },

    titleSubtitle: {
      margin: 0,
      color: "#7a8984",
      fontSize: "13px",
    },

    userBox: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#082b4f",
    },

    userInfo: {
      textAlign: "right",
    },

    userName: {
      display: "block",
      fontSize: "14px",
      fontWeight: "700",
    },

    userRole: {
      display: "block",
      color: "#159447",
      fontSize: "12px",
      fontWeight: "600",
      marginTop: "2px",
    },

    userIcon: {
      fontSize: "38px",
      color: "#082b4f",
    },

    welcomeCard: {
      background:
        "linear-gradient(110deg, #082b4f 0%, #0b3c61 65%, #0b6841 130%)",
      borderRadius: "16px",
      padding: "28px 30px",
      boxShadow: "0 10px 24px rgba(8,43,79,0.14)",
      marginBottom: "25px",
      color: "#ffffff",
      position: "relative",
      overflow: "hidden",
    },

    welcomeDecoration: {
      position: "absolute",
      right: "-25px",
      top: "-55px",
      width: "190px",
      height: "190px",
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.06)",
    },

    welcomeTitle: {
      fontSize: "25px",
      margin: "0 0 8px",
      position: "relative",
    },

    welcomeText: {
      margin: 0,
      color: "#dce9e5",
      fontSize: "14px",
      position: "relative",
    },

    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
      gap: "18px",
      marginBottom: "25px",
    },

    statCard: {
      backgroundColor: "#ffffff",
      padding: "22px",
      borderRadius: "15px",
      boxShadow: "0 7px 20px rgba(17,48,65,0.06)",
      border: "1px solid #e2ebe7",
      position: "relative",
      overflow: "hidden",
    },

    statTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "14px",
    },

    statIconBox: {
      width: "46px",
      height: "46px",
      borderRadius: "12px",
      backgroundColor: "#eaf6ef",
      color: "#118847",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "21px",
    },

    statNumber: {
      fontSize: "31px",
      fontWeight: "750",
      color: "#082b4f",
      margin: 0,
    },

    statLabel: {
      color: "#6d7d78",
      margin: "5px 0 0",
      fontSize: "14px",
    },

    statLine: {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      height: "4px",
      backgroundColor: "#159447",
    },

    contentGrid: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 2fr) minmax(300px, 1fr)",
      gap: "20px",
    },

    panel: {
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      padding: "22px",
      boxShadow: "0 7px 20px rgba(17,48,65,0.06)",
      border: "1px solid #e2ebe7",
    },

    panelHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px",
    },

    panelTitle: {
      color: "#082b4f",
      margin: 0,
      fontSize: "18px",
    },

    panelBadge: {
      backgroundColor: "#eaf6ef",
      color: "#118847",
      borderRadius: "20px",
      padding: "5px 10px",
      fontSize: "11px",
      fontWeight: "700",
    },

    activityItem: {
      display: "flex",
      alignItems: "center",
      gap: "13px",
      padding: "14px 0",
      borderBottom: "1px solid #edf2f0",
      color: "#334c46",
      fontSize: "14px",
    },

    activityIcon: {
      width: "36px",
      height: "36px",
      flexShrink: 0,
      borderRadius: "10px",
      backgroundColor: "#f0f6f4",
      color: "#118847",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    activityText: {
      margin: 0,
    },

    activityMuted: {
      color: "#8b9995",
      fontSize: "12px",
      marginTop: "3px",
    },

    emptyActivity: {
      minHeight: "180px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      color: "#81918c",
    },

    emptyIcon: {
      fontSize: "34px",
      color: "#b8c8c2",
      marginBottom: "10px",
    },

    quickGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px",
    },

    quickButton: {
      backgroundColor: "#f8fbfa",
      border: "1px solid #dfeae6",
      borderRadius: "12px",
      padding: "17px 12px",
      color: "#082b4f",
      fontWeight: "700",
      cursor: "pointer",
      minHeight: "92px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      textAlign: "center",
      fontSize: "13px",
    },

    quickIcon: {
      color: "#159447",
      fontSize: "21px",
    },

    quickArrow: {
      fontSize: "10px",
      opacity: 0.6,
    },
  };

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logo}>
            <div style={styles.logoImageContainer}>
              <img
                src={logo}
                alt="Farmacia Gaby"
                style={styles.logoImage}
              />
            </div>

            <h2 style={styles.logoTitle}>
              Farmacia{" "}
              <span style={styles.logoTitleAccent}>
                Gaby
              </span>
            </h2>

            <p style={styles.logoSubtitle}>
              Panel Administrativo
              <br />
              Gestión integral de farmacia
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
                  ...(modulo.ruta === "/dashboard"
                    ? styles.activeItem
                    : {}),
                }}
              >
                {modulo.icono}
                <span>{modulo.nombre}</span>
              </div>
            ))}
        </div>

        <div
          style={styles.logout}
          onClick={cerrarSesion}
        >
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main style={styles.main}>
        {/* NAVBAR */}
        <nav style={styles.navbar}>
          <div style={styles.titleGroup}>
            <h1 style={styles.title}>
              Dashboard
            </h1>

            <p style={styles.titleSubtitle}>
              Panel general de Farmacia Gaby
            </p>
          </div>

          <div style={styles.userBox}>
            <div style={styles.userInfo}>
              <span style={styles.userName}>
                {usuario?.nombre_completo}
              </span>

              <span style={styles.userRole}>
                {obtenerNombreRol()}
              </span>
            </div>

            <FaUserCircle style={styles.userIcon} />
          </div>
        </nav>

        {/* BIENVENIDA */}
        <section style={styles.welcomeCard}>
          <div style={styles.welcomeDecoration} />

          <h2 style={styles.welcomeTitle}>
            Bienvenido, {usuario?.nombre_completo}
          </h2>

          <p style={styles.welcomeText}>
            Rol actual: {obtenerNombreRol()}. Desde este panel
            puedes administrar los módulos principales de
            Farmacia Gaby.
          </p>
        </section>

        {/* CONTADORES */}
        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.statIconBox}>
                <FaPills />
              </div>
            </div>

            <h3 style={styles.statNumber}>
              {resumen.productos}
            </h3>

            <p style={styles.statLabel}>
              Productos registrados
            </p>

            <div style={styles.statLine} />
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.statIconBox}>
                <FaBoxOpen />
              </div>
            </div>

            <h3 style={styles.statNumber}>
              {resumen.existencias}
            </h3>

            <p style={styles.statLabel}>
              Unidades disponibles
            </p>

            <div style={styles.statLine} />
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.statIconBox}>
                <FaShoppingCart />
              </div>
            </div>

            <h3 style={styles.statNumber}>
              {resumen.pedidos}
            </h3>

            <p style={styles.statLabel}>
              Pedidos registrados
            </p>

            <div style={styles.statLine} />
          </div>

          {esAdmin && (
            <div style={styles.statCard}>
              <div style={styles.statTop}>
                <div style={styles.statIconBox}>
                  <FaUsers />
                </div>
              </div>

              <h3 style={styles.statNumber}>
                {resumen.usuarios}
              </h3>

              <p style={styles.statLabel}>
                Usuarios del sistema
              </p>

              <div style={styles.statLine} />
            </div>
          )}
        </section>

        {/* PARTE INFERIOR */}
        <section style={styles.contentGrid}>
          {/* ACTIVIDAD */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>
                Actividad reciente
              </h3>

              <span style={styles.panelBadge}>
                Sistema
              </span>
            </div>

            {/*
              Aquí conectaremos posteriormente la actividad
              real de pedidos, inventario y catálogo.
            */}

            <div style={styles.emptyActivity}>
              <FaClipboardList
                style={styles.emptyIcon}
              />

              <strong>
                Sin actividad reciente
              </strong>

              <span
                style={{
                  fontSize: "13px",
                  marginTop: "5px",
                }}
              >
                Los movimientos recientes de Farmacia Gaby
                aparecerán aquí.
              </span>
            </div>
          </div>

          {/* ACCIONES RÁPIDAS */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>
                Acciones rápidas
              </h3>
            </div>

            <div style={styles.quickGrid}>
              <div
                style={styles.quickButton}
                onClick={() =>
                  navigate("/admin/catalogo")
                }
              >
                <FaPills style={styles.quickIcon} />

                <span>Gestionar catálogo</span>

                <FaArrowRight
                  style={styles.quickArrow}
                />
              </div>

              <div
                style={styles.quickButton}
                onClick={() =>
                  navigate("/admin/inventario")
                }
              >
                <FaWarehouse
                  style={styles.quickIcon}
                />

                <span>Ver inventario</span>

                <FaArrowRight
                  style={styles.quickArrow}
                />
              </div>

              <div
                style={styles.quickButton}
                onClick={() =>
                  navigate("/admin/pedidos")
                }
              >
                <FaReceipt
                  style={styles.quickIcon}
                />

                <span>Ver pedidos</span>

                <FaArrowRight
                  style={styles.quickArrow}
                />
              </div>

              <div
                style={styles.quickButton}
                onClick={() =>
                  navigate("/usuarios")
                }
              >
                <FaUsers style={styles.quickIcon} />

                <span>Gestionar usuarios</span>

                <FaArrowRight
                  style={styles.quickArrow}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardAdmin;