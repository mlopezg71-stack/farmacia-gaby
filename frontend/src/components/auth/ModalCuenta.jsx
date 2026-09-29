import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate } from "react-router-dom";

import logo from "../../assets/FarmaciasGaby.png";

import {
    faXmark,
    faUser,
    faEnvelope,
    faPhone,
    faLock,
} from "@fortawesome/free-solid-svg-icons";

const ModalCuenta = ({ abierto, onCerrar }) => {
    const { login: iniciarSesion } = useAuth();
    const navigate = useNavigate();

    const [vista, setVista] = useState("registro");

    const [registro, setRegistro] = useState({
        nombre_completo: "",
        correo: "",
        telefono: "",
        password: "",
        confirmarPassword: "",
    });

    const [login, setLogin] = useState({
        correo: "",
        password: "",
    });

    const [recuperacion, setRecuperacion] = useState({
        correo: "",
    });

    const [resetPassword, setResetPassword] = useState({
        codigo: "",
        nuevaPassword: "",
        confirmarPassword: "",
    });

    const validacionesPassword = {
        longitud: resetPassword.nuevaPassword.length >= 8,
        mayuscula: /[A-Z]/.test(resetPassword.nuevaPassword),
        minuscula: /[a-z]/.test(resetPassword.nuevaPassword),
        numero: /[0-9]/.test(resetPassword.nuevaPassword),
        simbolo: /[^A-Za-z0-9]/.test(resetPassword.nuevaPassword),
    };

    const passwordsCoinciden =
        resetPassword.confirmarPassword.length > 0 &&
        resetPassword.nuevaPassword === resetPassword.confirmarPassword;

    const [mensajeRecuperacion, setMensajeRecuperacion] = useState({

        abierto: false,
        tipo: "",
        texto: "",
    });

    const [cargandoRecuperacion, setCargandoRecuperacion] = useState(false);

    const handleRegistro = async (e) => {
        e.preventDefault();

        if (registro.password !== registro.confirmarPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const respuesta = await fetch(
                "http://localhost:3001/api/auth/registro",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre_completo: registro.nombre_completo,
                        correo: registro.correo,
                        telefono: registro.telefono,
                        password: registro.password,
                    }),
                }
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.message || "Error al registrar usuario");
            }

            alert(data.message);
            setVista("login");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await fetch(
                "http://localhost:3001/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        correo: login.correo,
                        password: login.password,
                    }),
                }
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.message || "Error al iniciar sesión");
            }

            iniciarSesion(data.usuario, data.token);

            setMensajeRecuperacion({
                abierto: true,
                tipo: "bienvenida",
                texto: data.usuario.nombre_completo,
            });

            setTimeout(() => {
                setMensajeRecuperacion({
                    abierto: false,
                    tipo: "",
                    texto: "",
                });

                onCerrar();

                if (data.usuario.roles?.includes("ADMINISTRADOR")) {
                    navigate("/dashboard");
                }
            }, 2000);

            if (data.usuario.roles?.includes("ADMINISTRADOR")) {
                onCerrar();
                navigate("/dashboard");
            }
        } catch (error) {
            setMensajeRecuperacion({
                abierto: true,
                tipo: "error",
                texto: error.message,
            });
        }
    };

    const handleRecuperacion = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await fetch(
                "http://localhost:3001/api/auth/recuperar-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        correo: recuperacion.correo,
                    }),
                }
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    data.message ||
                    "No fue posible solicitar la recuperación de contraseña"
                );
            }

            sessionStorage.setItem(
                "resetEmail",
                recuperacion.correo
            );

            setMensajeRecuperacion({
                abierto: true,
                tipo: "exito",
                texto:
                    "Hemos enviado un código de recuperación a tu correo electrónico. " +
                    "Si no lo encuentras en tu bandeja de entrada, revisa la carpeta de spam o correo no deseado.",
            });

        } catch (error) {
            setMensajeRecuperacion({
                abierto: true,
                tipo: "error",
                texto: error.message,
            });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const todasValidas =
            validacionesPassword.longitud &&
            validacionesPassword.mayuscula &&
            validacionesPassword.minuscula &&
            validacionesPassword.numero &&
            validacionesPassword.simbolo;

        if (resetPassword.codigo.length !== 6) {
            setMensajeRecuperacion({
                abierto: true,
                tipo: "error",
                texto: "Ingresa el código de recuperación de 6 dígitos.",
            });
            return;
        }

        if (!todasValidas) {
            setMensajeRecuperacion({
                abierto: true,
                tipo: "error",
                texto: "La nueva contraseña no cumple con todos los requisitos de seguridad.",
            });
            return;
        }

        if (!passwordsCoinciden) {
            setMensajeRecuperacion({
                abierto: true,
                tipo: "error",
                texto: "Las contraseñas no coinciden.",
            });
            return;
        }

        const correo = sessionStorage.getItem("resetEmail");

        if (!correo) {
            setMensajeRecuperacion({
                abierto: true,
                tipo: "error",
                texto: "No se encontró la solicitud de recuperación. Solicita un nuevo código.",
            });
            return;
        }

        setCargandoRecuperacion(true);

        try {
            const response = await fetch(
                "http://localhost:3001/api/auth/restablecer-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        correo,
                        codigo: resetPassword.codigo,
                        nuevaPassword: resetPassword.nuevaPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "No fue posible restablecer la contraseña."
                );
            }

            setMensajeRecuperacion({
                abierto: true,
                tipo: "password_actualizada",
                texto:
                    data.message ||
                    "Tu contraseña ha sido restablecida correctamente.",
            });
        } catch (error) {
            setMensajeRecuperacion({
                abierto: true,
                tipo: "error",
                texto:
                    error.message ||
                    "No fue posible restablecer la contraseña.",
            });
        } finally {
            setCargandoRecuperacion(false);
        }
    };

    if (!abierto) return null;

    const estilos = {
        overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(10, 25, 50, 0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box",
        },

        modal: {
            position: "relative",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "92vh",
            overflowY: "auto",
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            padding: "32px",
            boxSizing: "border-box",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.22)",
        },

        cerrar: {
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
        },

        logo: {
            textAlign: "center",
            marginBottom: "22px",
        },

        logoTexto: {
            margin: 0,
            color: "#174a8b",
            fontSize: "28px",
            fontWeight: "800",
        },

        gaby: {
            color: "#00a859",
        },

        selector: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px",
            padding: "5px",
            marginBottom: "26px",
            backgroundColor: "#f3f6f9",
            borderRadius: "10px",
        },

        selectorBoton: {
            height: "42px",
            border: "none",
            borderRadius: "7px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
        },

        titulo: {
            margin: "0 0 6px",
            color: "#174a8b",
            fontSize: "25px",
            fontWeight: "800",
            textAlign: "center",
        },

        subtitulo: {
            margin: "0 0 24px",
            color: "#778397",
            fontSize: "14px",
            textAlign: "center",
        },

        formulario: {
            display: "flex",
            flexDirection: "column",
            gap: "13px",
        },

        inputGroup: {
            position: "relative",
        },

        icono: {
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#8a94a6",
            fontSize: "15px",
        },

        input: {
            width: "100%",
            height: "47px",
            padding: "0 15px 0 46px",
            border: "1px solid #dde4ec",
            borderRadius: "9px",
            boxSizing: "border-box",
            outline: "none",
            fontSize: "14px",
        },

        botonPrincipal: {
            height: "48px",
            marginTop: "5px",
            border: "none",
            borderRadius: "9px",
            backgroundColor: "#00a859",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
        },

        ayuda: {
            margin: "15px 0 0",
            textAlign: "center",
            color: "#8a94a6",
            fontSize: "12px",
            lineHeight: "1.5",
        },
    };

    const estiloSelector = (activo) => ({
        ...estilos.selectorBoton,
        backgroundColor: activo ? "#174a8b" : "transparent",
        color: activo ? "#ffffff" : "#65758b",
    });

    return (
        <div style={estilos.overlay} onClick={onCerrar}>
            <div
                style={estilos.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    style={estilos.cerrar}
                    onClick={onCerrar}
                    aria-label="Cerrar"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                <div style={estilos.logo}>
                    <img
                        src={logo}
                        alt="Farmacia Gaby"
                        style={{
                            width: "190px",
                            height: "70px",
                            objectFit: "contain",
                        }}
                    />
                </div>

                <div style={estilos.selector}>
                    <button
                        type="button"
                        onClick={() => setVista("registro")}
                        style={estiloSelector(vista === "registro")}
                    >
                        Crear cuenta
                    </button>

                    <button
                        type="button"
                        onClick={() => setVista("login")}
                        style={estiloSelector(vista === "login")}
                    >
                        Iniciar sesión
                    </button>
                </div>

                {vista === "registro" ? (
                    <>
                        <h3 style={estilos.titulo}>Crear cuenta</h3>

                        <p style={estilos.subtitulo}>
                            Regístrate en Farmacia Gaby
                        </p>

                        <form
                            style={estilos.formulario}
                            onSubmit={handleRegistro}
                        >
                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    style={estilos.icono}
                                />

                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    style={estilos.input}
                                    value={registro.nombre_completo}
                                    onChange={(e) =>
                                        setRegistro({
                                            ...registro,
                                            nombre_completo: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    style={estilos.icono}
                                />

                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                    style={estilos.input}
                                    value={registro.correo}
                                    onChange={(e) =>
                                        setRegistro({
                                            ...registro,
                                            correo: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faPhone}
                                    style={estilos.icono}
                                />

                                <input
                                    type="tel"
                                    placeholder="Teléfono"
                                    style={estilos.input}
                                    value={registro.telefono}
                                    onChange={(e) =>
                                        setRegistro({
                                            ...registro,
                                            telefono: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faLock}
                                    style={estilos.icono}
                                />

                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    style={estilos.input}
                                    value={registro.password}
                                    onChange={(e) =>
                                        setRegistro({
                                            ...registro,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faLock}
                                    style={estilos.icono}
                                />

                                <input
                                    type="password"
                                    placeholder="Confirmar contraseña"
                                    style={estilos.input}
                                    value={registro.confirmarPassword}
                                    onChange={(e) =>
                                        setRegistro({
                                            ...registro,
                                            confirmarPassword: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                style={estilos.botonPrincipal}
                            >
                                Crear mi cuenta
                            </button>
                        </form>

                        <p style={estilos.ayuda}>
                            Crea tu cuenta para acceder a las funciones
                            disponibles para clientes de Farmacia Gaby.
                        </p>
                    </>
                ) : vista === "login" ? (
                    <>
                        <h3 style={estilos.titulo}>Bienvenido</h3>

                        <p style={estilos.subtitulo}>
                            Inicia sesión en tu cuenta
                        </p>

                        <form
                            style={estilos.formulario}
                            onSubmit={handleLogin}
                        >
                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    style={estilos.icono}
                                />

                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                    style={estilos.input}
                                    value={login.correo}
                                    onChange={(e) =>
                                        setLogin({
                                            ...login,
                                            correo: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faLock}
                                    style={estilos.icono}
                                />

                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    style={estilos.input}
                                    value={login.password}
                                    onChange={(e) =>
                                        setLogin({
                                            ...login,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                style={estilos.botonPrincipal}
                            >
                                Iniciar sesión
                            </button>

                            <button
                                type="button"
                                onClick={() => setVista("recuperar")}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#174a8b",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    alignSelf: "center",
                                    marginTop: "2px",
                                }}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </form>

                        <p style={estilos.ayuda}>
                            Accede a tu cuenta de Farmacia Gaby.
                        </p>
                    </>
                ) : vista === "recuperar" ? (
                    <>
                        <h3 style={estilos.titulo}>
                            Recuperar contraseña
                        </h3>

                        <p style={estilos.subtitulo}>
                            Ingresa el correo registrado en Farmacia Gaby para recibir
                            un código de recuperación.
                        </p>

                        <form
                            style={estilos.formulario}
                            onSubmit={handleRecuperacion}
                        >
                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    style={estilos.icono}
                                />

                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                    style={estilos.input}
                                    value={recuperacion.correo}
                                    onChange={(e) =>
                                        setRecuperacion({
                                            ...recuperacion,
                                            correo: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                style={estilos.botonPrincipal}
                            >
                                Enviar código
                            </button>

                            <button
                                type="button"
                                onClick={() => setVista("login")}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#174a8b",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    alignSelf: "center",
                                    marginTop: "2px",
                                }}
                            >
                                Volver a iniciar sesión
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h3 style={estilos.titulo}>
                            Restablecer contraseña
                        </h3>

                        <p style={estilos.subtitulo}>
                            Ingresa el código de 6 dígitos recibido en tu correo y
                            establece una nueva contraseña.
                        </p>

                        <form
                            style={estilos.formulario}
                            onSubmit={handleResetPassword}
                        >
                            {/* CÓDIGO DE RECUPERACIÓN */}
                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faLock}
                                    style={estilos.icono}
                                />

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Código de 6 dígitos"
                                    style={estilos.input}
                                    value={resetPassword.codigo}
                                    onChange={(e) => {
                                        const valor = e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6);

                                        setResetPassword({
                                            ...resetPassword,
                                            codigo: valor,
                                        });
                                    }}
                                    required
                                />
                            </div>

                            {/* NUEVA CONTRASEÑA */}
                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faLock}
                                    style={estilos.icono}
                                />

                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    style={estilos.input}
                                    value={resetPassword.nuevaPassword}
                                    onChange={(e) =>
                                        setResetPassword({
                                            ...resetPassword,
                                            nuevaPassword: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            {/* REQUISITOS DE CONTRASEÑA */}
                            <div
                                style={{
                                    backgroundColor: "#f8fafc",
                                    border: "1px solid #e4e9ef",
                                    borderRadius: "9px",
                                    padding: "12px 14px",
                                    fontSize: "12px",
                                    textAlign: "left",
                                }}
                            >
                                <div
                                    style={{
                                        color: validacionesPassword.longitud
                                            ? "#008f4c"
                                            : "#d92d20",
                                        marginBottom: "5px",
                                        fontWeight: "600",
                                    }}
                                >
                                    {validacionesPassword.longitud ? "✓" : "✕"} Al menos 8 caracteres
                                </div>

                                <div
                                    style={{
                                        color: validacionesPassword.mayuscula
                                            ? "#008f4c"
                                            : "#d92d20",
                                        marginBottom: "5px",
                                        fontWeight: "600",
                                    }}
                                >
                                    {validacionesPassword.mayuscula ? "✓" : "✕"} Una letra mayúscula
                                </div>

                                <div
                                    style={{
                                        color: validacionesPassword.minuscula
                                            ? "#008f4c"
                                            : "#d92d20",
                                        marginBottom: "5px",
                                        fontWeight: "600",
                                    }}
                                >
                                    {validacionesPassword.minuscula ? "✓" : "✕"} Una letra minúscula
                                </div>

                                <div
                                    style={{
                                        color: validacionesPassword.numero
                                            ? "#008f4c"
                                            : "#d92d20",
                                        marginBottom: "5px",
                                        fontWeight: "600",
                                    }}
                                >
                                    {validacionesPassword.numero ? "✓" : "✕"} Un número
                                </div>

                                <div
                                    style={{
                                        color: validacionesPassword.simbolo
                                            ? "#008f4c"
                                            : "#d92d20",
                                        fontWeight: "600",
                                    }}
                                >
                                    {validacionesPassword.simbolo ? "✓" : "✕"} Un símbolo
                                </div>
                            </div>

                            {/* CONFIRMAR CONTRASEÑA */}
                            <div style={estilos.inputGroup}>
                                <FontAwesomeIcon
                                    icon={faLock}
                                    style={estilos.icono}
                                />

                                <input
                                    type="password"
                                    placeholder="Confirmar nueva contraseña"
                                    style={estilos.input}
                                    value={resetPassword.confirmarPassword}
                                    onChange={(e) =>
                                        setResetPassword({
                                            ...resetPassword,
                                            confirmarPassword: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            {resetPassword.confirmarPassword && (
                                <div
                                    style={{
                                        color: passwordsCoinciden
                                            ? "#008f4c"
                                            : "#d92d20",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        textAlign: "left",
                                    }}
                                >
                                    {passwordsCoinciden ? "✓" : "✕"}{" "}
                                    {passwordsCoinciden
                                        ? "Las contraseñas coinciden"
                                        : "Las contraseñas no coinciden"}
                                </div>
                            )}

                            <button
                                type="submit"
                                style={estilos.botonPrincipal}
                            >
                                Restablecer contraseña
                            </button>
                        </form>
                    </>
                )}

                {mensajeRecuperacion.abierto && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(0, 20, 40, 0.55)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 100,
                            borderRadius: "18px",
                            padding: "20px",
                            boxSizing: "border-box",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                width: "100%",
                                maxWidth: "360px",
                                borderRadius: "16px",
                                padding: "28px",
                                textAlign: "center",
                                boxShadow: "0 18px 45px rgba(0, 0, 0, 0.22)",
                                boxSizing: "border-box",
                            }}
                        >
                            <div
                                style={{
                                    width: "54px",
                                    height: "54px",
                                    borderRadius: "50%",
                                    margin: "0 auto 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor:
                                        mensajeRecuperacion.tipo === "error"
                                            ? "#FDECEC"
                                            : "#E8F7EF",
                                    color:
                                        mensajeRecuperacion.tipo === "error"
                                            ? "#D92D20"
                                            : "#008F4C",
                                    fontSize: "26px",
                                    fontWeight: "bold",
                                }}
                            >
                                {mensajeRecuperacion.tipo === "error"
                                    ? "!"
                                    : "✓"}
                            </div>

                            <h3
                                style={{
                                    margin: "0 0 10px",
                                    color: "#174a8b",
                                    fontSize: "22px",
                                }}
                            >
                                {mensajeRecuperacion.tipo === "error"
                                    ? "No pudimos continuar"
                                    : mensajeRecuperacion.tipo === "password_actualizada"
                                        ? "Contraseña restablecida"
                                        : mensajeRecuperacion.tipo === "bienvenida"
                                            ? "¡Bienvenido!"
                                            : "Código enviado"}
                            </h3>

                            <p
                                style={{
                                    margin: "0 0 22px",
                                    color: "#667085",
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                }}
                            >
                                {mensajeRecuperacion.texto}
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    const passwordActualizada =
                                        mensajeRecuperacion.tipo === "password_actualizada";

                                    setMensajeRecuperacion({
                                        abierto: false,
                                        tipo: "",
                                        texto: "",
                                    });

                                    if (passwordActualizada) {
                                        setResetPassword({
                                            codigo: "",
                                            nuevaPassword: "",
                                            confirmarPassword: "",
                                        });

                                        sessionStorage.removeItem("resetEmail");

                                        setVista("login");
                                    } else {
                                        setVista("reset");
                                    }
                                }}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "none",
                                    borderRadius: "9px",
                                    backgroundColor: "#00a859",
                                    color: "#ffffff",
                                    fontWeight: "700",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                }}
                            >
                                {mensajeRecuperacion.tipo === "password_actualizada"
                                    ? "Iniciar sesión"
                                    : "Entendido"}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ModalCuenta;