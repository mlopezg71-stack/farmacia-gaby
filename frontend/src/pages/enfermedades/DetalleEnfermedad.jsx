import { useNavigate, useParams } from "react-router-dom";
import HeaderPublico from "../../components/public/HeaderPublico";
import FooterPublico from "../../components/public/FooterPublico";

import {
    MdOutlineHealthAndSafety,
    MdArrowBack,
} from "react-icons/md";

import {
    FaCartPlus,
    FaCheckCircle,
    FaPills,
} from "react-icons/fa";


// ======================================================
// INFORMACIÓN DE CADA NECESIDAD
// ======================================================

const enfermedades = {
    // DOLOR Y MALESTAR
    "dolor-de-cabeza": {
        titulo: "Dolor de cabeza",
        descripcion:
            "Explora productos relacionados con el alivio del dolor de cabeza.",
    },

    "migrana": {
        titulo: "Migraña",
        descripcion:
            "Explora productos relacionados con el alivio de la migraña.",
    },

    "fiebre": {
        titulo: "Fiebre",
        descripcion:
            "Consulta productos relacionados con el alivio de la fiebre.",
    },

    "dolor-muscular": {
        titulo: "Dolor muscular",
        descripcion:
            "Explora productos relacionados con dolor y molestias musculares.",
    },

    "dolor-articular": {
        titulo: "Dolor articular",
        descripcion:
            "Consulta productos relacionados con dolor y molestias articulares.",
    },

    "dolor-e-inflamacion": {
        titulo: "Dolor e inflamación",
        descripcion:
            "Explora productos relacionados con dolor e inflamación.",
    },


    // RESPIRATORIO
    "tos": {
        titulo: "Tos",
        descripcion:
            "Explora productos relacionados con el alivio de la tos.",
    },

    "tos-con-flema": {
        titulo: "Tos con flema y expectoración",
        descripcion:
            "Consulta productos relacionados con tos acompañada de flema y expectoración.",
    },

    "gripe-y-resfriado": {
        titulo: "Gripe y resfriado",
        descripcion:
            "Explora productos relacionados con síntomas comunes de gripe y resfriado.",
    },

    "congestion-nasal": {
        titulo: "Congestión nasal",
        descripcion:
            "Consulta productos relacionados con molestias de congestión nasal.",
    },

    "alergias-respiratorias": {
        titulo: "Alergias respiratorias",
        descripcion:
            "Explora productos relacionados con síntomas frecuentes de alergia.",
    },


    // DIGESTIVO
    "acidez-y-reflujo": {
        titulo: "Acidez y reflujo",
        descripcion:
            "Consulta productos relacionados con molestias de acidez y reflujo.",
    },

    "indigestion": {
        titulo: "Indigestión",
        descripcion:
            "Explora productos relacionados con molestias digestivas.",
    },

    "gases": {
        titulo: "Gases",
        descripcion:
            "Consulta productos relacionados con molestias ocasionadas por gases.",
    },

    "nauseas-y-vomitos": {
        titulo: "Náuseas y vómitos",
        descripcion:
            "Explora productos relacionados con náuseas y malestar estomacal.",
    },

    "diarrea": {
        titulo: "Diarrea",
        descripcion:
            "Consulta productos relacionados con esta necesidad digestiva.",
    },

    "estrenimiento": {
        titulo: "Estreñimiento",
        descripcion:
            "Explora productos relacionados con esta necesidad digestiva.",
    },

    "colicos-y-espasmos": {
        titulo: "Cólicos y espasmos digestivos",
        descripcion:
            "Consulta productos relacionados con cólicos y espasmos digestivos.",
    },

    "hemorroides": {
        titulo: "Hemorroides",
        descripcion:
            "Explora productos relacionados con el cuidado y alivio de molestias asociadas.",
    },


    // PIEL
    "hongos-de-la-piel": {
        titulo: "Hongos de la piel",
        descripcion:
            "Consulta productos de cuidado relacionados con hongos de la piel.",
    },

    "irritacion-de-la-piel": {
        titulo: "Irritación de la piel",
        descripcion:
            "Explora productos relacionados con el cuidado de piel irritada.",
    },

    "cuidado-de-heridas": {
        titulo: "Cuidado de heridas",
        descripcion:
            "Consulta productos e insumos relacionados con limpieza, protección y cuidado de heridas.",
    },

    "cuidado-de-la-piel": {
        titulo: "Resequedad y cuidado de la piel",
        descripcion:
            "Explora productos relacionados con hidratación y cuidado general de la piel.",
    },


    // HIDRATACIÓN Y NUTRICIÓN
    "deshidratacion": {
        titulo: "Deshidratación",
        descripcion:
            "Consulta productos de hidratación y reposición de líquidos.",
    },

    "vitaminas-y-minerales": {
        titulo: "Vitaminas y minerales",
        descripcion:
            "Explora vitaminas, minerales y productos de suplementación disponibles.",
    },

    "suplementacion": {
        titulo: "Suplementación",
        descripcion:
            "Consulta productos relacionados con suplementación nutricional.",
    },

    "cuidado-prenatal": {
        titulo: "Cuidado prenatal",
        descripcion:
            "Explora productos relacionados con suplementación y cuidado durante el embarazo.",
    },


    // OJOS Y OÍDOS
    "cuidado-ocular": {
        titulo: "Molestias y cuidado ocular",
        descripcion:
            "Consulta productos relacionados con el cuidado de los ojos.",
    },

    "ojos-secos": {
        titulo: "Ojos secos",
        descripcion:
            "Explora productos relacionados con lubricación y cuidado ocular.",
    },

    "cuidado-otico": {
        titulo: "Cuidado ótico",
        descripcion:
            "Consulta productos relacionados con el cuidado de los oídos.",
    },


    // SALUD Y BIENESTAR
    "parasitos-intestinales": {
        titulo: "Parásitos intestinales",
        descripcion:
            "Explora productos de la categoría de antiparasitarios.",
    },

    "salud-cardiovascular": {
        titulo: "Salud cardiovascular",
        descripcion:
            "Consulta productos relacionados con el cuidado cardiovascular.",
    },

    "salud-sexual-y-reproductiva": {
        titulo: "Salud sexual y reproductiva",
        descripcion:
            "Explora productos relacionados con salud sexual y reproductiva.",
    },

    "planificacion-familiar": {
        titulo: "Planificación familiar",
        descripcion:
            "Consulta productos relacionados con planificación familiar.",
    },

    "pruebas-de-embarazo": {
        titulo: "Pruebas de embarazo",
        descripcion:
            "Consulta las pruebas de embarazo disponibles en Farmacia Gaby.",
    },
};


// ======================================================
// PRODUCTOS TEMPORALES PARA DISEÑO
// Posteriormente serán reemplazados por datos de la BD
// ======================================================

const productosTemporales = [
    {
        id: 1,
        nombre: "ACETAMINOFÉN 500 MG",
        categoria: "Analgésicos y Antipiréticos",
        precio: 25.36,
        disponible: true,
    },
    {
        id: 2,
        nombre: "IBUPROFENO 400 MG",
        categoria: "Antiinflamatorios (AINEs)",
        precio: 32.50,
        disponible: true,
    },
    {
        id: 3,
        nombre: "NAPROXENO 550 MG",
        categoria: "Antiinflamatorios (AINEs)",
        precio: 38.75,
        disponible: true,
    },
    {
        id: 4,
        nombre: "ANALGÉSICO TABLETAS",
        categoria: "Analgésicos y Antipiréticos",
        precio: 18.90,
        disponible: true,
    },
];

// ======================================================
// COMPONENTE
// ======================================================

const DetalleEnfermedad = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const enfermedad = enfermedades[slug];


    // ==================================================
    // SLUG NO ENCONTRADO
    // ==================================================

    if (!enfermedad) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#f8fafc",
                }}
            >
                <HeaderPublico />

                <main
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "70px 35px",
                        textAlign: "center",
                    }}
                >
                    <h1
                        style={{
                            color: "#174a8b",
                            marginBottom: "12px",
                        }}
                    >
                        Opción no encontrada
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            marginBottom: "25px",
                        }}
                    >
                        La opción seleccionada no se encuentra disponible.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/enfermedades")}
                        style={{
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#00a859",
                            color: "#ffffff",
                            padding: "12px 20px",
                            fontWeight: "700",
                            cursor: "pointer",
                        }}
                    >
                        Volver a enfermedades comunes
                    </button>
                </main>
            </div>
        );
    }


    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
            }}
        >
            <HeaderPublico />

            <main
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "35px 35px 70px",
                }}
            >
                {/* VOLVER */}
                <button
                    type="button"
                    onClick={() => navigate("/enfermedades")}
                    style={{
                        border: "none",
                        backgroundColor: "transparent",
                        color: "#174a8b",
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: 0,
                        marginBottom: "28px",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: "pointer",
                    }}
                >
                    <MdArrowBack
                        style={{
                            fontSize: "20px",
                        }}
                    />

                    Enfermedades y necesidades comunes
                </button>


                {/* ENCABEZADO */}
                <section
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "35px",
                        marginBottom: "25px",
                    }}
                >
                    <div
                        style={{
                            color: "#00a859",
                            fontSize: "13px",
                            fontWeight: "800",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        Productos relacionados
                    </div>

                    <h1
                        style={{
                            margin: "0 0 12px",
                            color: "#174a8b",
                            fontSize: "32px",
                            fontWeight: "800",
                        }}
                    >
                        {enfermedad.titulo}
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            maxWidth: "750px",
                            color: "#6b7280",
                            fontSize: "15px",
                            lineHeight: "1.6",
                        }}
                    >
                        {enfermedad.descripcion}
                    </p>
                </section>


                {/* AVISO MÉDICO */}
                <section
                    style={{
                        padding: "18px 22px",
                        backgroundColor: "#eef6ff",
                        border: "1px solid #cfe2f5",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        marginBottom: "35px",
                    }}
                >
                    <div
                        style={{
                            width: "46px",
                            height: "46px",
                            minWidth: "46px",
                            borderRadius: "50%",
                            backgroundColor: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MdOutlineHealthAndSafety
                            style={{
                                color: "#174a8b",
                                fontSize: "25px",
                            }}
                        />
                    </div>

                    <div>
                        <div
                            style={{
                                color: "#174a8b",
                                fontSize: "14px",
                                fontWeight: "800",
                                marginBottom: "4px",
                            }}
                        >
                            Consulta a un profesional de la salud
                        </div>

                        <p
                            style={{
                                margin: 0,
                                color: "#52657a",
                                fontSize: "13px",
                                lineHeight: "1.55",
                            }}
                        >
                            Las sugerencias mostradas son únicamente
                            orientativas. Consulta a tu médico o farmacéutico
                            antes de consumir medicamentos, especialmente si
                            presentas síntomas persistentes, utilizas otros
                            medicamentos o tienes alguna condición médica.
                        </p>
                    </div>
                </section>


                {/* PRODUCTOS RELACIONADOS */}
                <section>
                    {/* ENCABEZADO */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "20px",
                            marginBottom: "25px",
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: "0 0 6px",
                                    color: "#174a8b",
                                    fontSize: "22px",
                                    fontWeight: "800",
                                }}
                            >
                                Productos relacionados
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#7b8794",
                                    fontSize: "13px",
                                }}
                            >
                                Selecciona los productos que deseas consultar o agregar
                                al carrito.
                            </p>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                type="button"
                                style={{
                                    height: "40px",
                                    padding: "0 16px",
                                    borderRadius: "8px",
                                    border: "1px solid #d6dee8",
                                    backgroundColor: "#ffffff",
                                    color: "#174a8b",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                }}
                            >
                                Seleccionar todos
                            </button>

                            <button
                                type="button"
                                style={{
                                    height: "40px",
                                    padding: "0 18px",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: "#00a859",
                                    color: "#ffffff",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <FaCartPlus />

                                Agregar seleccionados
                            </button>
                        </div>
                    </div>

                    {/* TARJETAS */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(235px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {productosTemporales.map((producto) => (
                            <div
                                key={producto.id}
                                style={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "14px",
                                    overflow: "hidden",
                                    boxShadow:
                                        "0 4px 14px rgba(15, 23, 42, 0.04)",
                                }}
                            >
                                {/* ÁREA VISUAL */}
                                <div
                                    style={{
                                        height: "145px",
                                        backgroundColor: "#f5f9fc",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "70px",
                                            height: "70px",
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
                                                fontSize: "32px",
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
                                            margin: "0 0 16px",
                                            color: "#174a8b",
                                            fontSize: "15px",
                                            lineHeight: "1.4",
                                            minHeight: "42px",
                                        }}
                                    >
                                        {producto.nombre}
                                    </h3>

                                    {/* PRECIO Y DISPONIBILIDAD */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "10px",
                                            marginBottom: "17px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "#174a8b",
                                                fontSize: "20px",
                                                fontWeight: "800",
                                            }}
                                        >
                                            Q{producto.precio.toFixed(2)}
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

                                    {/* SELECCIONAR */}
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "11px 0",
                                            borderTop: "1px solid #edf1f5",
                                            color: "#52657a",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                accentColor: "#00a859",
                                                cursor: "pointer",
                                            }}
                                        />

                                        Seleccionar producto
                                    </label>

                                    {/* AGREGAR INDIVIDUAL */}
                                    <button
                                        type="button"
                                        style={{
                                            width: "100%",
                                            height: "42px",
                                            marginTop: "5px",
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

                    {/* NOTA TEMPORAL */}
                    <div
                        style={{
                            marginTop: "22px",
                            padding: "13px 16px",
                            borderRadius: "9px",
                            backgroundColor: "#fffaf0",
                            border: "1px solid #f5dfb3",
                            color: "#80642b",
                            fontSize: "11px",
                            lineHeight: "1.5",
                            textAlign: "center",
                        }}
                    >
                        Los productos, precios y disponibilidad mostrados en esta
                        sección son temporales durante la fase de diseño. La información
                        definitiva será obtenida del inventario de Farmacia Gaby.
                    </div>
                </section>
            </main>

            <FooterPublico />
        </div>
    );
};
export default DetalleEnfermedad;