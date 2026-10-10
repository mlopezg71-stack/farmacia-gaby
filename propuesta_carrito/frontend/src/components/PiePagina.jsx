import logo from "../assets/FarmaciasGaby.png";

function PiePagina() {
    return (
        <footer style={{ backgroundColor: "#123d73", color: "#ffffff", marginTop: "60px" }}>
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "55px 35px 35px",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
                        gap: "50px",
                        paddingBottom: "40px",
                    }}
                >
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

                        <p style={{ margin: "0 0 10px", fontSize: "16px", fontWeight: "700" }}>
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

                    <div>
                        <h3 style={{ margin: "0 0 18px", fontSize: "15px" }}>
                            Navegación
                        </h3>

                        {["Inicio", "Productos", "Ofertas", "Sucursales"].map((enlace) => (
                            <p
                                key={enlace}
                                style={{ margin: "0 0 12px", color: "#c9d8e8", fontSize: "13px" }}
                            >
                                {enlace}
                            </p>
                        ))}
                    </div>

                    <div>
                        <h3 style={{ margin: "0 0 18px", fontSize: "15px" }}>
                            Ayuda
                        </h3>

                        {["Contáctanos", "Preguntas frecuentes", "Términos y condiciones"].map((enlace) => (
                            <p
                                key={enlace}
                                style={{ margin: "0 0 12px", color: "#c9d8e8", fontSize: "13px" }}
                            >
                                {enlace}
                            </p>
                        ))}
                    </div>

                    <div>
                        <h3 style={{ margin: "0 0 18px", fontSize: "15px" }}>
                            Contacto
                        </h3>

                        <p style={{ margin: "0 0 12px", color: "#c9d8e8", fontSize: "13px" }}>
                            Teléfono: (502) 0000-0000
                        </p>

                        <p style={{ margin: "0 0 12px", color: "#c9d8e8", fontSize: "13px" }}>
                            Correo: contacto@farmaciagaby.com
                        </p>

                        <p style={{ margin: 0, color: "#c9d8e8", fontSize: "13px" }}>
                            Guatemala
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                        paddingTop: "22px",
                        color: "#c9d8e8",
                        fontSize: "12px",
                        textAlign: "center",
                    }}
                >
                    Farmacia Gaby - Propuesta de carrito
                </div>
            </div>
        </footer>
    );
}

export default PiePagina;
