import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaUsers,
    FaUserShield,
    FaKey,
    FaExclamationCircle,
    FaCalendarAlt
} from "react-icons/fa";

import axiosClient from "../../api/axiosConfig";

const UsuarioForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const esEdicion = Boolean(id);

    const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({
        nombre_completo: "",
        correo: "",
        password: "",
        id_rol: "",
        estado: "ACTIVO"
    });

    const [disponibilidad, setDisponibilidad] = useState({
        dias_semana: [],
        hora_inicio: "",
        hora_fin: "",
        estado: "ACTIVO"
    });

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        cargarRoles();

        if (esEdicion) {
            cargarUsuario();
        }
    }, [id]);

    const cargarRoles = async () => {
        try {
            const res = await axiosClient.get("/usuarios/roles");
            setRoles(res.data);
        } catch (error) {
            console.error("Error al cargar roles:", error);
            setMensaje("Error al cargar roles");
        }
    };

    const cargarUsuario = async () => {
        try {
            const res = await axiosClient.get(`/usuarios/${id}`);
            const usuario = res.data;

            setFormData({
                nombre_completo: usuario.nombre_completo || "",
                correo: usuario.correo || "",
                password: "",
                id_rol: usuario.id_rol || "",
                estado: usuario.estado || "ACTIVO"
            });

        } catch (error) {
            console.error("Error al cargar usuario:", error);
            setMensaje("Error al cargar usuario");
        }
    };

    const generarCorreoUsuario = (nombreCompleto, idRol) => {
        const limpiarTexto = (texto) => {
            return texto
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/^dr\s+|^dra\s+/i, "")
                .trim();
        };

        const partes = limpiarTexto(nombreCompleto)
            .split(/\s+/)
            .filter(Boolean);

        if (partes.length < 2) {
            return "";
        }

        const primerNombre = partes[0];

        const primerApellido =
            partes.length >= 4
                ? partes[partes.length - 2]
                : partes[partes.length - 1];

        const rol = roles.find(
            (r) => Number(r.id_rol) === Number(idRol)
        );

        if (rol?.nombre === "MEDICO") {
            return `dr.${primerNombre}.${primerApellido}@medicore.com`;
        }

        if (rol?.nombre === "PACIENTE") {
            return `${primerNombre}.${primerApellido}@pacientesmedicore.com`;
        }

        return `${primerNombre}.${primerApellido}@medicore.com`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let nuevosDatos = {
            ...formData,
            [name]: value
        };

        if (
            !esEdicion &&
            (name === "nombre_completo" || name === "id_rol")
        ) {
            nuevosDatos.correo = generarCorreoUsuario(
                name === "nombre_completo"
                    ? value
                    : nuevosDatos.nombre_completo,
                name === "id_rol"
                    ? value
                    : nuevosDatos.id_rol
            );
        }

        setFormData(nuevosDatos);
    };

    const rolSeleccionado = roles.find(
        (rol) => Number(rol.id_rol) === Number(formData.id_rol)
    );

    const esMedico = rolSeleccionado?.nombre === "MEDICO";

    const guardarUsuario = async (e) => {
        e.preventDefault();

        if (
            !formData.nombre_completo ||
            !formData.correo ||
            !formData.id_rol
        ) {
            alert("Complete nombre, correo y rol del usuario");
            return;
        }

        if (!esEdicion && !formData.password) {
            alert("Ingrese una contraseña para el nuevo usuario");
            return;
        }

        const formatearNombreCompleto = () => {
            const nombreLimpio = formData.nombre_completo.trim();

            if (esMedico && !nombreLimpio.toLowerCase().startsWith("dr.")) {
                return `Dr. ${nombreLimpio}`;
            }

            return nombreLimpio;
        };

        const dataEnviar = {
            nombre_completo: formatearNombreCompleto(),
            correo: formData.correo,
            id_rol: Number(formData.id_rol),
            estado: formData.estado
        };

        if (formData.password.trim() !== "") {
            dataEnviar.password = formData.password;
        }

        try {
            setLoading(true);

            if (esEdicion) {
                await axiosClient.put(`/usuarios/${id}`, dataEnviar);

                const quiereActualizarDisponibilidad =
                    disponibilidad.dias_semana.length > 0 ||
                    disponibilidad.hora_inicio ||
                    disponibilidad.hora_fin;

                if (esMedico && quiereActualizarDisponibilidad) {
                    if (
                        disponibilidad.dias_semana.length === 0 ||
                        !disponibilidad.hora_inicio ||
                        !disponibilidad.hora_fin
                    ) {
                        alert("Si va a modificar disponibilidad, complete días, hora inicio y hora fin");
                        setLoading(false);
                        return;
                    }

                    await axiosClient.put(`/disponibilidad/medico/${id}/reemplazar`, {
                        disponibilidades: disponibilidad.dias_semana.map((dia) => ({
                            dia_semana: dia,
                            hora_inicio: disponibilidad.hora_inicio,
                            hora_fin: disponibilidad.hora_fin,
                            estado: disponibilidad.estado
                        }))
                    });
                }

                setMensaje("Usuario actualizado correctamente");
            }

            else {
                if (esMedico) {
                    if (
                        disponibilidad.dias_semana.length === 0 ||
                        !disponibilidad.hora_inicio ||
                        !disponibilidad.hora_fin
                    ) {
                        alert("Complete la disponibilidad médica del usuario");
                        setLoading(false);
                        return;
                    }
                }

                const resUsuario = await axiosClient.post("/usuarios", dataEnviar);
                const usuarioCreado = resUsuario.data.usuario;

                if (esMedico) {
                    await Promise.all(
                        disponibilidad.dias_semana.map((dia) =>
                            axiosClient.post("/disponibilidad", {
                                id_usuario_medico: usuarioCreado.id_usuario,
                                dia_semana: dia,
                                hora_inicio: disponibilidad.hora_inicio,
                                hora_fin: disponibilidad.hora_fin,
                                estado: disponibilidad.estado
                            })
                        )
                    );
                }

                setMensaje("Usuario creado correctamente");
            }

            setTimeout(() => {
                navigate("/usuarios");
            }, 1200);

        } catch (error) {
            setMensaje(
                error?.response?.data?.message ||
                "Error al guardar usuario"
            );
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            height: "100vh",
            overflowY: "auto",
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
        card: {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e8edf5"
        },
        hintBox: {
            width: "720px",
            backgroundColor: "#f7f9fc",
            border: "1px solid #e1e7f0",
            borderRadius: "12px",
            padding: "12px 16px",
            color: "#6b7890",
            fontSize: "13px",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
        },
        sectionTitle: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#102b5c",
            fontSize: "20px",
            marginTop: "30px",
            marginBottom: "18px",
            borderBottom: "1px solid #edf1f7",
            paddingBottom: "12px"
        },
        sectionIcon: {
            color: "#2f80ed",
            fontSize: "20px"
        },
        grid: {
            display: "flex",
            flexWrap: "wrap",
            columnGap: "35px",
            rowGap: "18px",
            alignItems: "flex-start"
        },
        field: {
            display: "flex",
            flexDirection: "column"
        },
        label: {
            marginBottom: "8px",
            color: "#102b5c",
            fontWeight: "600",
            fontSize: "14px"
        },
        required: {
            color: "#e8505b"
        },
        input: {
            height: "42px",
            borderRadius: "9px",
            border: "1px solid #dbe3ee",
            padding: "0 12px",
            fontSize: "13px",
            outline: "none",
            backgroundColor: "#ffffff"
        },
        actions: {
            marginTop: "30px",
            display: "flex",
            justifyContent: "flex-end"
        },
        saveButton: {
            backgroundColor: "#0b2c5f",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
            cursor: "pointer"
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
        }
    };

    return (
        <div style={styles.container}>
            {mensaje && (
                <div style={styles.popup}>
                    {mensaje}
                </div>
            )}

            <div style={styles.topBar}>
                <h1 style={styles.title}>
                    {esEdicion ? "Editar Usuario" : "Nuevo Usuario"}
                </h1>

                <button
                    type="button"
                    style={styles.backButton}
                    onClick={() => navigate("/usuarios")}
                >
                    <FaArrowLeft />
                    Regresar
                </button>
            </div>

            <form style={styles.card} onSubmit={guardarUsuario}>


                <h2 style={styles.sectionTitle}>
                    <FaUsers style={styles.sectionIcon} />
                    Información del usuario
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Nombre completo <span style={styles.required}>*</span>
                        </label>

                        <input
                            name="nombre_completo"
                            value={formData.nombre_completo}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "320px" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Correo electrónico <span style={styles.required}>*</span>
                        </label>

                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "280px" }}
                        />
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>
                    <FaUserShield style={styles.sectionIcon} />
                    Rol y estado
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Rol <span style={styles.required}>*</span>
                        </label>

                        <select
                            name="id_rol"
                            value={formData.id_rol}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "220px" }}
                        >
                            <option value="">Seleccione un rol</option>

                            {roles.map((rol) => (
                                <option key={rol.id_rol} value={rol.id_rol}>
                                    {rol.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Estado</label>

                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            style={{ ...styles.input, width: "160px" }}
                        >
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                        </select>
                    </div>
                </div>
                {esMedico && (
                    <>
                        <h2 style={styles.sectionTitle}>
                            <FaCalendarAlt style={styles.sectionIcon} />
                            Disponibilidad Médica
                        </h2>

                        <div style={styles.grid}>
                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Días de atención <span style={styles.required}>*</span>
                                </label>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "520px" }}>
                                    {["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"].map((dia) => (
                                        <label
                                            key={dia}
                                            style={{
                                                border: "1px solid #dbe3ee",
                                                borderRadius: "9px",
                                                padding: "10px 14px",
                                                cursor: "pointer",
                                                backgroundColor: disponibilidad.dias_semana.includes(dia)
                                                    ? "#eaf2ff"
                                                    : "#ffffff",
                                                color: "#102b5c",
                                                fontWeight: "600",
                                                fontSize: "13px"
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={disponibilidad.dias_semana.includes(dia)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setDisponibilidad({
                                                            ...disponibilidad,
                                                            dias_semana: [...disponibilidad.dias_semana, dia]
                                                        });
                                                    } else {
                                                        setDisponibilidad({
                                                            ...disponibilidad,
                                                            dias_semana: disponibilidad.dias_semana.filter(
                                                                (item) => item !== dia
                                                            )
                                                        });
                                                    }
                                                }}
                                                style={{
                                                    marginRight: "8px",
                                                    accentColor: "#2f80ed"
                                                }}
                                            />
                                            {dia}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Hora inicio <span style={styles.required}>*</span>
                                </label>

                                <input
                                    type="time"
                                    value={disponibilidad.hora_inicio}
                                    onChange={(e) =>
                                        setDisponibilidad({
                                            ...disponibilidad,
                                            hora_inicio: e.target.value
                                        })
                                    }
                                    style={{ ...styles.input, width: "160px" }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Hora fin <span style={styles.required}>*</span>
                                </label>

                                <input
                                    type="time"
                                    value={disponibilidad.hora_fin}
                                    onChange={(e) =>
                                        setDisponibilidad({
                                            ...disponibilidad,
                                            hora_fin: e.target.value
                                        })
                                    }
                                    style={{ ...styles.input, width: "160px" }}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Estado</label>

                                <select
                                    value={disponibilidad.estado}
                                    onChange={(e) =>
                                        setDisponibilidad({
                                            ...disponibilidad,
                                            estado: e.target.value
                                        })
                                    }
                                    style={{ ...styles.input, width: "160px" }}
                                >
                                    <option value="ACTIVO">ACTIVO</option>
                                    <option value="INACTIVO">INACTIVO</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}

                {esMedico && (
                    <div style={{ ...styles.hintBox, marginTop: "18px" }}>
                        El horario médico será registrado automáticamente junto con el usuario.
                    </div>
                )}

                <h2 style={styles.sectionTitle}>
                    <FaKey style={styles.sectionIcon} />
                    Seguridad de acceso
                </h2>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Contraseña {!esEdicion && <span style={styles.required}>*</span>}
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={
                                esEdicion
                                    ? "Dejar vacío para no cambiar contraseña"
                                    : "Ingrese una contraseña"
                            }
                            style={{ ...styles.input, width: "300px" }}
                        />
                    </div>
                </div>

                <div style={styles.actions}>
                    <button type="submit" style={styles.saveButton} disabled={loading}>
                        <FaSave />
                        {loading
                            ? esEdicion
                                ? "Actualizando..."
                                : "Guardando..."
                            : esEdicion
                                ? "Actualizar usuario"
                                : "Guardar usuario"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UsuarioForm;