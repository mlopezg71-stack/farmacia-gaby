import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
    const [correo, setCorreo] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        setErrorMsg("");
        setSuccessMsg("");
        setCargando(true);

        try {
            const res = await axios.post(
                "http://localhost:3001/api/auth/recuperar-password",
                {
                    correo,
                }
            );

            setSuccessMsg(res.data.message);

            // Guardamos temporalmente el correo para la siguiente pantalla
            sessionStorage.setItem("resetEmail", correo);

            // Después de solicitar el código,
            // enviamos al usuario a la pantalla para restablecer contraseña.
            navigate("/reset-password");
        } catch (err) {
            console.log(
                "Error al solicitar recuperación de contraseña:",
                err
            );

            const mensaje = err.response?.data?.message;

            if (!err.response) {
                setErrorMsg(
                    "No se pudo conectar con el servidor. Verifica tu conexión."
                );
                return;
            }

            setErrorMsg(
                mensaje ||
                "No fue posible procesar la recuperación de contraseña."
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                backgroundColor: "#f4f7f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    backgroundColor: "#FFFFFF",
                    padding: "40px",
                    borderRadius: "18px",
                    maxWidth: "440px",
                    width: "100%",
                    textAlign: "center",
                    boxShadow: "0 10px 30px rgba(0, 43, 92, 0.12)",
                    margin: "20px",
                    border: "1px solid #e5e7eb",
                }}
            >
                <img
                    src="/FGLogo.png"
                    alt="Farmacia Gaby"
                    style={{
                        width: "190px",
                        height: "auto",
                        margin: "0 auto 20px auto",
                        display: "block",
                    }}
                />

                <h2
                    style={{
                        color: "#082b4f",
                        marginBottom: "8px",
                    }}
                >
                    Recuperar contraseña
                </h2>

                <p
                    style={{
                        fontSize: "14px",
                        color: "#667085",
                        marginBottom: "24px",
                        lineHeight: "1.5",
                    }}
                >
                    Ingresa el correo registrado en Farmacia Gaby.
                    Si existe una cuenta asociada, recibirás un código
                    de recuperación.
                </p>

                <form onSubmit={handleForgotPassword}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "13px 14px",
                            marginBottom: "15px",
                            borderRadius: "9px",
                            border: "1px solid #d0d5dd",
                            backgroundColor: "#FFFFFF",
                            color: "#082b4f",
                            fontSize: "15px",
                            outline: "none",
                        }}
                    />

                    <button
                        type="submit"
                        disabled={cargando}
                        style={{
                            width: "100%",
                            backgroundColor: "#008f4c",
                            color: "#FFFFFF",
                            padding: "13px",
                            border: "none",
                            borderRadius: "9px",
                            cursor: cargando
                                ? "not-allowed"
                                : "pointer",
                            fontWeight: "bold",
                            fontSize: "15px",
                            opacity: cargando ? 0.7 : 1,
                        }}
                    >
                        {cargando
                            ? "Enviando..."
                            : "Enviar código"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    style={{
                        marginTop: "18px",
                        background: "none",
                        border: "none",
                        color: "#082b4f",
                        cursor: "pointer",
                        fontWeight: "bold",
                        textDecoration: "underline",
                    }}
                >
                    Volver al inicio
                </button>

                {errorMsg && (
                    <p
                        style={{
                            color: "#d92d20",
                            marginTop: "15px",
                            fontSize: "14px",
                        }}
                    >
                        {errorMsg}
                    </p>
                )}

                {successMsg && (
                    <p
                        style={{
                            color: "#008f4c",
                            marginTop: "15px",
                            fontSize: "14px",
                        }}
                    >
                        {successMsg}
                    </p>
                )}
            </div>
        </div>
    );
}