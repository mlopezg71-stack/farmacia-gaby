import HeaderPublico from "../../components/public/HeaderPublico";
import FooterPublico from "../../components/public/FooterPublico";

import {
    FaMapMarkerAlt,
    FaClock,
    FaPhoneAlt,
    FaDirections,
    FaStore,
    FaCheckCircle,
} from "react-icons/fa";

const sucursales = [
    {
        id: 1,
        nombre: "Farmacia Gaby",
        direccion: "28-57 31 Avenida",
        sector: "Zona 5",
        ciudad: "Ciudad de Guatemala, Guatemala",
        telefono: "Pendiente de confirmar",
        horarioSemana: "Pendiente de confirmar",
        horarioSabado: "Pendiente de confirmar",
        horarioDomingo: "Pendiente de confirmar",
        estado: "Disponible",

        googleMaps:
            "https://maps.app.goo.gl/nru647yTwkeaQSsq6",

        waze:
            "https://waze.com/ul/h9fxeht6sf",
    },
];

const Sucursales = () => {
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
                    HERO
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
                                <FaMapMarkerAlt />

                                Encuéntranos
                            </div>

                            <h1
                                style={{
                                    margin: "0 0 12px",
                                    fontSize: "36px",
                                    fontWeight: "800",
                                }}
                            >
                                Nuestras sucursales
                            </h1>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#d9e5f1",
                                    fontSize: "15px",
                                    lineHeight: "1.7",
                                }}
                            >
                                Consulta nuestras ubicaciones y encuentra
                                la Farmacia Gaby más conveniente para ti.
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
                            <FaStore
                                style={{
                                    fontSize: "48px",
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* =========================================
                    CONTENIDO
                ========================================= */}
                <section
                    style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        padding: "45px 35px 70px",
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
                            Encuentra tu farmacia
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                color: "#7b8794",
                                fontSize: "13px",
                            }}
                        >
                            Consulta dirección, horarios y datos de contacto
                            de nuestras ubicaciones.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(380px, 1fr))",
                            gap: "25px",
                        }}
                    >
                        {sucursales.map((sucursal) => (
                            <article
                                key={sucursal.id}
                                style={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    boxShadow:
                                        "0 4px 14px rgba(15, 23, 42, 0.04)",
                                }}
                            >
                                {/* MAPA REAL DE LA SUCURSAL */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "300px",
                                        overflow: "hidden",
                                        backgroundColor: "#eef4f8",
                                    }}
                                >
                                    <iframe
                                        title={`Ubicación de ${sucursal.nombre}`}
                                        src="https://www.google.com/maps?q=14.6195278,-90.5043483&z=17&output=embed"
                                        width="100%"
                                        height="100%"
                                        style={{
                                            border: 0,
                                            display: "block",
                                        }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>

                                {/* INFORMACIÓN */}
                                <div
                                    style={{
                                        padding: "25px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            gap: "15px",
                                            marginBottom: "22px",
                                        }}
                                    >
                                        <div>
                                            <h3
                                                style={{
                                                    margin: "0 0 5px",
                                                    color: "#174a8b",
                                                    fontSize: "20px",
                                                    fontWeight: "800",
                                                }}
                                            >
                                                {sucursal.nombre}
                                            </h3>

                                            <span
                                                style={{
                                                    color: "#7b8794",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {sucursal.ciudad}
                                            </span>
                                        </div>

                                        <span
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                backgroundColor: "#e8f7ef",
                                                color: "#00a859",
                                                borderRadius: "20px",
                                                padding: "6px 10px",
                                                fontSize: "10px",
                                                fontWeight: "800",
                                            }}
                                        >
                                            <FaCheckCircle />

                                            {sucursal.estado}
                                        </span>
                                    </div>

                                    {/* DIRECCIÓN */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "12px",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        <FaMapMarkerAlt
                                            style={{
                                                color: "#00a859",
                                                marginTop: "3px",
                                                flexShrink: 0,
                                            }}
                                        />

                                        <div
                                            style={{
                                                color: "#52657a",
                                                fontSize: "13px",
                                                lineHeight: "1.6",
                                            }}
                                        >
                                            {sucursal.direccion}
                                            <br />
                                            {sucursal.sector}
                                            <br />
                                            {sucursal.ciudad}
                                        </div>
                                    </div>

                                    {/* TELÉFONO */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "12px",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        <FaPhoneAlt
                                            style={{
                                                color: "#00a859",
                                                marginTop: "3px",
                                                flexShrink: 0,
                                            }}
                                        />

                                        <div>
                                            <div
                                                style={{
                                                    color: "#174a8b",
                                                    fontSize: "12px",
                                                    fontWeight: "800",
                                                    marginBottom: "3px",
                                                }}
                                            >
                                                Teléfono
                                            </div>

                                            <div
                                                style={{
                                                    color: "#52657a",
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {sucursal.telefono}
                                            </div>
                                        </div>
                                    </div>

                                    {/* HORARIOS */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "12px",
                                            marginBottom: "25px",
                                        }}
                                    >
                                        <FaClock
                                            style={{
                                                color: "#00a859",
                                                marginTop: "3px",
                                                flexShrink: 0,
                                            }}
                                        />

                                        <div
                                            style={{
                                                width: "100%",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    color: "#174a8b",
                                                    fontSize: "12px",
                                                    fontWeight: "800",
                                                    marginBottom: "7px",
                                                }}
                                            >
                                                Horarios de atención
                                            </div>

                                            <div
                                                style={{
                                                    color: "#52657a",
                                                    fontSize: "12px",
                                                    lineHeight: "1.8",
                                                }}
                                            >
                                                Lunes a viernes:{" "}
                                                {sucursal.horarioSemana}
                                                <br />

                                                Sábado:{" "}
                                                {sucursal.horarioSabado}
                                                <br />

                                                Domingo:{" "}
                                                {sucursal.horarioDomingo}
                                            </div>
                                        </div>
                                    </div>

                                    {/* BOTONES DE UBICACIÓN */}
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "10px",
                                        }}
                                    >
                                        {/* GOOGLE MAPS */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.open(
                                                    sucursal.googleMaps,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                )
                                            }
                                            style={{
                                                height: "44px",
                                                border: "none",
                                                borderRadius: "8px",
                                                backgroundColor: "#00a859",
                                                color: "#ffffff",
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "8px",
                                            }}
                                        >
                                            <FaMapMarkerAlt />
                                            Google Maps
                                        </button>

                                        {/* WAZE */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.open(
                                                    sucursal.waze,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                )
                                            }
                                            style={{
                                                height: "44px",
                                                border: "none",
                                                borderRadius: "8px",
                                                backgroundColor: "#174a8b",
                                                color: "#ffffff",
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "8px",
                                            }}
                                        >
                                            <FaDirections />
                                            Waze
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>


                </section>
            </main>

            <FooterPublico />
        </div>
    );
};

export default Sucursales;