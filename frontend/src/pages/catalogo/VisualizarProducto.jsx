import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaExclamationTriangle,
    FaBoxOpen,
    FaMoneyBillWave,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import DatosProducto from "./components/DatosProducto";
import CategoriasProducto from "./components/CategoriasProducto";
import PresentacionesProducto from "./components/PresentacionesProducto";
import PreciosProducto from "./components/PreciosProducto";

const API_CATALOGO = "http://localhost:3002";

const VisualizarProducto = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    // =====================================================
    // ESTADOS
    // =====================================================

    const [producto, setProducto] = useState(null);

    const [categorias, setCategorias] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] =
        useState([]);

    const [presentaciones, setPresentaciones] = useState([]);

    const [marcas, setMarcas] = useState([]);
    const [laboratorios, setLaboratorios] = useState([]);
    const [listasPrecio, setListasPrecio] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // NORMALIZAR RESPUESTAS DE CATÁLOGOS
    // =====================================================

    const normalizarArray = (respuesta) => {
        if (Array.isArray(respuesta)) {
            return respuesta;
        }

        if (Array.isArray(respuesta?.data)) {
            return respuesta.data;
        }

        if (Array.isArray(respuesta?.marcas)) {
            return respuesta.marcas;
        }

        if (Array.isArray(respuesta?.laboratorios)) {
            return respuesta.laboratorios;
        }

        if (Array.isArray(respuesta?.categorias)) {
            return respuesta.categorias;
        }

        if (Array.isArray(respuesta?.listasPrecio)) {
            return respuesta.listasPrecio;
        }

        if (Array.isArray(respuesta?.listas_precio)) {
            return respuesta.listas_precio;
        }

        return [];
    };

    // =====================================================
    // NORMALIZAR CATEGORÍAS DEL PRODUCTO
    // =====================================================

    const normalizarCategoriasProducto = (
        categoriasProducto = []
    ) => {
        if (!Array.isArray(categoriasProducto)) {
            return [];
        }

        return categoriasProducto
            .map((item) => {
                const idCategoria =
                    item.id_categoria ??
                    item.categoria?.id_categoria;

                if (!idCategoria) {
                    return null;
                }

                return {
                    id_categoria: Number(idCategoria),
                    principal: Boolean(item.principal),
                };
            })
            .filter(Boolean);
    };

    // =====================================================
    // NORMALIZAR PRESENTACIONES
    // =====================================================

    const normalizarPresentaciones = (
        presentacionesProducto = []
    ) => {
        if (!Array.isArray(presentacionesProducto)) {
            return [];
        }

        return presentacionesProducto.map(
            (presentacion) => ({
                ...presentacion,

                sku:
                    presentacion.sku ??
                    "",

                codigo_barras:
                    presentacion.codigo_barras ??
                    "",

                nombre:
                    presentacion.nombre ??
                    "",

                tipo:
                    presentacion.tipo ??
                    "UNIDAD",

                unidades_base:
                    presentacion.unidades_base ??
                    "",

                contenido:
                    presentacion.contenido ??
                    "",

                unidad_contenido:
                    presentacion.unidad_contenido ??
                    "",

                forma_farmaceutica:
                    presentacion.forma_farmaceutica ??
                    "",

                concentracion_descriptiva:
                    presentacion.concentracion_descriptiva ??
                    "",

                permite_venta:
                    presentacion.permite_venta ??
                    true,

                permite_fraccionamiento:
                    presentacion.permite_fraccionamiento ??
                    false,

                peso_gramos:
                    presentacion.peso_gramos ??
                    "",

                estado:
                    presentacion.estado ??
                    "ACTIVO",

                precios: Array.isArray(
                    presentacion.precios
                )
                    ? presentacion.precios.map(
                        (precio) => ({
                            ...precio,

                            id_lista:
                                precio.id_lista ??
                                precio.id_lista_precio ??
                                "",

                            importe:
                                precio.importe ??
                                "",

                            incluye_impuesto:
                                precio.incluye_impuesto ??
                                true,

                            tasa_impuesto:
                                precio.tasa_impuesto ??
                                "",

                            id_sucursal:
                                precio.id_sucursal ??
                                "",

                            canal:
                                precio.canal ??
                                "TODOS",

                            desde:
                                precio.desde
                                    ? String(
                                        precio.desde
                                    ).slice(0, 16)
                                    : "",

                            hasta:
                                precio.hasta
                                    ? String(
                                        precio.hasta
                                    ).slice(0, 16)
                                    : "",
                        })
                    )
                    : [],
            })
        );
    };

    // =====================================================
    // CARGAR PRODUCTO
    // =====================================================

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                setCargando(true);
                setError("");

                // =========================================
                // PRODUCTO
                // =========================================

                const respuestaProducto = await fetch(
                    `${API_CATALOGO}/productos/admin/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!respuestaProducto.ok) {
                    const errorProducto =
                        await respuestaProducto
                            .json()
                            .catch(() => ({}));

                    throw new Error(
                        errorProducto.message ||
                        errorProducto.error ||
                        "No fue posible cargar el producto."
                    );
                }

                const resultadoProducto =
                    await respuestaProducto.json();

                const productoRecibido =
                    resultadoProducto?.producto ??
                    resultadoProducto;

                if (
                    !productoRecibido ||
                    !productoRecibido.id_producto
                ) {
                    throw new Error(
                        "No se encontró la información del producto."
                    );
                }

                // =========================================
                // CATÁLOGOS AUXILIARES
                // =========================================

                const [
                    respuestaMarcas,
                    respuestaLaboratorios,
                    respuestaCategorias,
                    respuestaListas,
                ] = await Promise.all([
                    fetch(
                        `${API_CATALOGO}/catalogos/marcas`
                    ),
                    fetch(
                        `${API_CATALOGO}/catalogos/laboratorios`
                    ),
                    fetch(
                        `${API_CATALOGO}/catalogos/categorias`
                    ),
                    fetch(
                        `${API_CATALOGO}/catalogos/listas-precio`
                    ),
                ]);

                const [
                    datosMarcas,
                    datosLaboratorios,
                    datosCategorias,
                    datosListas,
                ] = await Promise.all([
                    respuestaMarcas.ok
                        ? respuestaMarcas.json()
                        : [],
                    respuestaLaboratorios.ok
                        ? respuestaLaboratorios.json()
                        : [],
                    respuestaCategorias.ok
                        ? respuestaCategorias.json()
                        : [],
                    respuestaListas.ok
                        ? respuestaListas.json()
                        : [],
                ]);

                const marcasCargadas =
                    normalizarArray(datosMarcas);

                const laboratoriosCargados =
                    normalizarArray(
                        datosLaboratorios
                    );

                const categoriasCargadas =
                    normalizarArray(
                        datosCategorias
                    );

                const listasCargadas =
                    normalizarArray(datosListas);

                // =========================================
                // DATOS PRINCIPALES
                // =========================================

                setMarcas(marcasCargadas);
                setLaboratorios(
                    laboratoriosCargados
                );
                setCategorias(
                    categoriasCargadas
                );
                setListasPrecio(
                    listasCargadas
                );

                setProducto({
                    ...productoRecibido,

                    nombre:
                        productoRecibido.nombre ??
                        "",

                    slug:
                        productoRecibido.slug ??
                        "",

                    descripcion_corta:
                        productoRecibido.descripcion_corta ??
                        "",

                    descripcion_larga:
                        productoRecibido.descripcion_larga ??
                        "",

                    tipo:
                        productoRecibido.tipo ??
                        "MEDICAMENTO",

                    requiere_receta:
                        productoRecibido.requiere_receta ??
                        false,

                    registro_sanitario:
                        productoRecibido.registro_sanitario ??
                        "",

                    conservacion:
                        productoRecibido.conservacion ??
                        "",

                    advertencias:
                        productoRecibido.advertencias ??
                        "",

                    estado:
                        productoRecibido.estado ??
                        "BORRADOR",

                    visible_web:
                        productoRecibido.visible_web ??
                        false,

                    destacado:
                        productoRecibido.destacado ??
                        false,

                    unidad_base:
                        productoRecibido.unidad_base ??
                        "",

                    id_marca:
                        productoRecibido.id_marca ??
                        "",

                    id_laboratorio:
                        productoRecibido.id_laboratorio ??
                        "",
                });

                // =========================================
                // CATEGORÍAS
                // =========================================

                const categoriasProducto =
                    productoRecibido.categorias ??
                    productoRecibido.productoCategorias ??
                    [];

                setCategoriasSeleccionadas(
                    normalizarCategoriasProducto(
                        categoriasProducto
                    )
                );

                // =========================================
                // PRESENTACIONES + PRECIOS
                // =========================================

                setPresentaciones(
                    normalizarPresentaciones(
                        productoRecibido.presentaciones ??
                        []
                    )
                );
            } catch (errorCarga) {
                console.error(
                    "Error al cargar producto:",
                    errorCarga
                );

                setError(
                    errorCarga.message ||
                    "Ocurrió un error al cargar el producto."
                );
            } finally {
                setCargando(false);
            }
        };

        if (id && token) {
            cargarProducto();
        }
    }, [id, token]);

    // =====================================================
    // ESTILOS
    // =====================================================

    const styles = {
        page: {
            minHeight: "100vh",
            backgroundColor: "#f4f7f6",
            fontFamily:
                '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            padding: "25px 35px 40px",
            boxSizing: "border-box",
        },

        topBar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "22px",
        },

        titleArea: {
            display: "flex",
            alignItems: "center",
            gap: "14px",
        },

        backButton: {
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "1px solid #dce7e3",
            backgroundColor: "#ffffff",
            color: "#082b4f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "15px",
        },

        title: {
            margin: 0,
            color: "#082b4f",
            fontSize: "25px",
            fontWeight: "750",
        },

        subtitle: {
            margin: "5px 0 0",
            color: "#71817c",
            fontSize: "13px",
        },

        editButton: {
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#159447",
            color: "#ffffff",
            padding: "11px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
        },

        statusBar: {
            backgroundColor: "#ffffff",
            border: "1px solid #e2ebe7",
            borderRadius: "13px",
            padding: "14px 18px",
            marginBottom: "20px",
            boxShadow:
                "0 5px 16px rgba(17,48,65,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
        },

        statusLeft: {
            display: "flex",
            alignItems: "center",
            gap: "11px",
        },

        statusIcon: {
            width: "35px",
            height: "35px",
            borderRadius: "9px",
            backgroundColor: "#eaf7f0",
            color: "#159447",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },

        statusName: {
            color: "#082b4f",
            fontSize: "14px",
            fontWeight: "700",
        },

        statusCode: {
            marginTop: "3px",
            color: "#81918c",
            fontSize: "11px",
        },

        badge: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "20px",
            padding: "6px 11px",
            fontSize: "10px",
            fontWeight: "800",
        },

        loading: {
            minHeight: "420px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#71817c",
            fontSize: "14px",
        },

        errorBox: {
            backgroundColor: "#fff7f7",
            border: "1px solid #f0d8d8",
            borderRadius: "12px",
            padding: "18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#a93226",
            fontSize: "13px",
        },

        errorIcon: {
            fontSize: "20px",
            flexShrink: 0,
        },

        errorActions: {
            marginTop: "16px",
        },

        errorButton: {
            border: "none",
            backgroundColor: "#082b4f",
            color: "#ffffff",
            borderRadius: "9px",
            padding: "10px 14px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "700",
        },

        presentationPriceBlock: {
            marginTop: "15px",
            paddingLeft: "18px",
            borderLeft: "3px solid #e2ebe7",
        },

        presentationPriceHeader: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
            color: "#082b4f",
            fontSize: "13px",
            fontWeight: "700",
        },

        noPrices: {
            border: "1px dashed #d5e0dc",
            borderRadius: "10px",
            padding: "13px",
            color: "#81918c",
            backgroundColor: "#fafcfb",
            fontSize: "12px",
        },
    };

    // =====================================================
    // BADGE DE ESTADO
    // =====================================================

    const obtenerEstiloEstado = () => {
        if (producto?.estado === "PUBLICADO") {
            return {
                ...styles.badge,
                backgroundColor: "#eaf7f0",
                color: "#159447",
            };
        }

        if (producto?.estado === "ARCHIVADO") {
            return {
                ...styles.badge,
                backgroundColor: "#f1f3f4",
                color: "#65736f",
            };
        }

        return {
            ...styles.badge,
            backgroundColor: "#fff7df",
            color: "#9a6b00",
        };
    };

    // =====================================================
    // CARGANDO
    // =====================================================

    if (cargando) {
        return (
            <div style={styles.page}>
                <div style={styles.loading}>
                    Cargando producto...
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error || !producto) {
        return (
            <div style={styles.page}>
                <div style={styles.topBar}>
                    <div style={styles.titleArea}>
                        <button
                            type="button"
                            style={styles.backButton}
                            onClick={() =>
                                navigate(
                                    "/admin/catalogo"
                                )
                            }
                        >
                            <FaArrowLeft />
                        </button>

                        <div>
                            <h1 style={styles.title}>
                                Visualizar producto
                            </h1>

                            <p
                                style={
                                    styles.subtitle
                                }
                            >
                                Información del producto
                                seleccionado.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={styles.errorBox}>
                    <FaExclamationTriangle
                        style={styles.errorIcon}
                    />

                    <div>
                        <strong>
                            No fue posible cargar el
                            producto.
                        </strong>

                        <div
                            style={{
                                marginTop: "4px",
                            }}
                        >
                            {error ||
                                "Producto no encontrado."}
                        </div>

                        <div
                            style={
                                styles.errorActions
                            }
                        >
                            <button
                                type="button"
                                style={
                                    styles.errorButton
                                }
                                onClick={() =>
                                    navigate(
                                        "/admin/catalogo"
                                    )
                                }
                            >
                                Volver al catálogo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div style={styles.page}>
            {/* =========================================
                ENCABEZADO
            ========================================= */}

            <div style={styles.topBar}>
                <div style={styles.titleArea}>
                    <button
                        type="button"
                        style={styles.backButton}
                        onClick={() =>
                            navigate(
                                "/admin/catalogo"
                            )
                        }
                        title="Volver al catálogo"
                    >
                        <FaArrowLeft />
                    </button>

                    <div>
                        <h1 style={styles.title}>
                            Visualizar producto
                        </h1>

                        <p style={styles.subtitle}>
                            Consulta la información
                            registrada del producto.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    style={styles.editButton}
                    onClick={() =>
                        navigate(
                            `/admin/catalogo/modificar/${producto.id_producto}`
                        )
                    }
                >
                    <FaEdit />
                    Modificar producto
                </button>
            </div>

            {/* =========================================
                RESUMEN
            ========================================= */}

            <div style={styles.statusBar}>
                <div style={styles.statusLeft}>
                    <div style={styles.statusIcon}>
                        <FaBoxOpen />
                    </div>

                    <div>
                        <div style={styles.statusName}>
                            {producto.nombre}
                        </div>

                        <div style={styles.statusCode}>
                            Producto #
                            {producto.id_producto}
                            {producto.slug
                                ? ` · ${producto.slug}`
                                : ""}
                        </div>
                    </div>
                </div>

                <span
                    style={obtenerEstiloEstado()}
                >
                    {producto.estado}
                </span>
            </div>

            {/* =========================================
                INFORMACIÓN DEL PRODUCTO
            ========================================= */}

            <DatosProducto
                datos={producto}
                onChange={() => { }}
                marcas={marcas}
                laboratorios={laboratorios}
                disabled={true}
            />

            {/* =========================================
                CATEGORÍAS
            ========================================= */}

            <CategoriasProducto
                categorias={categorias}
                seleccionadas={
                    categoriasSeleccionadas
                }
                onChange={() => { }}
                disabled={true}
            />

            {/* =========================================
                PRESENTACIONES
            ========================================= */}

            <PresentacionesProducto
                presentaciones={presentaciones}
                onChange={() => { }}
                disabled={true}
            />

            {/* =========================================
                PRECIOS POR PRESENTACIÓN
            ========================================= */}

            {presentaciones.map(
                (presentacion, index) => (
                    <div
                        key={
                            presentacion.id_presentacion_producto ||
                            `precios-presentacion-${index}`
                        }
                        style={
                            styles.presentationPriceBlock
                        }
                    >
                        <div
                            style={
                                styles.presentationPriceHeader
                            }
                        >
                            <FaMoneyBillWave />

                            Precios de{" "}
                            {presentacion.nombre ||
                                `Presentación ${index + 1
                                }`}
                        </div>

                        {Array.isArray(
                            presentacion.precios
                        ) &&
                            presentacion.precios.length >
                            0 ? (
                            <PreciosProducto
                                precios={
                                    presentacion.precios
                                }
                                listasPrecio={
                                    listasPrecio
                                }
                                onChange={() => { }}
                                disabled={true}
                            />
                        ) : (
                            <div
                                style={
                                    styles.noPrices
                                }
                            >
                                Esta presentación no
                                tiene precios
                                registrados.
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default VisualizarProducto;