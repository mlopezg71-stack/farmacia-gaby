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
    FaEye
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosConfig";
import logo from "../../assets/logos/medicore-Copy.png";


const Bitacora = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const esAdmin = usuario?.rol === "ADMIN";

    const [registros, setRegistros] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [moduloFiltro, setModuloFiltro] = useState("TODOS");
    const [eventoFiltro, setEventoFiltro] = useState("TODOS");
    const [resultadoFiltro, setResultadoFiltro] = useState("TODOS");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerBitacora();
    }, []);

    const obtenerBitacora = async () => {
        try {
            const response = await axiosClient.get("/bitacora");
            setRegistros(response.data);
        } catch (error) {
            console.error("Error al obtener bitácora:", error);
            setMensaje("Error al cargar la bitácora del sistema");
        }
    };

    const normalizarTexto = (texto) => {

        if (!texto) return "N/A";

        return texto
            .toLowerCase()
            .replaceAll("_", " ")
            .replace(/\b\w/g, (letra) => letra.toUpperCase());

    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "N/A";

        return new Date(fecha).toLocaleString("es-GT", {
            dateStyle: "short",
            timeStyle: "short"
        });
    };

    const obtenerEstiloResultado = (resultado) => {
        if (resultado === "EXITOSO") return styles.resultadoExitoso;
        if (resultado === "ERROR" || resultado === "FALLIDO") return styles.resultadoError;

        return styles.resultadoNeutral;
    };

    const obtenerEstiloEvento = (evento) => {
        if (evento === "AUTENTICACION" || evento === "LOGIN") return styles.eventoLogin;
        if (evento === "CRUD" || evento === "CREACION") return styles.eventoCrud;
        if (evento === "EDICION") return styles.eventoEdicion;
        if (evento === "ELIMINACION") return styles.eventoEliminacion;

        return styles.eventoGeneral;
    };

    const registrosFiltrados = registros.filter((registro) => {
        const nombreUsuario = registro.usuario?.nombre_completo || "";
        const correo = registro.usuario?.correo || "";
        const rol = registro.usuario?.rol?.nombre || "";
        const accion = registro.accion || "";
        const descripcion = registro.descripcion || "";
        const modulo = registro.modulo || "";
        const tipoEvento = registro.tipo_evento || "";
        const resultado = registro.resultado || "";

        const coincideBusqueda =
            nombreUsuario.toLowerCase().includes(busqueda.toLowerCase()) ||
            correo.toLowerCase().includes(busqueda.toLowerCase()) ||
            rol.toLowerCase().includes(busqueda.toLowerCase()) ||
            accion.toLowerCase().includes(busqueda.toLowerCase()) ||
            descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
            modulo.toLowerCase().includes(busqueda.toLowerCase());

        const coincideModulo =
            moduloFiltro === "TODOS" || modulo === moduloFiltro;

        const coincideEvento =
            eventoFiltro === "TODOS" || tipoEvento === eventoFiltro;

        const coincideResultado =
            resultadoFiltro === "TODOS" || resultado === resultadoFiltro;

        return coincideBusqueda && coincideModulo && coincideEvento && coincideResultado;
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
        layout: {
            display: "flex",
            height: "100vh",
            overflow: "hidden",
            backgroundColor: "#f5f7fb",
            fontFamily: "'Segoe UI', sans-serif"
        },
        sidebar: {
            width: "250px",
            height: "100vh",
            flexShrink: 0,
            background: "linear-gradient(180deg, #062b5f 0%, #031b3d 100%)",
            color: "#fff",
            padding: "25px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "spacmaine-between"
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
            borderCollapse: "collapse",
            minWidth: "1150px"
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
            color: "#33415c",
            verticalAlign: "top"
        },
        resultadoExitoso: {
            backgroundColor: "#dff6e4",
            color: "#1f7a3f",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        resultadoError: {
            backgroundColor: "#fde2e2",
            color: "#b42318",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        resultadoNeutral: {
            backgroundColor: "#eef2f7",
            color: "#33415c",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        eventoLogin: {
            backgroundColor: "#dbeafe",
            color: "#1e40af",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        eventoCrud: {
            backgroundColor: "#dff6e4",
            color: "#1f7a3f",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        eventoEdicion: {
            backgroundColor: "#fff4d6",
            color: "#8a5a00",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        eventoEliminacion: {
            backgroundColor: "#fde2e2",
            color: "#b42318",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        eventoGeneral: {
            backgroundColor: "#eef2f7",
            color: "#33415c",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
        },
        actionButton: {
            border: "none",
            borderRadius: "8px",
            width: "35px",
            height: "35px",
            cursor: "pointer",
            color: "#ffffff",
            backgroundColor: "#27ae60"
        },
        emptyRow: {
            padding: "25px",
            textAlign: "center",
            color: "#6b7890",
            fontSize: "15px"
        },
        descriptionCell: {
            maxWidth: "300px",
            lineHeight: "1.5"
        },
        smallText: {
            fontSize: "12px",
            color: "#6b7890",
            marginTop: "5px"
        },
        popup: {
            position: "fixed",
            top: "25px",
            right: "25px",
            backgroundColor: "#ffffff",
            color: "#102b5c",
            border: "1px solid #dbe3ee",
            borderLeft: "5px solid #eb5757",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            fontWeight: "bold",
            zIndex: 9999
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
                                    ...(modulo.ruta === "/bitacora"
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

            <main style={styles.main}>
                <nav style={styles.navbar}>
                    <div>
                        <h1 style={styles.title}>Bitácora del Sistema</h1>
                        <p style={styles.subtitle}>
                            Registro de acciones, usuarios, módulos y eventos realizados dentro de MediCore.
                        </p>
                    </div>
                </nav>

                <section style={styles.topActions}>
                    <div style={styles.filters}>
                        <div style={styles.searchBox}>
                            <FaSearch color="#6b7890" />

                            <input
                                type="text"
                                placeholder="Buscar usuario, acción, módulo o descripción..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>

                        <select
                            value={moduloFiltro}
                            onChange={(e) => setModuloFiltro(e.target.value)}
                            style={styles.select}
                        >
                            <option value="TODOS">Todos los módulos</option>
                            <option value="AUTH">Auth</option>
                            <option value="USUARIOS">Usuarios</option>
                            <option value="PACIENTES">Pacientes</option>
                            <option value="EXPEDIENTES">Expedientes</option>
                            <option value="CONSULTAS">Consultas</option>
                            <option value="DIAGNOSTICOS">Diagnósticos</option>
                            <option value="TRATAMIENTOS">Tratamientos</option>
                            <option value="RECETAS">Recetas</option>
                            <option value="CITAS">Citas</option>
                            <option value="DISPONIBILIDAD">Disponibilidad</option>
                        </select>

                        <select
                            value={eventoFiltro}
                            onChange={(e) => setEventoFiltro(e.target.value)}
                            style={styles.select}
                        >
                            <option value="TODOS">Todos los eventos</option>
                            <option value="GENERAL">General</option>
                            <option value="AUTENTICACION">Autenticación</option>
                            <option value="LOGIN">Login</option>
                            <option value="CRUD">CRUD</option>
                            <option value="CREACION">Creación</option>
                            <option value="EDICION">Edición</option>
                            <option value="ELIMINACION">Eliminación</option>
                        </select>

                        <select
                            value={resultadoFiltro}
                            onChange={(e) => setResultadoFiltro(e.target.value)}
                            style={styles.select}
                        >
                            <option value="TODOS">Todos los resultados</option>
                            <option value="EXITOSO">Exitoso</option>
                            <option value="ERROR">Error</option>
                            <option value="FALLIDO">Fallido</option>
                        </select>
                    </div>
                </section>

                <section style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Fecha y hora</th>
                                <th style={styles.th}>Usuario</th>
                                <th style={styles.th}>Rol</th>
                                <th
                                    style={{
                                        ...styles.th,
                                        width: "130px"
                                    }}
                                >
                                    Acción
                                </th>
                                <th style={styles.th}>Módulo</th>
                                <th style={styles.th}>Evento</th>
                                <th style={styles.th}>Resultado</th>
                                <th style={styles.th}>Detalle</th>
                            </tr>
                        </thead>

                        <tbody>
                            {registrosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={styles.emptyRow}>
                                        No se encontraron registros de bitácora.
                                    </td>
                                </tr>
                            ) : (
                                registrosFiltrados.map((registro) => (
                                    <tr key={registro.id_bitacora}>
                                        <td style={styles.td}>
                                            {formatearFecha(registro.fecha_hora)}
                                        </td>

                                        <td style={styles.td}>
                                            {registro.usuario?.nombre_completo || "Usuario no registrado"}

                                            <div style={styles.smallText}>
                                                {registro.usuario?.correo || "Sin correo"}
                                            </div>
                                        </td>

                                        <td style={styles.td}>
                                            {registro.usuario?.rol?.nombre || "Sin rol"}
                                        </td>

                                        <td style={styles.td}>
                                            <div
                                                style={{
                                                    maxWidth: "120px",
                                                    lineHeight: "1.4",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                {normalizarTexto(registro.accion)}
                                            </div>
                                        </td>

                                        <td style={styles.td}>
                                            {normalizarTexto(registro.modulo)}
                                        </td>

                                        <td style={styles.td}>
                                            <span style={obtenerEstiloEvento(registro.tipo_evento)}>
                                                {normalizarTexto(registro.tipo_evento || "GENERAL")}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            <span style={obtenerEstiloResultado(registro.resultado)}>
                                                {registro.resultado || "EXITOSO"}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            <div style={styles.descriptionCell}>
                                                {registro.descripcion || "Sin descripción"}

                                                {registro.user_agent && (
                                                    <div style={styles.smallText}>
                                                        Equipo: {registro.user_agent}
                                                    </div>
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

export default Bitacora;