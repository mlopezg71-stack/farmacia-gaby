import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


import logo from "../../assets/FarmaciasGaby.png";
import ModalCuenta from "../auth/ModalCuenta";
import ModalActualizarInformacion from "../auth/ModalActualizarInformacion";
import ModalDirecciones from "./ModalDirecciones";

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


const HeaderPublico = () => {
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();

    const [mostrarCategorias, setMostrarCategorias] = useState(false);
    const [mostrarCuenta, setMostrarCuenta] = useState(false);
    const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
    const [mostrarActualizarInformacion, setMostrarActualizarInformacion] = useState(false);

    const [mostrarDirecciones, setMostrarDirecciones] = useState(false);

    const styles = {
        header: {
            width: "100%",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e8e8e8",
        },

        headerMain: {
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "16px 35px",
            display: "flex",
            alignItems: "center",
            gap: "35px",
        },

        logo: {
            width: "185px",
            height: "65px",
            objectFit: "contain",
            cursor: "pointer",
        },

        searchContainer: {
            flex: 1,
            position: "relative",
        },

        search: {
            width: "100%",
            height: "48px",
            border: "1px solid #d8d8d8",
            borderRadius: "24px",
            padding: "0 55px 0 22px",
            fontSize: "15px",
            outline: "none",
            boxSizing: "border-box",
            backgroundColor: "#f8f9fa",
        },

        searchButton: {
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
        },

        actions: {
            display: "flex",
            alignItems: "center",
            gap: "25px",
        },

        action: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            color: "#174a8b",
            fontWeight: "600",
            fontSize: "14px",
            whiteSpace: "nowrap",
        },

        actionIcon: {
            fontSize: "23px",
        },

        cart: {
            position: "relative",
        },

        cartBadge: {
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
        },

        nav: {
            backgroundColor: "#174a8b",
        },

        navContent: {
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "45px",
            height: "48px",
        },

        navItem: {
            color: "#ffffff",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap",
        },
    };


    return (
        <header style={styles.header}>

            {/* PARTE SUPERIOR */}
            <div style={styles.headerMain}>

                {/* LOGO */}
                <img
                    src={logo}
                    alt="Farmacia Gaby"
                    style={styles.logo}
                    onClick={() => navigate("/")}
                />

                {/* BUSCADOR */}
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="¿Qué producto estás buscando?"
                        style={styles.search}
                    />

                    <button
                        type="button"
                        style={styles.searchButton}
                    >
                        🔍
                    </button>
                </div>

                {/* ACCIONES */}
                <div style={styles.actions}>

                    <div style={{ position: "relative" }}>
                        <div
                            style={styles.action}
                            onClick={() => {
                                if (usuario) {
                                    setMostrarMenuUsuario((prev) => !prev);
                                } else {
                                    setMostrarCuenta(true);
                                }
                            }}
                        >
                            <span style={styles.actionIcon}>👤</span>
                            <span>{usuario ? usuario.nombre_completo : "Mi cuenta"}</span>
                        </div>

                        {usuario && mostrarMenuUsuario && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "45px",
                                    right: 0,
                                    width: "260px",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                                    padding: "16px",
                                    zIndex: 2000,
                                }}
                            >
                                <div
                                    style={{
                                        color: "#174a8b",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        marginBottom: "5px",
                                    }}
                                >
                                    {usuario.nombre_completo}
                                </div>

                                <div
                                    style={{
                                        color: "#667085",
                                        fontSize: "13px",
                                        marginBottom: "15px",
                                    }}
                                >
                                    {usuario.correo}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMostrarMenuUsuario(false);
                                        setMostrarActualizarInformacion(true);
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginBottom: "8px",
                                        border: "none",
                                        borderRadius: "8px",
                                        backgroundColor: "#ffffff",
                                        color: "#174a8b",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        textAlign: "left",
                                    }}
                                >
                                    Actualizar información
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMostrarMenuUsuario(false);
                                        setMostrarDirecciones(true);
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginBottom: "8px",
                                        border: "none",
                                        borderRadius: "8px",
                                        backgroundColor: "#ffffff",
                                        color: "#174a8b",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        textAlign: "left",
                                    }}
                                >
                                    Mis direcciones
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        logout();
                                        setMostrarMenuUsuario(false);
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        border: "none",
                                        borderRadius: "8px",
                                        backgroundColor: "#f3f6f9",
                                        color: "#174a8b",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            ...styles.action,
                            ...styles.cart,
                        }}
                        onClick={() => navigate("/carrito")}
                    >
                        <span style={styles.actionIcon}>🛒</span>
                        <span>Carrito</span>

                        <span style={styles.cartBadge}>
                            0
                        </span>
                    </div>

                </div>
            </div>


            {/* NAVEGACIÓN */}
            <nav style={styles.nav}>
                <div style={styles.navContent}>

                    {/* INICIO */}
                    <span
                        style={styles.navItem}
                        onClick={() => navigate("/")}
                    >
                        Inicio
                    </span>


                    {/* PRODUCTOS */}
                    <span
                        style={styles.navItem}
                        onClick={() => navigate("/productos")}
                    >
                        Productos
                    </span>


                    {/* CATEGORÍAS */}
                    <div
                        style={{
                            position: "relative",
                            height: "48px",
                            display: "flex",
                            alignItems: "center",
                        }}
                        onMouseEnter={() =>
                            setMostrarCategorias(true)
                        }
                        onMouseLeave={() =>
                            setMostrarCategorias(false)
                        }
                    >
                        <span
                            style={{
                                ...styles.navItem,
                                display: "flex",
                                alignItems: "center",
                                gap: "7px",
                            }}
                            onClick={() =>
                                navigate("/categorias")
                            }
                        >
                            Categorías

                            <span
                                style={{
                                    fontSize: "10px",
                                    transform: mostrarCategorias
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition:
                                        "transform 0.2s ease",
                                }}
                            >
                                ▼
                            </span>
                        </span>


                        {/* DROPDOWN */}
                        {mostrarCategorias && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "48px",
                                    left: "50%",
                                    transform:
                                        "translateX(-50%)",
                                    width: "360px",
                                    backgroundColor: "#ffffff",
                                    border:
                                        "1px solid #e5e7eb",
                                    borderRadius:
                                        "0 0 14px 14px",
                                    boxShadow:
                                        "0 12px 30px rgba(0,0,0,0.15)",
                                    padding: "16px",
                                    zIndex: 1000,
                                }}
                            >

                                {/* ENCABEZADO */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent:
                                            "space-between",
                                        paddingBottom: "12px",
                                        marginBottom: "8px",
                                        borderBottom:
                                            "1px solid #edf0f4",
                                    }}
                                >
                                    <strong
                                        style={{
                                            color: "#174a8b",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Categorías
                                    </strong>

                                    <span
                                        style={{
                                            color: "#00a651",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setMostrarCategorias(
                                                false
                                            );
                                            navigate(
                                                "/categorias"
                                            );
                                        }}
                                    >
                                        Ver todas
                                    </span>
                                </div>


                                {/* LISTADO */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0px",
                                    }}
                                >
                                    {categorias.map(
                                        (categoria) => {
                                            const IconoCategoria =
                                                categoria.icono;

                                            return (
                                                <div
                                                    key={
                                                        categoria.nombre
                                                    }
                                                    onClick={() => {
                                                        setMostrarCategorias(
                                                            false
                                                        );

                                                        navigate(
                                                            `/productos?categoria=${encodeURIComponent(
                                                                categoria.nombre
                                                            )}`
                                                        );
                                                    }}
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: "10px",
                                                        padding:
                                                            "7px 10px",
                                                        borderRadius:
                                                            "6px",
                                                        color:
                                                            "#394b5f",
                                                        fontSize:
                                                            "13px",
                                                        fontWeight:
                                                            "600",
                                                        cursor:
                                                            "pointer",
                                                        width: "100%",
                                                    }}
                                                    onMouseEnter={(
                                                        e
                                                    ) => {
                                                        e.currentTarget.style.backgroundColor =
                                                            "#f3f7fb";
                                                        e.currentTarget.style.color =
                                                            "#174a8b";
                                                    }}
                                                    onMouseLeave={(
                                                        e
                                                    ) => {
                                                        e.currentTarget.style.backgroundColor =
                                                            "transparent";
                                                        e.currentTarget.style.color =
                                                            "#394b5f";
                                                    }}
                                                >
                                                    <IconoCategoria
                                                        size={18}
                                                        color="#00a651"
                                                        style={{
                                                            flexShrink: 0,
                                                        }}
                                                    />

                                                    <span>
                                                        {
                                                            categoria.nombre
                                                        }
                                                    </span>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                            </div>
                        )}
                    </div>


                    {/* ENFERMEDADES COMUNES */}
                    <span
                        style={styles.navItem}
                        onClick={() =>
                            navigate("/enfermedades")
                        }
                    >
                        Enfermedades comunes
                    </span>


                    {/* OFERTAS */}
                    <span
                        style={styles.navItem}
                        onClick={() => navigate("/ofertas")}
                    >
                        Ofertas
                    </span>


                    {/* SUCURSALES */}
                    <span
                        style={styles.navItem}
                        onClick={() =>
                            navigate("/sucursales")
                        }
                    >
                        Sucursales
                    </span>


                    {/* CONTACTO */}
                    <span
                        style={styles.navItem}
                        onClick={() =>
                            navigate("/contacto")
                        }
                    >
                        Contáctanos
                    </span>

                </div>
            </nav>

            <ModalCuenta
                abierto={mostrarCuenta}
                onCerrar={() => setMostrarCuenta(false)}
            />

            <ModalActualizarInformacion
                abierto={mostrarActualizarInformacion}
                onCerrar={() => setMostrarActualizarInformacion(false)}
                usuario={usuario}
            />

            <ModalDirecciones
                abierto={mostrarDirecciones}
                onCerrar={() => setMostrarDirecciones(false)}
            />

        </header>
    );
};


export default HeaderPublico;