import HeaderPublico from "../../components/public/HeaderPublico";
import FooterPublico from "../../components/public/FooterPublico";

import {
    FaCartPlus,
    FaCheckCircle,
    FaPills,
    FaTags,
    FaPercent,
    FaClock,
} from "react-icons/fa";


// ======================================================
// OFERTAS TEMPORALES PARA DISEÑO
// Posteriormente serán obtenidas desde la BD
// ======================================================

const ofertasTemporales = [
    {
        id: 1,
        nombre: "ACETAMINOFÉN 500 MG",
        categoria: "Analgésicos y Antipiréticos",
        precioAnterior: 32.00,
        precioOferta: 25.60,
        descuento: 20,
        disponible: true,
    },
    {
        id: 2,
        nombre: "VITAMINA C",
        categoria: "Vitaminas y Suplementos",
        precioAnterior: 55.00,
        precioOferta: 44.00,
        descuento: 20,
        disponible: true,
    },
    {
        id: 3,
        nombre: "JARABE PARA LA TOS",
        categoria: "Respiratorios y Antigripales",
        precioAnterior: 48.50,
        precioOferta: 38.80,
        descuento: 20,
        disponible: true,
    },
    {
        id: 4,
        nombre: "ALCOHOL ANTISÉPTICO",
        categoria: "Antisépticos y Desinfectantes",
        precioAnterior: 28.00,
        precioOferta: 22.40,
        descuento: 20,
        disponible: true,
    },
    {
        id: 5,
        nombre: "SUERO ORAL",
        categoria: "Hidratación y Sueros Orales",
        precioAnterior: 15.00,
        precioOferta: 12.00,
        descuento: 20,
        disponible: true,
    },
    {
        id: 6,
        nombre: "CREMA DERMATOLÓGICA",
        categoria: "Dermatológicos",
        precioAnterior: 65.00,
        precioOferta: 52.00,
        descuento: 20,
        disponible: true,
    },
    {
        id: 7,
        nombre: "MULTIVITAMÍNICO",
        categoria: "Vitaminas y Suplementos",
        precioAnterior: 85.00,
        precioOferta: 68.00,
        descuento: 20,
        disponible: true,
    },
    {
        id: 8,
        nombre: "ANTIGRIPAL TABLETAS",
        categoria: "Respiratorios y Antigripales",
        precioAnterior: 40.00,
        precioOferta: 32.00,
        descuento: 20,
        disponible: true,
    },
];


const Ofertas = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
            }}
        >
            <HeaderPublico />

            <main>
                {/* =========================================
                    HERO / BANNER
                ========================================= */}
                <section
                    style={{
                        background:
                            "linear-gradient(135deg, #174a8b 0%, #123d73 100%)",
                        color: "#ffffff",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "1400px",
                            margin: "0 auto",
                            padding: "55px 35px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "35px",
                            flexWrap: "wrap",
                        }}
                    >
                        <div
                            style={{
                                maxWidth: "720px",
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backgroundColor:
                                        "rgba(255,255,255,0.12)",
                                    padding: "7px 13px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    marginBottom: "17px",
                                }}
                            >
                                <FaTags />

                                Promociones especiales
                            </div>

                            <h1
                                style={{
                                    margin: "0 0 12px",
                                    fontSize: "36px",
                                    fontWeight: "800",
                                }}
                            >
                                Ofertas y promociones
                            </h1>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#d9e5f1",
                                    fontSize: "15px",
                                    lineHeight: "1.7",
                                }}
                            >
                                Aprovecha precios especiales en productos
                                seleccionados para el cuidado de tu salud y
                                bienestar.
                            </p>
                        </div>

                        <div
                            style={{
                                width: "115px",
                                height: "115px",
                                borderRadius: "50%",
                                backgroundColor:
                                    "rgba(255,255,255,0.12)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <FaPercent
                                style={{
                                    fontSize: "50px",
                                    color: "#ffffff",
                                }}
                            />
                        </div>
                    </div>
                </section>


                {/* =========================================
                    AVISO DE PROMOCIONES
                ========================================= */}
                <section
                    style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        padding: "35px 35px 0",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fffaf0",
                            border: "1px solid #f5dfb3",
                            borderRadius: "12px",
                            padding: "16px 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "13px",
                        }}
                    >
                        <FaClock
                            style={{
                                color: "#d49b28",
                                fontSize: "22px",
                                flexShrink: 0,
                            }}
                        />

                        <p
                            style={{
                                margin: 0,
                                color: "#80642b",
                                fontSize: "13px",
                                lineHeight: "1.5",
                            }}
                        >
                            Las promociones están sujetas a disponibilidad
                            de inventario y pueden cambiar sin previo aviso.
                        </p>
                    </div>
                </section>


                {/* =========================================
                    PRODUCTOS EN OFERTA
                ========================================= */}
                <section
                    style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        padding: "40px 35px 70px",
                    }}
                >
                    <div
                        style={{
                            marginBottom: "28px",
                        }}
                    >
                        <h2
                            style={{
                                margin: "0 0 7px",
                                color: "#174a8b",
                                fontSize: "25px",
                                fontWeight: "800",
                            }}
                        >
                            Productos en oferta
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                color: "#7b8794",
                                fontSize: "13px",
                            }}
                        >
                            Descubre los productos seleccionados con precios
                            especiales.
                        </p>
                    </div>


                    {/* GRID */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "22px",
                        }}
                    >
                        {ofertasTemporales.map((producto) => (
                            <div
                                key={producto.id}
                                style={{
                                    position: "relative",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "14px",
                                    overflow: "hidden",
                                    boxShadow:
                                        "0 4px 14px rgba(15, 23, 42, 0.04)",
                                }}
                            >
                                {/* DESCUENTO */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "13px",
                                        left: "13px",
                                        zIndex: 2,
                                        backgroundColor: "#e63946",
                                        color: "#ffffff",
                                        padding: "6px 10px",
                                        borderRadius: "20px",
                                        fontSize: "11px",
                                        fontWeight: "800",
                                    }}
                                >
                                    -{producto.descuento}%
                                </div>


                                {/* ÁREA VISUAL */}
                                <div
                                    style={{
                                        height: "165px",
                                        backgroundColor: "#f5f9fc",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "75px",
                                            height: "75px",
                                            borderRadius: "50%",
                                            backgroundColor: "#e8f7ef",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <FaPills
                                            style={{
                                                color: "#00a859",
                                                fontSize: "34px",
                                            }}
                                        />
                                    </div>
                                </div>


                                {/* INFORMACIÓN */}
                                <div
                                    style={{
                                        padding: "18px",
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "#00a859",
                                            fontSize: "11px",
                                            fontWeight: "800",
                                            textTransform: "uppercase",
                                            marginBottom: "7px",
                                            minHeight: "28px",
                                        }}
                                    >
                                        {producto.categoria}
                                    </div>

                                    <h3
                                        style={{
                                            margin: "0 0 14px",
                                            color: "#174a8b",
                                            fontSize: "15px",
                                            lineHeight: "1.4",
                                            minHeight: "42px",
                                        }}
                                    >
                                        {producto.nombre}
                                    </h3>


                                    {/* PRECIO ANTERIOR */}
                                    <div
                                        style={{
                                            color: "#9ca3af",
                                            fontSize: "12px",
                                            marginBottom: "3px",
                                        }}
                                    >
                                        Antes:{" "}
                                        <span
                                            style={{
                                                textDecoration:
                                                    "line-through",
                                            }}
                                        >
                                            Q
                                            {producto.precioAnterior.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>


                                    {/* PRECIO OFERTA */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "10px",
                                            marginBottom: "17px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "#e63946",
                                                fontSize: "22px",
                                                fontWeight: "800",
                                            }}
                                        >
                                            Q
                                            {producto.precioOferta.toFixed(
                                                2
                                            )}
                                        </span>

                                        <span
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                color: "#00a859",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            <FaCheckCircle />

                                            Disponible
                                        </span>
                                    </div>


                                    {/* BOTÓN */}
                                    <button
                                        type="button"
                                        style={{
                                            width: "100%",
                                            height: "42px",
                                            border: "none",
                                            borderRadius: "8px",
                                            backgroundColor: "#174a8b",
                                            color: "#ffffff",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <FaCartPlus />

                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* =====================================
                        NOTA TEMPORAL DE DESARROLLO
                    ===================================== */}
                    <div
                        style={{
                            marginTop: "30px",
                            padding: "13px 16px",
                            backgroundColor: "#eef6ff",
                            border: "1px solid #cfe2f5",
                            borderRadius: "9px",
                            color: "#52657a",
                            fontSize: "11px",
                            lineHeight: "1.5",
                            textAlign: "center",
                        }}
                    >
                        Los productos, precios, descuentos y disponibilidad
                        mostrados actualmente son temporales durante la fase
                        de diseño. Posteriormente esta información será
                        administrada desde el inventario de Farmacia Gaby.
                    </div>
                </section>
            </main>

            <FooterPublico />
        </div>
    );
};

export default Ofertas;