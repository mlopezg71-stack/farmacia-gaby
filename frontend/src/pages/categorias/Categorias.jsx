import { useNavigate } from "react-router-dom";

import HeaderPublico from "../../components/public/HeaderPublico";
import FooterPublico from "../../components/public/FooterPublico";

import {
    FaPills,
    FaCapsules,
    FaShieldVirus,
    FaPumpSoap,
    FaHeartPulse,
    FaVirusCovid,
    FaStethoscope,
    FaBrain,
    FaEye,
    FaDroplet,
    FaVenusMars,
} from "react-icons/fa6";

import { FaAllergies } from "react-icons/fa";

import {
    MdMedicalServices,
    MdHealing,
    MdMedication,
    MdCategory,
} from "react-icons/md";

import {
    GiStomach,
    GiMedicines,
    GiMushroomGills,
} from "react-icons/gi";


const categorias = [
    {
        nombre: "Analgésicos y Antipiréticos",
        icono: FaPills,
    },
    {
        nombre: "Vitaminas y Suplementos",
        icono: FaCapsules,
    },
    {
        nombre: "Gastrointestinales",
        icono: GiStomach,
    },
    {
        nombre: "Antivirales",
        icono: FaShieldVirus,
    },
    {
        nombre: "Dermatológicos",
        icono: MdHealing,
    },
    {
        nombre: "Antisépticos y Desinfectantes",
        icono: FaPumpSoap,
    },
    {
        nombre: "Antiparasitarios",
        icono: FaVirusCovid,
    },
    {
        nombre: "Insumos Médicos",
        icono: MdMedicalServices,
    },
    {
        nombre: "Cardiovasculares y Metabólicos",
        icono: FaHeartPulse,
    },
    {
        nombre: "Antibióticos",
        icono: FaCapsules,
    },
    {
        nombre: "Respiratorios y Antigripales",
        icono: FaStethoscope,
    },
    {
        nombre: "Antiinflamatorios (AINEs)",
        icono: GiMedicines,
    },
    {
        nombre: "Antihistamínicos y Antialérgicos",
        icono: FaAllergies,
    },
    {
        nombre: "Corticoides",
        icono: MdMedication,
    },
    {
        nombre: "Neurológicos y Psiquiátricos",
        icono: FaBrain,
    },
    {
        nombre: "Oftalmológicos y Óticos",
        icono: FaEye,
    },
    {
        nombre: "Salud Sexual y Reproductiva",
        icono: FaVenusMars,
    },
    {
        nombre: "Hidratación y Sueros Orales",
        icono: FaDroplet,
    },
    {
        nombre: "Antimicóticos",
        icono: GiMushroomGills,
    },
    {
        nombre: "Otros / Varios",
        icono: MdCategory,
    },
];


const Categorias = () => {
    const navigate = useNavigate();

    const abrirCategoria = (nombre) => {
        navigate(
            `/productos?categoria=${encodeURIComponent(nombre)}`
        );
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
                    padding: "50px 35px 70px",
                }}
            >
                {/* ENCABEZADO */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "45px",
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 12px",
                            color: "#174a8b",
                            fontSize: "34px",
                            fontWeight: "800",
                        }}
                    >
                        Categorías
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#6b7280",
                            fontSize: "16px",
                        }}
                    >
                        Encuentra fácilmente los productos que necesitas
                        según su categoría
                    </p>
                </div>

                {/* CATEGORÍAS */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {categorias.map((categoria) => {
                        const Icono = categoria.icono;

                        return (
                            <div
                                key={categoria.nombre}
                                onClick={() =>
                                    abrirCategoria(categoria.nombre)
                                }
                                style={{
                                    minHeight: "175px",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "14px",
                                    padding: "25px 20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "18px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    boxShadow:
                                        "0 4px 14px rgba(0, 0, 0, 0.04)",
                                }}
                            >
                                <div
                                    style={{
                                        width: "65px",
                                        height: "65px",
                                        borderRadius: "50%",
                                        backgroundColor: "#e9f8ef",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Icono
                                        style={{
                                            fontSize: "31px",
                                            color: "#00a859",
                                        }}
                                    />
                                </div>

                                <span
                                    style={{
                                        color: "#174a8b",
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        lineHeight: "1.35",
                                    }}
                                >
                                    {categoria.nombre}
                                </span>

                                <span
                                    style={{
                                        color: "#00a859",
                                        fontSize: "13px",
                                        fontWeight: "700",
                                    }}
                                >
                                    Ver productos
                                </span>
                            </div>
                        );
                    })}
                </div>
            </main>

            <FooterPublico />
        </div>
    );
};

export default Categorias;