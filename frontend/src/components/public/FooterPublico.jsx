import { useNavigate } from "react-router-dom";

import logo from "../../assets/FarmaciasGaby.png";

const FooterPublico = () => {
    const navigate = useNavigate();

    return (
        <footer
            style={{
                backgroundColor: "#123d73",
                color: "#ffffff",
            }}
        >
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "55px 35px 35px",
                }}
            >
                {/* CONTENIDO PRINCIPAL */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
                        gap: "50px",
                        paddingBottom: "40px",
                    }}
                >
                    {/* FARMACIA GABY */}
                    <div>
                        <img
                            src={logo}
                            alt="Farmacia Gaby"
                            style={{
                                width: "175px",
                                height: "65px",
                                objectFit: "contain",
                                backgroundColor: "#ffffff",
                                borderRadius: "10px",
                                padding: "6px 12px",
                                boxSizing: "border-box",
                                marginBottom: "20px",
                            }}
                        />

                        <p
                            style={{
                                margin: "0 0 10px",
                                fontSize: "16px",
                                fontWeight: "700",
                            }}
                        >
                            Cuidando la salud del hogar
                        </p>

                        <p
                            style={{
                                margin: 0,
                                maxWidth: "310px",
                                color: "#c9d8e8",
                                fontSize: "13px",
                                lineHeight: "1.7",
                            }}
                        >
                            Encuentra medicamentos, vitaminas, productos de cuidado
                            personal e insumos para el bienestar de tu familia.
                        </p>
                    </div>

                    {/* NAVEGACIÓN */}
                    <div>
                        <h3
                            style={{
                                margin: "0 0 18px",
                                fontSize: "15px",
                            }}
                        >
                            Navegación
                        </h3>

                        {[
                            ["Inicio", "/"],
                            ["Productos", "/productos"],
                            ["Categorías", "/categorias"],
                            ["Enfermedades comunes", "/enfermedades"],
                            ["Ofertas", "/ofertas"],
                            ["Sucursales", "/sucursales"],
                            ["Contáctanos", "/contacto"],
                        ].map(([texto, ruta]) => (
                            <button
                                key={texto}
                                type="button"
                                onClick={() => navigate(ruta)}
                                style={{
                                    display: "block",
                                    border: "none",
                                    padding: "5px 0",
                                    backgroundColor: "transparent",
                                    color: "#c9d8e8",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    textAlign: "left",
                                }}
                            >
                                {texto}
                            </button>
                        ))}
                    </div>

                    {/* ATENCIÓN */}
                    <div>
                        <h3
                            style={{
                                margin: "0 0 18px",
                                fontSize: "15px",
                            }}
                        >
                            Atención al cliente
                        </h3>

                        <p
                            style={{
                                margin: "0 0 10px",
                                color: "#c9d8e8",
                                fontSize: "13px",
                                lineHeight: "1.6",
                            }}
                        >
                            Teléfono:
                            <br />
                            Pendiente de confirmar
                        </p>

                        <p
                            style={{
                                margin: "0 0 10px",
                                color: "#c9d8e8",
                                fontSize: "13px",
                                lineHeight: "1.6",
                            }}
                        >
                            WhatsApp:
                            <br />
                            Pendiente de confirmar
                        </p>

                        <p
                            style={{
                                margin: 0,
                                color: "#c9d8e8",
                                fontSize: "13px",
                                lineHeight: "1.6",
                            }}
                        >
                            Correo:
                            <br />
                            Pendiente de confirmar
                        </p>
                    </div>

                    {/* UBICACIÓN Y HORARIO */}
                    <div>
                        <h3
                            style={{
                                margin: "0 0 18px",
                                fontSize: "15px",
                            }}
                        >
                            Visítanos
                        </h3>

                        <p
                            style={{
                                margin: "0 0 16px",
                                color: "#c9d8e8",
                                fontSize: "13px",
                                lineHeight: "1.7",
                            }}
                        >
                            31 avenida 28-47 Local A Zona 5
                            <br />
                            Colonia Santa Ana
                            <br />
                            Guatemala, Guatemala
                        </p>

                        <h3
                            style={{
                                margin: "20px 0 10px",
                                fontSize: "14px",
                            }}
                        >
                            Horarios de atención
                        </h3>

                        <p
                            style={{
                                margin: 0,
                                color: "#c9d8e8",
                                fontSize: "13px",
                                lineHeight: "1.7",
                            }}
                        >
                            Lunes a viernes: Pendiente
                            <br />
                            Sábado: Pendiente
                            <br />
                            Domingo: Pendiente
                        </p>
                    </div>
                </div>

                {/* PARTE INFERIOR */}
                <div
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.15)",
                        paddingTop: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            color: "#aebfd1",
                            fontSize: "12px",
                        }}
                    >
                        © 2026 Farmacia Gaby. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default FooterPublico;