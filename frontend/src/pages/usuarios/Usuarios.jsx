import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    FaSearch,
    FaEdit,
    FaEye,
    FaTrash,
    FaPlus,
    FaRedo
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosConfig";
import logo from "../../assets/logos/medicore-Copy.png";

const Usuarios = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const esAdmin = usuario?.rol === "ADMIN";

    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("TODOS");
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const response = await axiosClient.get("/usuarios");
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setMensaje("Error al cargar usuarios");
        }
    };

    const confirmarCambioEstado = (usuarioItem) => {
        setUsuarioSeleccionado(usuarioItem);
        setMostrarModal(true);
    };

    const cambiarEstadoUsuario = async () => {
        try {
            if (usuarioSeleccionado.estado === "ACTIVO") {
                await axiosClient.patch(`/usuarios/${usuarioSeleccionado.id_usuario}/desactivar`);
                setMensaje("Usuario desactivado correctamente");
            } else {
                await axiosClient.patch(`/usuarios/${usuarioSeleccionado.id_usuario}/reactivar`);
                setMensaje("Usuario reactivado correctamente");
            }

            setMostrarModal(false);
            obtenerUsuarios();

            setTimeout(() => {
                setMensaje("");
            }, 3000);

        } catch (error) {
            console.error("Error al cambiar estado:", error);
            setMensaje("Error al cambiar estado del usuario");
        }
    };

    const usuariosFiltrados = usuarios.filter((usuarioItem) => {
        const nombre = usuarioItem.nombre_completo || "";
        const correo = usuarioItem.correo || "";
        const rol = usuarioItem.rol?.nombre || "";
        const estado = usuarioItem.estado || "";

        const coincideBusqueda =
            nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            correo.toLowerCase().includes(busqueda.toLowerCase()) ||
            rol.toLowerCase().includes(busqueda.toLowerCase());

        const coincideEstado =
            estadoFiltro === "TODOS" || estado === estadoFiltro;

        return coincideBusqueda && coincideEstado;
    });

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
        modalOverlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
        },
        modal: {
            width: "420px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        },
        modalTitle: {
            fontSize: "24px",
            color: "#102b5c",
            marginBottom: "15px"
        },
        modalText: {
            color: "#5d6b82",
            fontSize: "15px",
            lineHeight: "1.5"
        },
        modalActions: {
            marginTop: "25px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px"
        },
        cancelButton: {
            backgroundColor: "#eef2f7",
            color: "#102b5c",
            border: "none",
            borderRadius: "10px",
            padding: "12px 18px",
            cursor: "pointer",
            fontWeight: "bold"
        },
        confirmButton: {
            backgroundColor: "#eb5757",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 18px",
            cursor: "pointer",
            fontWeight: "bold"
        },
        popup: {
            position: "fixed",
            top: "25px",
            right: "25px",
            backgroundColor: "#ffffff",
            color: "#102b5c",
            border: "1px solid #dbe3ee",
            borderLeft: "5px solid #27ae60",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            fontWeight: "bold",
            zIndex: 9999
        },
        layout: {
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#f5f7fb",
            fontFamily: "'Segoe UI', sans-serif"
        },
        sidebar: {
            width: "250px",
            height: "100vh",
            background: "linear-gradient(180deg, #062b5f 0%, #031b3d 100%)",
            color: "#fff",
            padding: "25px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexShrink: 0
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
            padding: "25px 35px",
            height: "100vh",
            overflowY: "auto"
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
        subtitle: {
            color: "#6b7890",
            marginTop: "6px",
            fontSize: "14px"
        },
        topActions: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            gap: "20px",
            flexWrap: "wrap"
        },
        filters: {
            display: "flex",
            gap: "14px",
            alignItems: "center",
            flexWrap: "wrap"
        },
        searchBox: {
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            border: "1px solid #dbe3ee",
            borderRadius: "10px",
            padding: "0 14px",
            height: "48px",
            width: "390px"
        },
        searchInput: {
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: "14px",
            marginLeft: "10px"
        },
        select: {
            height: "48px",
            border: "1px solid #dbe3ee",
            borderRadius: "10px",
            padding: "0 14px",
            color: "#102b5c",
            fontSize: "14px",
            outline: "none",
            backgroundColor: "#ffffff"
        },
        addButton: {
            backgroundColor: "#0b2c5f",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "14px 20px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer"
        },
        tableContainer: {
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            padding: "22px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e8edf5",
            overflowX: "auto",
            marginBottom: "30px"
        },
        table: {
            width: "100%",
            borderCollapse: "collapse"
        },
        th: {
            textAlign: "left",
            padding: "15px",
            backgroundColor: "#f7f9fc",
            color: "#102b5c",
            fontSize: "14px",
            borderBottom: "1px solid #e1e7f0"
        },
        td: {
            padding: "15px",
            borderBottom: "1px solid #edf1f7",
            fontSize: "14px",
            color: "#33415c"
        },
        estadoActivo: {
            backgroundColor: "#dff6e4",
            color: "#1f7a3f",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        estadoInactivo: {
            backgroundColor: "#fde2e2",
            color: "#b42318",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        rolAdmin: {
            backgroundColor: "#fde2e2",
            color: "#b42318",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },

        rolMedico: {
            backgroundColor: "#dbeafe",
            color: "#1e40af",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },

        rolPaciente: {
            backgroundColor: "#dff6e4",
            color: "#1f7a3f",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        acciones: {
            display: "flex",
            gap: "10px"
        },
        actionButton: {
            border: "none",
            borderRadius: "8px",
            width: "35px",
            height: "35px",
            cursor: "pointer",
            color: "#ffffff"
        },
        emptyRow: {
            padding: "25px",
            textAlign: "center",
            color: "#6b7890",
            fontSize: "15px"
        },
        smallText: {
            fontSize: "12px",
            color: "#6b7890",
            marginTop: "5px"
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
                                    ...(modulo.ruta === "/usuarios"
                                        ? styles.activeItem
                                        : {})
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

            {mensaje && (
                <div style={styles.popup}>
                    {mensaje}
                </div>
            )}

            {mostrarModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>
                            {usuarioSeleccionado?.estado === "ACTIVO"
                                ? "Desactivar usuario"
                                : "Reactivar usuario"}
                        </h2>

                        <p style={styles.modalText}>
                            {usuarioSeleccionado?.estado === "ACTIVO"
                                ? "¿Desea desactivar este usuario? El usuario no podrá acceder al sistema mientras esté inactivo."
                                : "¿Desea reactivar este usuario para permitir nuevamente el acceso al sistema?"}
                        </p>

                        <div style={styles.modalActions}>
                            <button
                                style={styles.cancelButton}
                                onClick={() => setMostrarModal(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                style={styles.confirmButton}
                                onClick={cambiarEstadoUsuario}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main style={styles.main}>
                <nav style={styles.navbar}>
                    <div>
                        <h1 style={styles.title}>Usuarios</h1>
                        <p style={styles.subtitle}>
                            Gestión de accesos, roles y estado de usuarios del sistema.
                        </p>
                    </div>
                </nav>

                <section style={styles.topActions}>
                    <div style={styles.filters}>
                        <div style={styles.searchBox}>
                            <FaSearch color="#6b7890" />

                            <input
                                type="text"
                                placeholder="Buscar usuario, correo o rol..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>

                        <select
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                            style={styles.select}
                        >
                            <option value="TODOS">Todos los estados</option>
                            <option value="ACTIVO">Activos</option>
                            <option value="INACTIVO">Inactivos</option>
                        </select>
                    </div>

                    <button
                        style={styles.addButton}
                        onClick={() => navigate("/usuarios/crear")}
                    >
                        <FaPlus />
                        Nuevo Usuario
                    </button>
                </section>

                <section style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Nombre</th>
                                <th style={styles.th}>Correo</th>
                                <th style={styles.th}>Rol</th>
                                <th style={styles.th}>Estado</th>
                                <th style={styles.th}>Último acceso</th>
                                <th style={styles.th}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {usuariosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={styles.emptyRow}>
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            ) : (
                                usuariosFiltrados.map((usuarioItem) => (
                                    <tr key={usuarioItem.id_usuario}>
                                        <td style={styles.td}>
                                            {usuarioItem.nombre_completo}
                                        </td>

                                        <td style={styles.td}>
                                            {usuarioItem.correo}
                                        </td>

                                        <td style={styles.td}>
                                            <span
                                                style={
                                                    usuarioItem.rol?.nombre === "ADMIN"
                                                        ? styles.rolAdmin
                                                        : usuarioItem.rol?.nombre === "MEDICO"
                                                            ? styles.rolMedico
                                                            : styles.rolPaciente
                                                }
                                            >
                                                {usuarioItem.rol?.nombre || "Sin rol"}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            <span
                                                style={
                                                    usuarioItem.estado === "ACTIVO"
                                                        ? styles.estadoActivo
                                                        : styles.estadoInactivo
                                                }
                                            >
                                                {usuarioItem.estado}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            {usuarioItem.ultimo_acceso
                                                ? new Date(usuarioItem.ultimo_acceso).toLocaleString("es-GT")
                                                : "Sin acceso registrado"}
                                        </td>

                                        <td style={styles.td}>
                                            <div style={styles.acciones}>
                                                <button
                                                    style={{
                                                        ...styles.actionButton,
                                                        backgroundColor: "#2f80ed"
                                                    }}
                                                    onClick={() =>
                                                        navigate(`/usuarios/editar/${usuarioItem.id_usuario}`)
                                                    }
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    style={{
                                                        ...styles.actionButton,
                                                        backgroundColor: "#27ae60"
                                                    }}
                                                    onClick={() =>
                                                        navigate(`/usuarios/ver/${usuarioItem.id_usuario}`)
                                                    }
                                                >
                                                    <FaEye />
                                                </button>

                                                {usuarioItem.estado === "ACTIVO" && (
                                                    <button
                                                        style={{
                                                            ...styles.actionButton,
                                                            backgroundColor: "#eb5757"
                                                        }}
                                                        onClick={() => confirmarCambioEstado(usuarioItem)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}

                                                {usuarioItem.estado === "INACTIVO" && (
                                                    <button
                                                        style={{
                                                            ...styles.actionButton,
                                                            backgroundColor: "#f4bd4f",
                                                            color: "#08234d"
                                                        }}
                                                        onClick={() => confirmarCambioEstado(usuarioItem)}
                                                    >
                                                        <FaRedo />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default Usuarios;