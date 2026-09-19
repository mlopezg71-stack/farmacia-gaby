import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaUsers,
    FaUserShield,
    FaEnvelope,
    FaClipboardList,
    FaClock,
    FaUserMd,
    FaUserInjured
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";

const UsuarioDetalle = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [usuario, setUsuario] = useState(null);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        obtenerUsuario();
    }, [id]);

    const obtenerUsuario = async () => {

        try {

            const response = await axiosClient.get(`/usuarios/${id}`);

            setUsuario(response.data);

            if (response.data.rol?.nombre === "MEDICO") {
                try {
                    const resDisponibilidad = await axiosClient.get(
                        `/disponibilidad/medico/${response.data.id_usuario}`
                    );

                    setDisponibilidades(resDisponibilidad.data);
                } catch (error) {
                    console.error("Error al obtener disponibilidad:", error);
                    setDisponibilidades([]);
                }
            }

        } catch (error) {

            console.error("Error al obtener usuario:", error);

            setMensaje("Error al cargar la información del usuario");

        } finally {

            setLoading(false);

        }
    };

    const mostrarDato = (valor) => {
        return valor && valor !== ""
            ? valor
            : "No registrado";
    };

    const formatearFecha = (fecha) => {

        if (!fecha) return "No registrado";

        return new Date(fecha).toLocaleString("es-GT", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const ordenDias = {
        DOMINGO: 1,
        LUNES: 2,
        MARTES: 3,
        MIERCOLES: 4,
        JUEVES: 5,
        VIERNES: 6,
        SABADO: 7
    };

    const styles = {
        container: {
            minHeight: "100vh",
            backgroundColor: "#f5f7fb",
            padding: "24px",
            fontFamily: "'Segoe UI', sans-serif"
        },

        topBar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px"
        },

        title: {
            fontSize: "30px",
            color: "#102b5c",
            margin: 0
        },

        actions: {
            display: "flex",
            gap: "12px"
        },

        backButton: {
            backgroundColor: "#ffffff",
            border: "1px solid #dbe3ee",
            borderRadius: "10px",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#102b5c"
        },

        editButton: {
            backgroundColor: "#0b2c5f",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontWeight: "bold"
        },

        headerCard: {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "22px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e8edf5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        },

        headerTitle: {
            fontSize: "26px",
            color: "#102b5c",
            margin: 0
        },

        headerSub: {
            color: "#6b7890",
            marginTop: "8px",
            fontSize: "14px"
        },

        estadoActivo: {
            backgroundColor: "#dff6e4",
            color: "#1f7a3f",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold"
        },

        estadoInactivo: {
            backgroundColor: "#fde2e2",
            color: "#b42318",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold"
        },

        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
            gap: "22px"
        },

        card: {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e8edf5"
        },

        cardTitle: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#102b5c",
            fontSize: "19px",
            marginTop: 0,
            marginBottom: "18px",
            borderBottom: "1px solid #edf1f7",
            paddingBottom: "12px"
        },

        icon: {
            color: "#2f80ed"
        },

        row: {
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            padding: "10px 0",
            borderBottom: "1px solid #f0f3f8"
        },

        label: {
            color: "#6b7890",
            fontWeight: "600",
            fontSize: "14px"
        },

        value: {
            color: "#26364f",
            fontSize: "14px",
            textAlign: "right"
        },

        textValue: {
            color: "#26364f",
            fontSize: "14px",
            lineHeight: "1.6"
        },

        loading: {
            backgroundColor: "#ffffff",
            padding: "25px",
            borderRadius: "14px",
            color: "#102b5c",
            fontWeight: "bold"
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
        },

        badge: {
            backgroundColor: "#eef4ff",
            color: "#0b2c5f",
            padding: "8px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600"
        },

        noteBox: {
            backgroundColor: "#f8fbff",
            border: "1px solid #dbe8f5",
            borderRadius: "14px",
            padding: "18px",
            marginTop: "15px"
        },

        noteText: {
            color: "#374151",
            lineHeight: "1.7",
            margin: 0
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    Cargando información del usuario...
                </div>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    No se encontró información del usuario.
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            {mensaje && (
                <div style={styles.popup}>
                    {mensaje}
                </div>
            )}

            <div style={styles.topBar}>

                <h1 style={styles.title}>
                    Detalle del Usuario
                </h1>

                <div style={styles.actions}>

                    <button
                        style={styles.backButton}
                        onClick={() => navigate("/usuarios")}
                    >
                        <FaArrowLeft />
                        Regresar
                    </button>

                    <button
                        style={styles.editButton}
                        onClick={() =>
                            navigate(`/usuarios/editar/${usuario.id_usuario}`)
                        }
                    >
                        <FaEdit />
                        Editar usuario
                    </button>

                </div>

            </div>

            <section style={styles.headerCard}>

                <div>

                    <h2 style={styles.headerTitle}>
                        {mostrarDato(usuario.nombre_completo)}
                    </h2>

                    <p style={styles.headerSub}>
                        Correo: {mostrarDato(usuario.correo)}
                    </p>

                </div>

                <span
                    style={
                        usuario.estado === "ACTIVO"
                            ? styles.estadoActivo
                            : styles.estadoInactivo
                    }
                >
                    {mostrarDato(usuario.estado)}
                </span>

            </section>

            <section style={styles.grid}>

                <div style={styles.card}>

                    <h2 style={styles.cardTitle}>
                        <FaUsers style={styles.icon} />
                        Información general
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>
                            Nombre completo
                        </span>

                        <span style={styles.value}>
                            {mostrarDato(usuario.nombre_completo)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>
                            Correo electrónico
                        </span>

                        <span style={styles.value}>
                            {mostrarDato(usuario.correo)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>
                            Estado
                        </span>

                        <span style={styles.value}>
                            {mostrarDato(usuario.estado)}
                        </span>
                    </div>

                </div>

                <div style={styles.card}>

                    <h2 style={styles.cardTitle}>
                        <FaUserShield style={styles.icon} />
                        Rol y permisos
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>
                            Rol del sistema
                        </span>

                        <span style={styles.value}>
                            {mostrarDato(usuario.rol?.nombre)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>
                            ID Rol
                        </span>

                        <span style={styles.value}>
                            {mostrarDato(usuario.id_rol)}
                        </span>
                    </div>

                    <div style={{ marginTop: "18px" }}>
                        <span style={styles.badge}>
                            {mostrarDato(usuario.rol?.nombre)}
                        </span>
                    </div>

                </div>

                <div style={styles.card}>

                    <h2 style={styles.cardTitle}>
                        <FaClock style={styles.icon} />
                        Control de acceso
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>
                            Último acceso
                        </span>

                        <span style={styles.value}>
                            {formatearFecha(usuario.ultimo_acceso)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>
                            Fecha creación
                        </span>

                        <span style={styles.value}>
                            {formatearFecha(usuario.created_at)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>
                            Última actualización
                        </span>

                        <span style={styles.value}>
                            {formatearFecha(usuario.updated_at)}
                        </span>
                    </div>

                </div>

                <div style={styles.card}>

                    <h2 style={styles.cardTitle}>
                        <FaClipboardList style={styles.icon} />
                        Relación con módulos clínicos
                    </h2>

                    {usuario.rol?.nombre === "MEDICO" && (
                        <div style={styles.noteBox}>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "10px"
                                }}
                            >
                                <FaUserMd color="#2f80ed" />

                                <strong style={{ color: "#102b5c" }}>
                                    Usuario médico
                                </strong>
                            </div>

                            <p style={styles.noteText}>
                                Este usuario podrá gestionar disponibilidad médica,
                                consultas, diagnósticos, tratamientos y recetas médicas
                                dentro del sistema MediCore.
                            </p>

                        </div>
                    )}

                    {usuario.rol?.nombre === "PACIENTE" && (
                        <div style={styles.noteBox}>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "10px"
                                }}
                            >
                                <FaUserInjured color="#2f80ed" />

                                <strong style={{ color: "#102b5c" }}>
                                    Usuario paciente
                                </strong>
                            </div>

                            <p style={styles.noteText}>
                                Este usuario podrá relacionarse posteriormente
                                con el módulo de Pacientes y visualizar sus citas,
                                expediente clínico e información médica.
                            </p>

                        </div>
                    )}


                    {usuario.rol?.nombre === "ADMIN" && (
                        <div style={styles.noteBox}>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "10px"
                                }}
                            >
                                <FaUserShield color="#2f80ed" />

                                <strong style={{ color: "#102b5c" }}>
                                    Usuario administrador
                                </strong>
                            </div>

                            <p style={styles.noteText}>
                                Este usuario tiene acceso administrativo a la gestión
                                de usuarios, módulos clínicos y configuración general
                                del sistema MediCore.
                            </p>

                        </div>
                    )}

                </div>

                <div style={styles.card}>

                    <h2 style={styles.cardTitle}>
                        <FaEnvelope style={styles.icon} />
                        Información complementaria
                    </h2>

                    <div style={styles.row}>
                        <span style={styles.label}>
                            Correo registrado
                        </span>

                        <span style={styles.value}>
                            {mostrarDato(usuario.correo)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>
                            Estado actual
                        </span>

                        <span style={styles.value}>
                            {mostrarDato(usuario.estado)}
                        </span>
                    </div>

                </div>
                {usuario.rol?.nombre === "MEDICO" && (
                    <div
                        style={{
                            ...styles.card,
                            gridColumn: "span 3",
                            maxWidth: "900px"
                        }}
                    >

                        <h2 style={styles.cardTitle}>
                            <FaClock style={styles.icon} />
                            Disponibilidad médica
                        </h2>

                        {disponibilidades.length === 0 ? (

                            <p style={styles.noteText}>
                                No hay disponibilidad médica registrada para este usuario.
                            </p>

                        ) : (

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 265px)",
                                    justifyContent: "start",

                                    columnGap: "28px",
                                    rowGap: "14px",

                                    marginTop: "10px"
                                }}
                            >
                                {[...disponibilidades]
                                    .sort((a, b) => ordenDias[a.dia_semana] - ordenDias[b.dia_semana])
                                    .map((item) => (
                                        <div
                                            key={item.id_disponibilidad}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "9px",
                                                backgroundColor: "#f8fbff",
                                                border: "1px solid #dbe3ee",
                                                borderRadius: "12px",
                                                padding: "12px 16px"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "#102b5c",
                                                    fontWeight: "700",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                {item.dia_semana}
                                            </span>

                                            <span
                                                style={{
                                                    color: "#5d6b82",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                {item.hora_inicio} - {item.hora_fin}
                                            </span>

                                            <span
                                                style={{
                                                    backgroundColor:
                                                        item.estado === "ACTIVO"
                                                            ? "#dff6e4"
                                                            : "#fde2e2",

                                                    color:
                                                        item.estado === "ACTIVO"
                                                            ? "#1f7a3f"
                                                            : "#b42318",

                                                    padding: "5px 10px",
                                                    borderRadius: "20px",
                                                    fontSize: "11px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {item.estado}
                                            </span>
                                        </div>
                                    ))}
                            </div>

                        )}

                    </div>
                )}

            </section>

        </div>
    );
};

export default UsuarioDetalle;