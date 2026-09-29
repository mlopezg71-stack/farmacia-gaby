import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faUser,
    faEnvelope,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:3001/api/auth";

const ModalActualizarInformacion = ({
    abierto,
    onCerrar,
    usuario,
    onUsuarioActualizado,
}) => {
    const [formulario, setFormulario] = useState({
        nombre_completo: "",
        correo: "",
        telefono: "",
    });

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        if (abierto) {
            setFormulario({
                nombre_completo:
                    usuario?.nombre_completo || "",
                correo: usuario?.correo || "",
                telefono: usuario?.telefono || "",
            });

            setError("");
            setMensaje("");
        }
    }, [abierto, usuario]);

    const cambiarCampo = (campo, valor) => {
        setFormulario((actual) => ({
            ...actual,
            [campo]: valor,
        }));
    };

    const guardarCambios = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");

        if (!token) {
            setError(
                "Tu sesión ha expirado. Inicia sesión nuevamente."
            );
            return;
        }

        try {
            setGuardando(true);
            setError("");
            setMensaje("");

            const respuesta = await fetch(
                `${API_URL}/perfil`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        nombre_completo:
                            formulario.nombre_completo.trim(),
                        correo:
                            formulario.correo.trim().toLowerCase(),
                        telefono:
                            formulario.telefono.trim() || null,
                    }),
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.message ||
                    "No se pudo actualizar la información"
                );
            }

            const usuarioActualizado =
                datos.usuario;

            /*
             * Actualizamos también la información
             * guardada en la sesión.
             */
            sessionStorage.setItem(
                "usuario",
                JSON.stringify(usuarioActualizado)
            );

            if (onUsuarioActualizado) {
                onUsuarioActualizado(
                    usuarioActualizado
                );
            }

            setMensaje(
                "Información actualizada correctamente"
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setGuardando(false);
        }
    };

    if (!abierto) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor:
                    "rgba(10, 25, 50, 0.55)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10000,
                padding: "20px",
                boxSizing: "border-box",
            }}
            onClick={onCerrar}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "500px",
                    backgroundColor: "#ffffff",
                    borderRadius: "18px",
                    padding: "32px",
                    boxSizing: "border-box",
                    boxShadow:
                        "0 20px 60px rgba(0, 0, 0, 0.22)",
                }}
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <button
                    type="button"
                    onClick={onCerrar}
                    aria-label="Cerrar"
                    style={{
                        position: "absolute",
                        top: "18px",
                        right: "18px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: "#f3f6f9",
                        color: "#174a8b",
                        cursor: "pointer",
                        fontSize: "18px",
                    }}
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                    />
                </button>

                <h3
                    style={{
                        margin: "0 0 8px",
                        color: "#174a8b",
                        fontSize: "25px",
                        fontWeight: "800",
                        textAlign: "center",
                    }}
                >
                    Actualizar información
                </h3>

                <p
                    style={{
                        margin: "0 0 24px",
                        color: "#778397",
                        fontSize: "14px",
                        textAlign: "center",
                    }}
                >
                    Actualiza los datos de tu cuenta
                </p>

                {error && (
                    <div
                        style={{
                            marginBottom: "15px",
                            padding: "11px 14px",
                            borderRadius: "9px",
                            backgroundColor: "#fff1f1",
                            color: "#c62828",
                            border:
                                "1px solid #ffcaca",
                            fontSize: "13px",
                        }}
                    >
                        {error}
                    </div>
                )}

                {mensaje && (
                    <div
                        style={{
                            marginBottom: "15px",
                            padding: "11px 14px",
                            borderRadius: "9px",
                            backgroundColor: "#e8f8ef",
                            color: "#008f4c",
                            border:
                                "1px solid #bce8cf",
                            fontSize: "13px",
                        }}
                    >
                        {mensaje}
                    </div>
                )}

                <form
                    onSubmit={guardarCambios}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "13px",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faUser}
                            style={{
                                position: "absolute",
                                left: "16px",
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                color: "#8a94a6",
                                fontSize: "15px",
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={
                                formulario.nombre_completo
                            }
                            onChange={(e) =>
                                cambiarCampo(
                                    "nombre_completo",
                                    e.target.value
                                )
                            }
                            required
                            style={{
                                width: "100%",
                                height: "47px",
                                padding:
                                    "0 15px 0 46px",
                                border:
                                    "1px solid #dde4ec",
                                borderRadius: "9px",
                                boxSizing:
                                    "border-box",
                                outline: "none",
                                fontSize: "14px",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            position: "relative",
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            style={{
                                position: "absolute",
                                left: "16px",
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                color: "#8a94a6",
                                fontSize: "15px",
                            }}
                        />

                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={
                                formulario.correo
                            }
                            onChange={(e) =>
                                cambiarCampo(
                                    "correo",
                                    e.target.value
                                )
                            }
                            required
                            style={{
                                width: "100%",
                                height: "47px",
                                padding:
                                    "0 15px 0 46px",
                                border:
                                    "1px solid #dde4ec",
                                borderRadius: "9px",
                                boxSizing:
                                    "border-box",
                                outline: "none",
                                fontSize: "14px",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            position: "relative",
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faPhone}
                            style={{
                                position: "absolute",
                                left: "16px",
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                color: "#8a94a6",
                                fontSize: "15px",
                            }}
                        />

                        <input
                            type="tel"
                            placeholder="Teléfono"
                            value={
                                formulario.telefono
                            }
                            onChange={(e) =>
                                cambiarCampo(
                                    "telefono",
                                    e.target.value
                                )
                            }
                            style={{
                                width: "100%",
                                height: "47px",
                                padding:
                                    "0 15px 0 46px",
                                border:
                                    "1px solid #dde4ec",
                                borderRadius: "9px",
                                boxSizing:
                                    "border-box",
                                outline: "none",
                                fontSize: "14px",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={guardando}
                        style={{
                            height: "48px",
                            marginTop: "5px",
                            border: "none",
                            borderRadius: "9px",
                            backgroundColor:
                                guardando
                                    ? "#7bc9a5"
                                    : "#00a859",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: guardando
                                ? "default"
                                : "pointer",
                        }}
                    >
                        {guardando
                            ? "Guardando..."
                            : "Guardar cambios"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalActualizarInformacion;