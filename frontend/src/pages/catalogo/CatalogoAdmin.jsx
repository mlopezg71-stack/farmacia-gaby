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
    FaPills,
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
} from "react-icons/fa";

import logo from "../../assets/FarmaciasGaby.png";

const CatalogoAdmin = () => {
    const { usuario, token, logout } = useAuth();
    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setCargando(true);
                setError("");

                const respuesta = await fetch(
                    "http://localhost:3002/productos/admin",
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
                        "No fue posible cargar los productos"
                    );
                }

                setProductos(data);
            } catch (error) {
                console.error(
                    "Error al cargar catálogo:",
                    error
                );

                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        if (token) {
            cargarProductos();
        }
    }, [token]);

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

        toolbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
        },

        searchBox: {
            flex: 1,
            maxWidth: "520px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#ffffff",
            border: "1px solid #dfeae6",
            borderRadius: "10px",
            padding: "0 14px",
        },

        searchInput: {
            flex: 1,
            border: "none",
            outline: "none",
            padding: "13px 0",
            fontSize: "14px",
        },

        addButton: {
            border: "none",
            backgroundColor: "#159447",
            color: "#ffffff",
            padding: "13px 18px",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
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
        },

        panelTitle: {
            margin: 0,
            color: "#082b4f",
            fontSize: "18px",
        },

        table: {
            width: "100%",
            borderCollapse: "collapse",
        },

        th: {
            textAlign: "left",
            padding: "14px 18px",
            backgroundColor: "#f8fbfa",
            color: "#50645e",
            fontSize: "12px",
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
                                        "/admin/catalogo"
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
                            Gestión de Catálogo
                        </h1>

                        <p style={styles.subtitle}>
                            Administración de productos de Farmacia Gaby
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

                <section style={styles.toolbar}>
                    <div style={styles.searchBox}>
                        <FaSearch color="#81918c" />

                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            style={styles.searchInput}
                        />
                    </div>

                    <button
                        type="button"
                        style={styles.addButton}
                        onClick={() => navigate("/admin/catalogo/nuevo")}
                    >
                        <FaPlus />
                        Nuevo producto
                    </button>
                </section>

                <section style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <h2 style={styles.panelTitle}>
                            Productos registrados
                        </h2>
                    </div>

                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Producto</th>
                                <th style={styles.th}>Marca</th>
                                <th style={styles.th}>Tipo</th>
                                <th style={styles.th}>Receta</th>
                                <th style={styles.th}>Estado</th>
                                <th style={styles.th}>Visible web</th>
                                <th style={styles.th}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.id_producto}>
                                    <td
                                        style={{
                                            padding: "15px 18px",
                                            borderBottom: "1px solid #edf2f0",
                                            fontWeight: "600",
                                            color: "#082b4f",
                                        }}
                                    >
                                        {producto.nombre}
                                    </td>

                                    <td
                                        style={{
                                            padding: "15px 18px",
                                            borderBottom: "1px solid #edf2f0",
                                        }}
                                    >
                                        {producto.ref_id_marca?.nombre || "—"}
                                    </td>

                                    <td
                                        style={{
                                            padding: "15px 18px",
                                            borderBottom: "1px solid #edf2f0",
                                        }}
                                    >
                                        {producto.tipo}
                                    </td>

                                    <td
                                        style={{
                                            padding: "15px 18px",
                                            borderBottom: "1px solid #edf2f0",
                                        }}
                                    >
                                        {producto.requiere_receta ? "Sí" : "No"}
                                    </td>

                                    <td
                                        style={{
                                            padding: "15px 18px",
                                            borderBottom: "1px solid #edf2f0",
                                        }}
                                    >
                                        {producto.estado}
                                    </td>

                                    <td
                                        style={{
                                            padding: "15px 18px",
                                            borderBottom: "1px solid #edf2f0",
                                        }}
                                    >
                                        {producto.visible_web ? "Sí" : "No"}
                                    </td>

                                    <td
                                        style={{
                                            padding: "15px 18px",
                                            borderBottom: "1px solid #edf2f0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "8px",
                                            }}
                                        >
                                            <button
                                                type="button"
                                                title="Visualizar"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/catalogo/ver/${producto.id_producto}`
                                                    )
                                                }
                                                style={{
                                                    border: "1px solid #dfeae6",
                                                    backgroundColor: "#ffffff",
                                                    color: "#082b4f",
                                                    width: "35px",
                                                    height: "35px",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <FaEye />
                                            </button>

                                            <button
                                                type="button"
                                                title="Modificar"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/catalogo/modificar/${producto.id_producto}`
                                                    )
                                                }
                                                style={{
                                                    border: "none",
                                                    backgroundColor: "#159447",
                                                    color: "#ffffff",
                                                    width: "35px",
                                                    height: "35px",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <FaEdit />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {cargando && (
                        <div style={styles.empty}>
                            <FaPills style={styles.emptyIcon} />
                            <div>
                                <strong>Cargando catálogo...</strong>
                            </div>
                        </div>
                    )}

                    {!cargando && error && (
                        <div style={styles.empty}>
                            <strong>{error}</strong>
                        </div>
                    )}

                    {!cargando &&
                        !error &&
                        productos.length === 0 && (
                            <div style={styles.empty}>
                                <FaPills style={styles.emptyIcon} />

                                <div>
                                    <strong>
                                        No hay productos registrados
                                    </strong>
                                </div>

                                <div
                                    style={{
                                        fontSize: "13px",
                                        marginTop: "6px",
                                    }}
                                >
                                    Utiliza "Nuevo producto" para registrar el primero.
                                </div>
                            </div>
                        )}
                </section>
            </main>
        </div>
    );
};

export default CatalogoAdmin;