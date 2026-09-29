import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    FaCubes,
    FaChartBar,
    FaExchangeAlt,
    FaExclamationTriangle,
} from "react-icons/fa";

import logo from "../../assets/FarmaciasGaby.png";

const InventarioAdmin = () => {
    const { usuario, token, logout } = useAuth();
    const navigate = useNavigate();

    const [existencias, setExistencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarInventario = async () => {
            try {
                setCargando(true);
                setError("");

                const respuesta = await fetch(
                    "http://localhost:3003/existencias/resumen",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        data.message ||
                        "No fue posible cargar el inventario"
                    );
                }

                if (!Array.isArray(data)) {
                    throw new Error(
                        "El servicio de inventario devolvió una respuesta no válida"
                    );
                }

                setExistencias(data);
            } catch (error) {
                console.error(
                    "Error al cargar inventario:",
                    error
                );

                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        if (token) {
            cargarInventario();
        }
    }, [token]);

    const stockFisicoTotal = existencias.reduce(
        (total, existencia) =>
            total + Number(existencia.cantidad_fisica || 0),
        0
    );

    const disponibleTotal = existencias.reduce(
        (total, existencia) =>
            total + Number(existencia.cantidad_disponible || 0),
        0
    );

    const reservadoTotal = existencias.reduce(
        (total, existencia) =>
            total + Number(existencia.cantidad_reservada || 0),
        0
    );

    const totalAlertas = existencias.filter(
        (existencia) =>
            Number(existencia.cantidad_disponible || 0) <=
            Number(existencia.minimo || 0)
    ).length;

    const esAdmin =
        usuario?.roles?.includes("ADMINISTRADOR");

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

        return "Usuario";
    };

    const cerrarSesion = () => {
        logout();
        navigate("/");
    };

    const formatearFecha = (fecha) => {
        if (!fecha) {
            return "—";
        }

        const fechaObj = new Date(fecha);

        if (Number.isNaN(fechaObj.getTime())) {
            return "—";
        }

        return fechaObj.toLocaleDateString("es-GT");
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
            height: "100vh",
            position: "sticky",
            top: 0,
            background:
                "linear-gradient(180deg, #082b4f 0%, #061f3a 55%, #04182c 100%)",
            color: "#ffffff",
            padding: "25px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            flexShrink: 0,
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
        },

        main: {
            flex: 1,
            padding: "25px 35px 40px",
            boxSizing: "border-box",
            overflow: "auto",
            minWidth: 0,
        },

        navbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #dde7e3",
            paddingBottom: "18px",
            marginBottom: "25px",
        },

        title: {
            fontSize: "30px",
            color: "#082b4f",
            margin: 0,
            fontWeight: "750",
        },

        subtitle: {
            margin: "3px 0 0",
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

        cards: {
            display: "flex",
            gap: "18px",
            marginBottom: "25px",
        },

        card: {
            flex: 1,
            backgroundColor: "#ffffff",
            borderRadius: "15px",
            border: "1px solid #e2ebe7",
            boxShadow: "0 7px 20px rgba(17,48,65,0.06)",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            minHeight: "90px",
            boxSizing: "border-box",
        },

        cardIcon: {
            width: "50px",
            height: "50px",
            borderRadius: "12px",
            backgroundColor: "#eaf6ef",
            color: "#159447",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            flexShrink: 0,
        },

        cardLabel: {
            margin: 0,
            color: "#71827c",
            fontSize: "13px",
        },

        cardValue: {
            margin: "5px 0 0",
            color: "#082b4f",
            fontSize: "25px",
            fontWeight: "750",
        },

        panel: {
            backgroundColor: "#ffffff",
            borderRadius: "15px",
            border: "1px solid #e2ebe7",
            boxShadow: "0 7px 20px rgba(17,48,65,0.06)",
            overflow: "hidden",
        },

        panelHeader: {
            padding: "20px 22px",
            borderBottom: "1px solid #edf2f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },

        panelTitleBox: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
        },

        panelIcon: {
            color: "#159447",
            fontSize: "20px",
        },

        panelTitle: {
            margin: 0,
            color: "#082b4f",
            fontSize: "18px",
        },

        panelSubtitle: {
            margin: "4px 0 0",
            color: "#81918c",
            fontSize: "12px",
        },

        tableContainer: {
            width: "100%",
            overflowX: "auto",
        },

        table: {
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "1050px",
        },

        th: {
            textAlign: "left",
            padding: "14px 15px",
            backgroundColor: "#f8fbfa",
            color: "#50645e",
            fontSize: "12px",
            whiteSpace: "nowrap",
            borderBottom: "1px solid #e6efeb",
        },

        td: {
            padding: "14px 15px",
            borderBottom: "1px solid #edf2f0",
            color: "#40534d",
            fontSize: "13px",
            verticalAlign: "middle",
        },

        primaryCell: {
            padding: "14px 15px",
            borderBottom: "1px solid #edf2f0",
            color: "#082b4f",
            fontSize: "13px",
            fontWeight: "700",
            verticalAlign: "middle",
        },

        empty: {
            padding: "65px 20px",
            textAlign: "center",
            color: "#81918c",
        },

        emptyIcon: {
            fontSize: "38px",
            color: "#b8c8c2",
            marginBottom: "12px",
        },

        errorText: {
            color: "#a73737",
        },

        badgeNormal: {
            display: "inline-block",
            padding: "5px 9px",
            borderRadius: "20px",
            backgroundColor: "#eaf6ef",
            color: "#159447",
            fontSize: "11px",
            fontWeight: "700",
            whiteSpace: "nowrap",
        },

        badgeAlerta: {
            display: "inline-block",
            padding: "5px 9px",
            borderRadius: "20px",
            backgroundColor: "#fff3e8",
            color: "#b45f06",
            fontSize: "11px",
            fontWeight: "700",
            whiteSpace: "nowrap",
        },
    };

    return (
        <div style={styles.layout}>
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
                        .map((modulo) => (
                            <div
                                key={modulo.ruta}
                                onClick={() =>
                                    navigate(modulo.ruta)
                                }
                                style={{
                                    ...styles.menuItem,
                                    ...(modulo.ruta ===
                                        "/admin/inventario"
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

            <main style={styles.main}>
                <nav style={styles.navbar}>
                    <div>
                        <h1 style={styles.title}>
                            Gestión de Inventario
                        </h1>

                        <p style={styles.subtitle}>
                            Control de existencias y disponibilidad de productos
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

                <section style={styles.cards}>
                    <div style={styles.card}>
                        <div style={styles.cardIcon}>
                            <FaCubes />
                        </div>

                        <div>
                            <p style={styles.cardLabel}>
                                Stock físico
                            </p>

                            <p style={styles.cardValue}>
                                {cargando ? "—" : stockFisicoTotal}
                            </p>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardIcon}>
                            <FaWarehouse />
                        </div>

                        <div>
                            <p style={styles.cardLabel}>
                                Disponible
                            </p>

                            <p style={styles.cardValue}>
                                {cargando ? "—" : disponibleTotal}
                            </p>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardIcon}>
                            <FaExchangeAlt />
                        </div>

                        <div>
                            <p style={styles.cardLabel}>
                                Reservado
                            </p>

                            <p style={styles.cardValue}>
                                {cargando ? "—" : reservadoTotal}
                            </p>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardIcon}>
                            <FaExclamationTriangle />
                        </div>

                        <div>
                            <p style={styles.cardLabel}>
                                Alertas
                            </p>

                            <p style={styles.cardValue}>
                                {cargando ? "—" : totalAlertas}
                            </p>
                        </div>
                    </div>
                </section>

                <section style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <div style={styles.panelTitleBox}>
                            <FaChartBar style={styles.panelIcon} />

                            <div>
                                <h2 style={styles.panelTitle}>
                                    Inventario general
                                </h2>

                                <p style={styles.panelSubtitle}>
                                    Existencias registradas por presentación,
                                    sucursal, ubicación y lote
                                </p>
                            </div>
                        </div>
                    </div>

                    {cargando && (
                        <div style={styles.empty}>
                            <FaWarehouse
                                style={styles.emptyIcon}
                            />

                            <div>
                                <strong>
                                    Cargando inventario...
                                </strong>
                            </div>
                        </div>
                    )}

                    {!cargando && error && (
                        <div style={styles.empty}>
                            <FaExclamationTriangle
                                style={styles.emptyIcon}
                            />

                            <strong style={styles.errorText}>
                                {error}
                            </strong>
                        </div>
                    )}

                    {!cargando &&
                        !error &&
                        existencias.length === 0 && (
                            <div style={styles.empty}>
                                <FaWarehouse
                                    style={styles.emptyIcon}
                                />

                                <div>
                                    <strong>
                                        No hay existencias registradas
                                    </strong>
                                </div>
                            </div>
                        )}

                    {!cargando &&
                        !error &&
                        existencias.length > 0 && (
                            <div style={styles.tableContainer}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>
                                                Presentación
                                            </th>

                                            <th style={styles.th}>
                                                Sucursal
                                            </th>

                                            <th style={styles.th}>
                                                Ubicación
                                            </th>

                                            <th style={styles.th}>
                                                Lote
                                            </th>

                                            <th style={styles.th}>
                                                Vencimiento
                                            </th>

                                            <th style={styles.th}>
                                                Stock físico
                                            </th>

                                            <th style={styles.th}>
                                                Reservado
                                            </th>

                                            <th style={styles.th}>
                                                Disponible
                                            </th>

                                            <th style={styles.th}>
                                                Mínimo
                                            </th>

                                            <th style={styles.th}>
                                                Máximo
                                            </th>

                                            <th style={styles.th}>
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {existencias.map(
                                            (existencia) => {
                                                const enAlerta =
                                                    Number(
                                                        existencia.cantidad_disponible ||
                                                        0
                                                    ) <=
                                                    Number(
                                                        existencia.minimo ||
                                                        0
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            existencia.id_existencia
                                                        }
                                                    >
                                                        <td
                                                            style={
                                                                styles.primaryCell
                                                            }
                                                        >
                                                            {existencia.id_presentacion ??
                                                                "—"}
                                                        </td>

                                                        <td style={styles.td}>
                                                            {existencia
                                                                .sucursal
                                                                ?.nombre ||
                                                                "—"}
                                                        </td>

                                                        <td style={styles.td}>
                                                            {existencia
                                                                .ubicacion
                                                                ?.nombre ||
                                                                "—"}
                                                        </td>

                                                        <td style={styles.td}>
                                                            {existencia
                                                                .lote
                                                                ?.numero ||
                                                                "—"}
                                                        </td>

                                                        <td style={styles.td}>
                                                            {formatearFecha(
                                                                existencia
                                                                    .lote
                                                                    ?.fecha_vencimiento
                                                            )}
                                                        </td>

                                                        <td style={styles.td}>
                                                            {existencia.cantidad_fisica ??
                                                                0}
                                                        </td>

                                                        <td style={styles.td}>
                                                            {existencia.cantidad_reservada ??
                                                                0}
                                                        </td>

                                                        <td style={styles.td}>
                                                            {existencia.cantidad_disponible ??
                                                                0}
                                                        </td>

                                                        <td style={styles.td}>
                                                            {existencia.minimo ??
                                                                0}
                                                        </td>

                                                        <td style={styles.td}>
                                                            {existencia.maximo ??
                                                                0}
                                                        </td>

                                                        <td style={styles.td}>
                                                            <span
                                                                style={
                                                                    enAlerta
                                                                        ? styles.badgeAlerta
                                                                        : styles.badgeNormal
                                                                }
                                                            >
                                                                {enAlerta
                                                                    ? "Stock bajo"
                                                                    : "Normal"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </section>
            </main>
        </div>
    );
};

export default InventarioAdmin;