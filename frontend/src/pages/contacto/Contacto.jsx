import HeaderPublico from "../../components/public/HeaderPublico";
import FooterPublico from "../../components/public/FooterPublico";

import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaComments,
    FaDirections,
} from "react-icons/fa";

const Contacto = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
            }}
        >
            <HeaderPublico />

            <main>
                {/* HERO */}
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
                                <FaComments />
                                Estamos para ayudarte
                            </div>

                            <h1
                                style={{
                                    margin: "0 0 12px",
                                    fontSize: "36px",
                                    fontWeight: "800",
                                }}
                            >
                                Contáctanos
                            </h1>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#d9e5f1",
                                    fontSize: "15px",
                                    lineHeight: "1.7",
                                }}
                            >
                                ¿Tienes alguna consulta? Comunícate con
                                Farmacia Gaby y con gusto te atenderemos.
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
                            <FaEnvelope
                                style={{
                                    fontSize: "46px",
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* CONTENIDO */}
                <section
                    style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        padding: "45px 35px 70px",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(380px, 1fr))",
                            gap: "30px",
                            alignItems: "start",
                        }}
                    >
                        {/* INFORMACIÓN */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "16px",
                                padding: "30px",
                            }}
                        >
                            <h2
                                style={{
                                    margin: "0 0 8px",
                                    color: "#174a8b",
                                    fontSize: "23px",
                                    fontWeight: "800",
                                }}
                            >
                                Información de contacto
                            </h2>

                            <p
                                style={{
                                    margin: "0 0 28px",
                                    color: "#7b8794",
                                    fontSize: "13px",
                                    lineHeight: "1.6",
                                }}
                            >
                                Puedes visitarnos o comunicarte con nosotros
                                por nuestros medios de atención.
                            </p>

                            {/* DIRECCIÓN */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "14px",
                                    marginBottom: "25px",
                                }}
                            >
                                <FaMapMarkerAlt
                                    style={{
                                        color: "#00a859",
                                        fontSize: "20px",
                                        marginTop: "2px",
                                    }}
                                />

                                <div>
                                    <strong
                                        style={{
                                            display: "block",
                                            color: "#174a8b",
                                            fontSize: "13px",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        Dirección
                                    </strong>

                                    <span
                                        style={{
                                            color: "#52657a",
                                            fontSize: "13px",
                                            lineHeight: "1.6",
                                        }}
                                    >
                                        28-57 31 Avenida
                                        <br />
                                        Zona 5
                                        <br />
                                        Ciudad de Guatemala, Guatemala
                                    </span>
                                </div>
                            </div>

                            {/* TELÉFONO */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "14px",
                                    marginBottom: "25px",
                                }}
                            >
                                <FaPhoneAlt
                                    style={{
                                        color: "#00a859",
                                        fontSize: "18px",
                                        marginTop: "2px",
                                    }}
                                />

                                <div>
                                    <strong
                                        style={{
                                            display: "block",
                                            color: "#174a8b",
                                            fontSize: "13px",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        Teléfono
                                    </strong>

                                    <span
                                        style={{
                                            color: "#52657a",
                                            fontSize: "13px",
                                        }}
                                    >
                                        Pendiente de confirmar
                                    </span>
                                </div>
                            </div>

                            {/* CORREO */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "14px",
                                }}
                            >
                                <FaEnvelope
                                    style={{
                                        color: "#00a859",
                                        fontSize: "18px",
                                        marginTop: "2px",
                                    }}
                                />

                                <div>
                                    <strong
                                        style={{
                                            display: "block",
                                            color: "#174a8b",
                                            fontSize: "13px",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        Correo electrónico
                                    </strong>

                                    <span
                                        style={{
                                            color: "#52657a",
                                            fontSize: "13px",
                                        }}
                                    >
                                        Pendiente de confirmar
                                    </span>
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
                                                "https://maps.app.goo.gl/nru647yTwkeaQSsq6",
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
                                                "https://waze.com/ul/h9fxeht6sf",
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
                        </div>

                        {/* FORMULARIO - SIGUIENTE PASO */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "16px",
                                padding: "30px",
                                minHeight: "360px",
                            }}
                        >
                            <h2
                                style={{
                                    margin: "0 0 8px",
                                    color: "#174a8b",
                                    fontSize: "23px",
                                    fontWeight: "800",
                                }}
                            >
                                Envíanos un mensaje
                            </h2>

                            {/* FORMULARIO */}
                            <form
                                style={{
                                    marginTop: "28px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "18px",
                                }}
                            >
                                {/* NOMBRE */}
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "7px",
                                            color: "#174a8b",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                        }}
                                    >
                                        Nombre completo
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Ingresa tu nombre"
                                        style={{
                                            width: "100%",
                                            height: "44px",
                                            padding: "0 13px",
                                            border: "1px solid #d8e0e8",
                                            borderRadius: "8px",
                                            outline: "none",
                                            fontSize: "13px",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                </div>

                                {/* CORREO Y TELÉFONO */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "15px",
                                    }}
                                >
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                color: "#174a8b",
                                                fontSize: "12px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            Correo electrónico
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            style={{
                                                width: "100%",
                                                height: "44px",
                                                padding: "0 13px",
                                                border: "1px solid #d8e0e8",
                                                borderRadius: "8px",
                                                outline: "none",
                                                fontSize: "13px",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                color: "#174a8b",
                                                fontSize: "12px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            Teléfono
                                        </label>

                                        <input
                                            type="tel"
                                            placeholder="Ej. 5555-5555"
                                            style={{
                                                width: "100%",
                                                height: "44px",
                                                padding: "0 13px",
                                                border: "1px solid #d8e0e8",
                                                borderRadius: "8px",
                                                outline: "none",
                                                fontSize: "13px",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* ASUNTO */}
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "7px",
                                            color: "#174a8b",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                        }}
                                    >
                                        Asunto
                                    </label>

                                    <select
                                        defaultValue=""
                                        style={{
                                            width: "100%",
                                            height: "44px",
                                            padding: "0 13px",
                                            border: "1px solid #d8e0e8",
                                            borderRadius: "8px",
                                            outline: "none",
                                            backgroundColor: "#ffffff",
                                            color: "#52657a",
                                            fontSize: "13px",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        <option value="" disabled>
                                            Selecciona un asunto
                                        </option>

                                        <option value="productos">
                                            Consulta sobre productos
                                        </option>

                                        <option value="disponibilidad">
                                            Disponibilidad de medicamentos
                                        </option>

                                        <option value="pedidos">
                                            Consulta sobre pedidos
                                        </option>

                                        <option value="sucursal">
                                            Información de la sucursal
                                        </option>

                                        <option value="otros">
                                            Otros
                                        </option>
                                    </select>
                                </div>

                                {/* MENSAJE */}
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "7px",
                                            color: "#174a8b",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                        }}
                                    >
                                        Mensaje
                                    </label>

                                    <textarea
                                        placeholder="Escribe tu consulta..."
                                        rows={6}
                                        style={{
                                            width: "100%",
                                            padding: "13px",
                                            border: "1px solid #d8e0e8",
                                            borderRadius: "8px",
                                            outline: "none",
                                            resize: "vertical",
                                            fontFamily: "inherit",
                                            fontSize: "13px",
                                            lineHeight: "1.5",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                </div>

                                {/* BOTÓN */}
                                <button
                                    type="button"
                                    style={{
                                        width: "100%",
                                        height: "46px",
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
                                    <FaEnvelope />
                                    Enviar mensaje
                                </button>

                                <p
                                    style={{
                                        margin: 0,
                                        color: "#8a97a6",
                                        fontSize: "11px",
                                        lineHeight: "1.5",
                                        textAlign: "center",
                                    }}
                                >
                                    Nos comunicaremos contigo utilizando los datos proporcionados
                                    para atender tu consulta.
                                </p>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <FooterPublico />
        </div>
    );
};

export default Contacto;