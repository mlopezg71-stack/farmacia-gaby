const enlaces = [
    "Inicio",
    "Productos",
    "Categorías",
    "Enfermedades comunes",
    "Ofertas",
    "Sucursales",
    "Contáctanos",
];

function BarraNavegacion() {
    return (
        <nav style={{ backgroundColor: "#174a8b" }}>
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "0 35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "45px",
                    height: "48px",
                }}
            >
                {enlaces.map((enlace) => (
                    <span
                        key={enlace}
                        style={{
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {enlace}
                    </span>
                ))}
            </div>
        </nav>
    );
}

export default BarraNavegacion;
