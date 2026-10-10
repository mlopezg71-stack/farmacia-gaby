import logo from "../assets/FarmaciasGaby.png";

function Encabezado({ cantidadItems, busqueda, alCambiarBusqueda, alAbrirCarrito }) {
    return (
        <header
            style={{
                width: "100%",
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #e8e8e8",
            }}
        >
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "16px 35px",
                    display: "flex",
                    alignItems: "center",
                    gap: "35px",
                }}
            >
                <img
                    src={logo}
                    alt="Farmacia Gaby"
                    style={{
                        width: "185px",
                        height: "65px",
                        objectFit: "contain",
                    }}
                />

                <div style={{ flex: 1, position: "relative" }}>
                    <input
                        type="text"
                        placeholder="¿Qué producto estás buscando?"
                        value={busqueda}
                        onChange={(event) => alCambiarBusqueda(event.target.value)}
                        style={{
                            width: "100%",
                            height: "48px",
                            border: "1px solid #d8d8d8",
                            borderRadius: "24px",
                            padding: "0 55px 0 22px",
                            fontSize: "15px",
                            outline: "none",
                            boxSizing: "border-box",
                            backgroundColor: "#f8f9fa",
                        }}
                    />

                    <button
                        type="button"
                        style={{
                            position: "absolute",
                            right: "5px",
                            top: "5px",
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: "#00a651",
                            color: "#ffffff",
                            fontSize: "17px",
                            cursor: "pointer",
                        }}
                    >
                        🔍
                    </button>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "25px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#174a8b",
                            fontWeight: "600",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        <span style={{ fontSize: "23px" }}>👤</span>
                        <span>Mi cuenta</span>
                    </div>

                    <div
                        onClick={alAbrirCarrito}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            color: "#174a8b",
                            fontWeight: "600",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                            position: "relative",
                        }}
                    >
                        <span style={{ fontSize: "23px" }}>🛒</span>
                        <span>Carrito</span>

                        <span
                            style={{
                                position: "absolute",
                                top: "-10px",
                                right: "-10px",
                                backgroundColor: "#00a651",
                                color: "#ffffff",
                                width: "19px",
                                height: "19px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: "bold",
                            }}
                        >
                            {cantidadItems}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Encabezado;
