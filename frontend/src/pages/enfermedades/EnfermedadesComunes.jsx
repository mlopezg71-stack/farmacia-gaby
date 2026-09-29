import { useNavigate } from "react-router-dom";
import HeaderPublico from "../../components/public/HeaderPublico";
import FooterPublico from "../../components/public/FooterPublico";

import {
    FaHeadSideCough,
    FaTemperatureHigh,
    FaHeadSideVirus,
    FaLungs,
    FaDroplet,
    FaEye,
    FaEarListen,
    FaVenusMars,
    FaBaby,
    FaShieldHeart,
    FaPersonPregnant,
} from "react-icons/fa6";

import {
    FaAllergies,
    FaHeartbeat,
    FaCapsules,
} from "react-icons/fa";

import {
    MdHealing,
    MdMedicalServices,
    MdOutlineHealthAndSafety,
    MdSick,
    MdPregnantWoman,
} from "react-icons/md";

import {
    GiMedicines,
    GiStomach,
    GiMuscleUp,
    GiKneeCap,
    GiJoint,
    GiVomiting,
    GiMushroomGills,
    GiWorms,
    GiWaterDrop,
    GiHealthNormal,
} from "react-icons/gi";


// ======================================================
// ENFERMEDADES / SÍNTOMAS / NECESIDADES COMUNES
// ======================================================

const grupos = [
    {
        titulo: "Dolor y malestar",
        descripcion:
            "Opciones relacionadas con dolor, fiebre e inflamación.",
        items: [
            {
                nombre: "Dolor de cabeza",
                slug: "dolor-de-cabeza",
                icono: FaHeadSideVirus,
            },
            {
                nombre: "Migraña",
                slug: "migrana",
                icono: FaHeadSideVirus,
            },
            {
                nombre: "Fiebre",
                slug: "fiebre",
                icono: FaTemperatureHigh,
            },
            {
                nombre: "Dolor muscular",
                slug: "dolor-muscular",
                icono: GiMuscleUp,
            },
            {
                nombre: "Dolor articular",
                slug: "dolor-articular",
                icono: GiKneeCap,
            },
            {
                nombre: "Dolor e inflamación",
                slug: "dolor-e-inflamacion",
                icono: GiJoint,
            },
        ],
    },

    {
        titulo: "Respiratorio",
        descripcion:
            "Productos relacionados con molestias respiratorias frecuentes.",
        items: [
            {
                nombre: "Tos",
                slug: "tos",
                icono: FaHeadSideCough,
            },
            {
                nombre: "Tos con flema y expectoración",
                slug: "tos-con-flema",
                icono: FaLungs,
            },
            {
                nombre: "Gripe y resfriado",
                slug: "gripe-y-resfriado",
                icono: MdSick,
            },
            {
                nombre: "Congestión nasal",
                slug: "congestion-nasal",
                icono: FaHeadSideVirus,
            },
            {
                nombre: "Alergias respiratorias",
                slug: "alergias-respiratorias",
                icono: FaAllergies,
            },
        ],
    },

    {
        titulo: "Digestivo",
        descripcion:
            "Opciones relacionadas con molestias y cuidado digestivo.",
        items: [
            {
                nombre: "Acidez y reflujo",
                slug: "acidez-y-reflujo",
                icono: GiStomach,
            },
            {
                nombre: "Indigestión",
                slug: "indigestion",
                icono: GiStomach,
            },
            {
                nombre: "Gases",
                slug: "gases",
                icono: GiStomach,
            },
            {
                nombre: "Náuseas y vómitos",
                slug: "nauseas-y-vomitos",
                icono: GiVomiting,
            },
            {
                nombre: "Diarrea",
                slug: "diarrea",
                icono: GiStomach,
            },
            {
                nombre: "Estreñimiento",
                slug: "estrenimiento",
                icono: GiStomach,
            },
            {
                nombre: "Cólicos y espasmos digestivos",
                slug: "colicos-y-espasmos",
                icono: GiStomach,
            },
            {
                nombre: "Hemorroides",
                slug: "hemorroides",
                icono: MdHealing,
            },
        ],
    },

    {
        titulo: "Piel y cuidado externo",
        descripcion:
            "Productos relacionados con el cuidado y protección de la piel.",
        items: [
            {
                nombre: "Hongos de la piel",
                slug: "hongos-de-la-piel",
                icono: GiMushroomGills,
            },
            {
                nombre: "Irritación de la piel",
                slug: "irritacion-de-la-piel",
                icono: MdHealing,
            },
            {
                nombre: "Cuidado de heridas",
                slug: "cuidado-de-heridas",
                icono: MdMedicalServices,
            },
            {
                nombre: "Resequedad y cuidado de la piel",
                slug: "cuidado-de-la-piel",
                icono: GiHealthNormal,
            },
        ],
    },

    {
        titulo: "Hidratación y nutrición",
        descripcion:
            "Opciones para hidratación, vitaminas y suplementación.",
        items: [
            {
                nombre: "Deshidratación",
                slug: "deshidratacion",
                icono: GiWaterDrop,
            },
            {
                nombre: "Vitaminas y minerales",
                slug: "vitaminas-y-minerales",
                icono: FaCapsules,
            },
            {
                nombre: "Suplementación",
                slug: "suplementacion",
                icono: GiMedicines,
            },
            {
                nombre: "Cuidado prenatal",
                slug: "cuidado-prenatal",
                icono: FaPersonPregnant,
            },
        ],
    },

    {
        titulo: "Ojos y oídos",
        descripcion:
            "Opciones relacionadas con el cuidado ocular y auditivo.",
        items: [
            {
                nombre: "Molestias y cuidado ocular",
                slug: "cuidado-ocular",
                icono: FaEye,
            },
            {
                nombre: "Ojos secos",
                slug: "ojos-secos",
                icono: FaDroplet,
            },
            {
                nombre: "Cuidado ótico",
                slug: "cuidado-otico",
                icono: FaEarListen,
            },
        ],
    },

    {
        titulo: "Salud y bienestar",
        descripcion:
            "Otras necesidades frecuentes disponibles en farmacia.",
        items: [
            {
                nombre: "Parásitos intestinales",
                slug: "parasitos-intestinales",
                icono: GiWorms,
            },
            {
                nombre: "Salud cardiovascular",
                slug: "salud-cardiovascular",
                icono: FaHeartbeat,
            },
            {
                nombre: "Salud sexual y reproductiva",
                slug: "salud-sexual-y-reproductiva",
                icono: FaVenusMars,
            },
            {
                nombre: "Planificación familiar",
                slug: "planificacion-familiar",
                icono: FaShieldHeart,
            },
            {
                nombre: "Pruebas de embarazo",
                slug: "pruebas-de-embarazo",
                icono: MdPregnantWoman,
            },
        ],
    },
];


const EnfermedadesComunes = () => {
    const navigate = useNavigate();

    const abrirDetalle = (slug) => {
        navigate(`/enfermedades/${slug}`);
    };

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
                    padding: "45px 35px 70px",
                }}
            >
                {/* =========================================
                    ENCABEZADO
                ========================================= */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "28px",
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 10px",
                            color: "#174a8b",
                            fontSize: "34px",
                            fontWeight: "800",
                        }}
                    >
                        Enfermedades y necesidades comunes
                    </h1>

                    <p
                        style={{
                            margin: "0 auto",
                            maxWidth: "760px",
                            color: "#6b7280",
                            fontSize: "15px",
                            lineHeight: "1.6",
                        }}
                    >
                        Explora productos relacionados con síntomas,
                        molestias y necesidades frecuentes de salud y
                        bienestar.
                    </p>
                </div>


                {/* =========================================
                    AVISO MÉDICO
                ========================================= */}
                <div
                    style={{
                        maxWidth: "1050px",
                        margin: "0 auto 45px",
                        padding: "18px 22px",
                        borderRadius: "12px",
                        backgroundColor: "#eef6ff",
                        border: "1px solid #cfe2f5",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        boxSizing: "border-box",
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
                            Cuida tu salud
                        </div>

                        <p
                            style={{
                                margin: 0,
                                color: "#52657a",
                                fontSize: "13px",
                                lineHeight: "1.55",
                            }}
                        >
                            Los productos mostrados son sugerencias
                            orientativas. Consulta a tu médico o profesional
                            de la salud antes de consumir medicamentos,
                            especialmente si presentas síntomas persistentes,
                            utilizas otros medicamentos o tienes alguna
                            condición médica.
                        </p>
                    </div>
                </div>


                {/* =========================================
                    GRUPOS
                ========================================= */}
                {grupos.map((grupo) => (
                    <section
                        key={grupo.titulo}
                        style={{
                            marginBottom: "50px",
                        }}
                    >
                        {/* TÍTULO DEL GRUPO */}
                        <div
                            style={{
                                marginBottom: "20px",
                            }}
                        >
                            <h2
                                style={{
                                    margin: "0 0 5px",
                                    color: "#174a8b",
                                    fontSize: "22px",
                                    fontWeight: "800",
                                }}
                            >
                                {grupo.titulo}
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#7b8794",
                                    fontSize: "13px",
                                }}
                            >
                                {grupo.descripcion}
                            </p>
                        </div>


                        {/* TARJETAS */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "18px",
                            }}
                        >
                            {grupo.items.map((item) => {
                                const Icono = item.icono;

                                return (
                                    <button
                                        key={item.slug}
                                        type="button"
                                        onClick={() =>
                                            abrirDetalle(item.slug)
                                        }
                                        style={{
                                            minHeight: "150px",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "14px",
                                            backgroundColor: "#ffffff",
                                            padding: "22px",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "17px",
                                            boxShadow:
                                                "0 4px 14px rgba(15, 23, 42, 0.04)",
                                        }}
                                    >
                                        {/* ICONO */}
                                        <div
                                            style={{
                                                width: "58px",
                                                height: "58px",
                                                minWidth: "58px",
                                                borderRadius: "50%",
                                                backgroundColor: "#e9f8ef",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Icono
                                                style={{
                                                    color: "#00a859",
                                                    fontSize: "27px",
                                                }}
                                            />
                                        </div>

                                        {/* TEXTO */}
                                        <div>
                                            <div
                                                style={{
                                                    color: "#174a8b",
                                                    fontSize: "15px",
                                                    fontWeight: "800",
                                                    lineHeight: "1.35",
                                                    marginBottom: "7px",
                                                }}
                                            >
                                                {item.nombre}
                                            </div>

                                            <div
                                                style={{
                                                    color: "#00a859",
                                                    fontSize: "12px",
                                                    fontWeight: "700",
                                                }}
                                            >
                                                Ver productos →
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ))}


                {/* =========================================
                    AVISO FINAL
                ========================================= */}
                <div
                    style={{
                        marginTop: "10px",
                        padding: "20px 25px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        textAlign: "center",
                    }}
                >
                    <MdOutlineHealthAndSafety
                        style={{
                            color: "#00a859",
                            fontSize: "28px",
                            marginBottom: "8px",
                        }}
                    />

                    <p
                        style={{
                            margin: 0,
                            color: "#52657a",
                            fontSize: "13px",
                            lineHeight: "1.6",
                        }}
                    >
                        Ante cualquier duda sobre el uso de un medicamento,
                        consulta a tu médico, farmacéutico o profesional de la
                        salud.
                    </p>
                </div>
            </main>

            <FooterPublico />
        </div>
    );
};

export default EnfermedadesComunes;