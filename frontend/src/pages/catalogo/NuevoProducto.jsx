import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaSave,
    FaCheckCircle,
    FaExclamationTriangle,
    FaMoneyBillWave,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import DatosProducto from "./components/DatosProducto";
import CategoriasProducto from "./components/CategoriasProducto";
import PresentacionesProducto from "./components/PresentacionesProducto";
import PreciosProducto from "./components/PreciosProducto";

const API_CATALOGO = "http://localhost:3002";

const estadoInicialProducto = {
    nombre: "",
    slug: "",
    descripcion_corta: "",
    descripcion_larga: "",
    tipo: "MEDICAMENTO",
    requiere_receta: false,
    registro_sanitario: "",
    conservacion: "",
    advertencias: "",
    estado: "BORRADOR",
    visible_web: false,
    destacado: false,
    unidad_base: "",
    id_marca: "",
    id_laboratorio: "",
};

const NuevoProducto = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [producto, setProducto] = useState(
        estadoInicialProducto
    );

    const [
        categoriasSeleccionadas,
        setCategoriasSeleccionadas,
    ] = useState([]);

    const [presentaciones, setPresentaciones] =
        useState([]);

    const [marcas, setMarcas] = useState([]);
    const [laboratorios, setLaboratorios] =
        useState([]);
    const [categorias, setCategorias] =
        useState([]);
    const [listasPrecio, setListasPrecio] =
        useState([]);

    const [
        cargandoCatalogos,
        setCargandoCatalogos,
    ] = useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [mensaje, setMensaje] =
        useState("");

    const [tipoMensaje, setTipoMensaje] =
        useState("");

    // =====================================================
    // MENSAJES
    // =====================================================

    const mostrarMensaje = (
        texto,
        tipo = "error"
    ) => {
        setMensaje(texto);
        setTipoMensaje(tipo);
    };

    const cerrarMensaje = () => {
        setMensaje("");
        setTipoMensaje("");
    };

    // =====================================================
    // PETICIÓN AUXILIAR
    // =====================================================

    const solicitar = async (
        url,
        opciones = {},
        mensajeError = "Ocurrió un error"
    ) => {
        const respuesta = await fetch(
            url,
            opciones
        );

        let data = null;

        try {
            data = await respuesta.json();
        } catch {
            data = null;
        }

        if (!respuesta.ok) {
            throw new Error(
                data?.message || mensajeError
            );
        }

        return data;
    };

    // =====================================================
    // CARGAR CATÁLOGOS
    // =====================================================

    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                setCargandoCatalogos(true);

                const [
                    dataMarcas,
                    dataLaboratorios,
                    dataCategorias,
                    dataListasPrecio,
                ] = await Promise.all([
                    solicitar(
                        `${API_CATALOGO}/catalogos/marcas`,
                        {},
                        "No fue posible cargar las marcas"
                    ),

                    solicitar(
                        `${API_CATALOGO}/catalogos/laboratorios`,
                        {},
                        "No fue posible cargar los laboratorios"
                    ),

                    solicitar(
                        `${API_CATALOGO}/catalogos/categorias`,
                        {},
                        "No fue posible cargar las categorías"
                    ),

                    solicitar(
                        `${API_CATALOGO}/catalogos/listas-precio`,
                        {},
                        "No fue posible cargar las listas de precio"
                    ),
                ]);

                setMarcas(
                    Array.isArray(dataMarcas)
                        ? dataMarcas
                        : []
                );

                setLaboratorios(
                    Array.isArray(dataLaboratorios)
                        ? dataLaboratorios
                        : []
                );

                setCategorias(
                    Array.isArray(dataCategorias)
                        ? dataCategorias
                        : []
                );

                setListasPrecio(
                    Array.isArray(dataListasPrecio)
                        ? dataListasPrecio
                        : []
                );
            } catch (error) {
                console.error(
                    "Error cargando catálogos:",
                    error
                );

                mostrarMensaje(
                    error.message ||
                    "No fue posible cargar los catálogos"
                );
            } finally {
                setCargandoCatalogos(false);
            }
        };

        cargarCatalogos();
    }, []);

    // =====================================================
    // PRODUCTO
    // =====================================================

    const handleProductoChange = (
        nuevoProducto
    ) => {
        setProducto(nuevoProducto);
    };

    // =====================================================
    // PRESENTACIONES
    // =====================================================

    const handlePresentacionesChange = (
        nuevasPresentaciones
    ) => {
        /*
         * Preservamos los precios de cada
         * presentación mientras el componente
         * modifica sus demás campos.
         */
        const actualizadas =
            nuevasPresentaciones.map(
                (presentacion, index) => ({
                    ...presentacion,
                    precios:
                        presentacion.precios ??
                        presentaciones[index]
                            ?.precios ??
                        [],
                })
            );

        setPresentaciones(actualizadas);
    };

    // =====================================================
    // PRECIOS DE UNA PRESENTACIÓN
    // =====================================================

    const handlePreciosChange = (
        indexPresentacion,
        nuevosPrecios
    ) => {
        setPresentaciones((prev) =>
            prev.map((presentacion, index) =>
                index === indexPresentacion
                    ? {
                        ...presentacion,
                        precios: nuevosPrecios,
                    }
                    : presentacion
            )
        );
    };

    // =====================================================
    // VALIDAR
    // =====================================================

    const validarFormulario = () => {
        if (!producto.nombre?.trim()) {
            mostrarMensaje(
                "El nombre del producto es obligatorio."
            );
            return false;
        }

        if (!producto.slug?.trim()) {
            mostrarMensaje(
                "El slug del producto es obligatorio."
            );
            return false;
        }

        if (!producto.tipo) {
            mostrarMensaje(
                "Debes seleccionar el tipo de producto."
            );
            return false;
        }

        if (!producto.unidad_base?.trim()) {
            mostrarMensaje(
                "La unidad base es obligatoria."
            );
            return false;
        }

        // CATEGORÍAS
        if (
            categoriasSeleccionadas.length > 0
        ) {
            const principales =
                categoriasSeleccionadas.filter(
                    (categoria) =>
                        categoria.principal ===
                        true
                );

            if (principales.length !== 1) {
                mostrarMensaje(
                    "Debes seleccionar exactamente una categoría principal."
                );
                return false;
            }
        }

        // PRESENTACIONES
        for (
            let i = 0;
            i < presentaciones.length;
            i += 1
        ) {
            const presentacion =
                presentaciones[i];

            if (
                !presentacion.nombre?.trim()
            ) {
                mostrarMensaje(
                    `La presentación ${i + 1
                    } debe tener un nombre.`
                );
                return false;
            }

            if (!presentacion.tipo) {
                mostrarMensaje(
                    `Debes seleccionar el tipo de la presentación ${i + 1
                    }.`
                );
                return false;
            }

            const unidadesBase = Number(
                presentacion.unidades_base
            );

            if (
                !Number.isInteger(
                    unidadesBase
                ) ||
                unidadesBase <= 0
            ) {
                mostrarMensaje(
                    `Las unidades base de la presentación ${i + 1
                    } deben ser un número entero mayor que cero.`
                );
                return false;
            }

            // PRECIOS
            const precios =
                presentacion.precios || [];

            for (
                let j = 0;
                j < precios.length;
                j += 1
            ) {
                const precio = precios[j];

                if (
                    precio.id_lista === "" ||
                    precio.id_lista === null ||
                    precio.id_lista ===
                    undefined
                ) {
                    mostrarMensaje(
                        `Selecciona una lista de precio para el precio ${j + 1
                        } de la presentación ${i + 1
                        }.`
                    );
                    return false;
                }

                if (
                    precio.importe === "" ||
                    precio.importe === null ||
                    precio.importe ===
                    undefined ||
                    !Number.isFinite(
                        Number(precio.importe)
                    ) ||
                    Number(precio.importe) < 0
                ) {
                    mostrarMensaje(
                        `El importe del precio ${j + 1
                        } de la presentación ${i + 1
                        } no es válido.`
                    );
                    return false;
                }

                if (
                    precio.tasa_impuesto ===
                    "" ||
                    precio.tasa_impuesto ===
                    null ||
                    precio.tasa_impuesto ===
                    undefined ||
                    !Number.isFinite(
                        Number(
                            precio.tasa_impuesto
                        )
                    ) ||
                    Number(
                        precio.tasa_impuesto
                    ) < 0
                ) {
                    mostrarMensaje(
                        `La tasa de impuesto del precio ${j + 1
                        } de la presentación ${i + 1
                        } no es válida.`
                    );
                    return false;
                }

                if (!precio.desde) {
                    mostrarMensaje(
                        `Debes indicar la fecha de inicio del precio ${j + 1
                        } de la presentación ${i + 1
                        }.`
                    );
                    return false;
                }

                if (
                    precio.hasta &&
                    new Date(
                        precio.hasta
                    ).getTime() <
                    new Date(
                        precio.desde
                    ).getTime()
                ) {
                    mostrarMensaje(
                        `La fecha final del precio ${j + 1
                        } no puede ser anterior a la fecha inicial.`
                    );
                    return false;
                }
            }
        }

        return true;
    };

    // =====================================================
    // CREAR PRODUCTO
    // =====================================================

    const crearProducto = async () => {
        const payload = {
            nombre: producto.nombre.trim(),

            slug: producto.slug.trim(),

            descripcion_corta:
                producto.descripcion_corta?.trim() ||
                null,

            descripcion_larga:
                producto.descripcion_larga?.trim() ||
                null,

            tipo: producto.tipo,

            requiere_receta:
                producto.requiere_receta ===
                true,

            registro_sanitario:
                producto.registro_sanitario?.trim() ||
                null,

            conservacion:
                producto.conservacion?.trim() ||
                null,

            advertencias:
                producto.advertencias?.trim() ||
                null,

            estado:
                producto.estado ||
                "BORRADOR",

            visible_web:
                producto.visible_web ===
                true,

            destacado:
                producto.destacado === true,

            unidad_base:
                producto.unidad_base.trim(),

            id_marca:
                producto.id_marca !== "" &&
                    producto.id_marca !== null &&
                    producto.id_marca !==
                    undefined
                    ? Number(
                        producto.id_marca
                    )
                    : null,

            id_laboratorio:
                producto.id_laboratorio !==
                    "" &&
                    producto.id_laboratorio !==
                    null &&
                    producto.id_laboratorio !==
                    undefined
                    ? Number(
                        producto.id_laboratorio
                    )
                    : null,
        };

        return solicitar(
            `${API_CATALOGO}/productos/admin`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body: JSON.stringify(
                    payload
                ),
            },
            "No fue posible crear el producto"
        );
    };

    // =====================================================
    // GUARDAR CATEGORÍAS
    // =====================================================

    const guardarCategorias = async (
        idProducto
    ) => {
        if (
            categoriasSeleccionadas.length ===
            0
        ) {
            return;
        }

        const categoriasPayload =
            categoriasSeleccionadas.map(
                (categoria) => ({
                    id_categoria: Number(
                        categoria.id_categoria
                    ),

                    principal:
                        categoria.principal ===
                        true,
                })
            );

        await solicitar(
            `${API_CATALOGO}/producto-categorias/producto/${idProducto}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body: JSON.stringify({
                    categorias:
                        categoriasPayload,
                }),
            },
            "El producto fue creado, pero ocurrió un error al guardar sus categorías"
        );
    };

    // =====================================================
    // CREAR PRESENTACIÓN
    // =====================================================

    const crearPresentacion = async (
        idProducto,
        presentacion
    ) => {
        const payload = {
            sku:
                presentacion.sku?.trim() ||
                null,

            codigo_barras:
                presentacion.codigo_barras?.trim() ||
                null,

            nombre:
                presentacion.nombre.trim(),

            tipo: presentacion.tipo,

            unidades_base: Number(
                presentacion.unidades_base
            ),

            contenido:
                presentacion.contenido !==
                    "" &&
                    presentacion.contenido !==
                    null &&
                    presentacion.contenido !==
                    undefined
                    ? presentacion.contenido
                    : null,

            unidad_contenido:
                presentacion.unidad_contenido?.trim() ||
                null,

            forma_farmaceutica:
                presentacion.forma_farmaceutica?.trim() ||
                null,

            concentracion_descriptiva:
                presentacion.concentracion_descriptiva?.trim() ||
                null,

            permite_venta:
                presentacion.permite_venta !==
                false,

            permite_fraccionamiento:
                presentacion.permite_fraccionamiento ===
                true,

            peso_gramos:
                presentacion.peso_gramos !==
                    "" &&
                    presentacion.peso_gramos !==
                    null &&
                    presentacion.peso_gramos !==
                    undefined
                    ? presentacion.peso_gramos
                    : null,

            estado:
                presentacion.estado ||
                "ACTIVO",

            id_producto: idProducto,
        };

        return solicitar(
            `${API_CATALOGO}/presentaciones`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body: JSON.stringify(
                    payload
                ),
            },
            "Ocurrió un error al crear una presentación"
        );
    };

    // =====================================================
    // CREAR PRECIO
    // =====================================================

    const crearPrecio = async (
        idPresentacion,
        precio
    ) => {
        const payload = {
            importe: Number(
                precio.importe
            ),

            incluye_impuesto:
                precio.incluye_impuesto !==
                false,

            tasa_impuesto: Number(
                precio.tasa_impuesto
            ),

            id_sucursal:
                precio.id_sucursal !== "" &&
                    precio.id_sucursal !== null &&
                    precio.id_sucursal !==
                    undefined
                    ? Number(
                        precio.id_sucursal
                    )
                    : null,

            canal:
                precio.canal?.trim() ||
                "TODOS",

            desde: precio.desde,

            hasta:
                precio.hasta || null,

            id_lista: Number(
                precio.id_lista
            ),

            id_presentacion:
                idPresentacion,
        };

        return solicitar(
            `${API_CATALOGO}/precios`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body: JSON.stringify(
                    payload
                ),
            },
            "Ocurrió un error al crear un precio"
        );
    };

    // =====================================================
    // CREAR PRESENTACIONES Y PRECIOS
    // =====================================================

    const guardarPresentaciones = async (
        idProducto
    ) => {
        for (
            const presentacion of presentaciones
        ) {
            const resultadoPresentacion =
                await crearPresentacion(
                    idProducto,
                    presentacion
                );

            const idPresentacion =
                resultadoPresentacion
                    ?.presentacion
                    ?.id_presentacion_producto;

            if (!idPresentacion) {
                throw new Error(
                    `La presentación "${presentacion.nombre}" fue creada, pero el servidor no devolvió su identificador.`
                );
            }

            const precios =
                presentacion.precios ||
                [];

            for (const precio of precios) {
                await crearPrecio(
                    idPresentacion,
                    precio
                );
            }
        }
    };

    // =====================================================
    // GUARDAR TODO
    // =====================================================

    const handleGuardar = async (
        event
    ) => {
        event.preventDefault();

        cerrarMensaje();

        if (!validarFormulario()) {
            return;
        }

        if (!token) {
            mostrarMensaje(
                "No existe una sesión administrativa válida."
            );
            return;
        }

        try {
            setGuardando(true);

            // =============================================
            // 1. PRODUCTO
            // =============================================

            const resultadoProducto =
                await crearProducto();

            const idProducto =
                resultadoProducto
                    ?.producto
                    ?.id_producto;

            if (!idProducto) {
                throw new Error(
                    "El servidor no devolvió el identificador del producto creado."
                );
            }

            // =============================================
            // 2. CATEGORÍAS
            // =============================================

            await guardarCategorias(
                idProducto
            );

            // =============================================
            // 3. PRESENTACIONES
            // 4. PRECIOS
            // =============================================

            await guardarPresentaciones(
                idProducto
            );

            mostrarMensaje(
                "Producto, categorías, presentaciones y precios registrados correctamente.",
                "exito"
            );

            setTimeout(() => {
                navigate(
                    `/admin/catalogo/ver/${idProducto}`
                );
            }, 1200);
        } catch (error) {
            console.error(
                "Error registrando producto:",
                error
            );

            mostrarMensaje(
                error.message ||
                "No fue posible completar el registro del producto."
            );
        } finally {
            setGuardando(false);
        }
    };

    // =====================================================
    // ESTILOS
    // =====================================================

    const styles = {
        page: {
            minHeight: "100vh",
            backgroundColor: "#f4f7f6",
            padding: "28px",
            boxSizing: "border-box",
            fontFamily:
                '"Segoe UI", Arial, sans-serif',
        },

        container: {
            maxWidth: "1250px",
            margin: "0 auto",
        },

        topBar: {
            display: "flex",
            justifyContent:
                "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "24px",
        },

        titleArea: {
            display: "flex",
            alignItems: "center",
            gap: "14px",
        },

        backButton: {
            width: "42px",
            height: "42px",
            border:
                "1px solid #dce7e3",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            color: "#082b4f",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },

        title: {
            margin: 0,
            color: "#082b4f",
            fontSize: "25px",
            fontWeight: "800",
        },

        subtitle: {
            margin: "5px 0 0",
            color: "#74857f",
            fontSize: "13px",
        },

        status: {
            padding: "7px 11px",
            borderRadius: "20px",
            backgroundColor: "#fff7dd",
            color: "#9b7410",
            fontWeight: "700",
            fontSize: "11px",
        },

        loadingBox: {
            backgroundColor: "#ffffff",
            border:
                "1px solid #e2ebe7",
            borderRadius: "15px",
            padding: "40px",
            textAlign: "center",
            color: "#6f817b",
        },

        priceArea: {
            marginBottom: "20px",
        },

        priceHeading: {
            display: "flex",
            alignItems: "center",
            gap: "9px",
            margin: "0 0 10px",
            color: "#082b4f",
            fontSize: "14px",
            fontWeight: "800",
        },

        priceNumber: {
            width: "27px",
            height: "27px",
            borderRadius: "8px",
            backgroundColor: "#eaf7f0",
            color: "#159447",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
        },

        actions: {
            backgroundColor: "#ffffff",
            border:
                "1px solid #e2ebe7",
            borderRadius: "15px",
            padding: "18px 22px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
        },

        cancelButton: {
            border:
                "1px solid #dce7e3",
            backgroundColor: "#ffffff",
            color: "#526761",
            padding: "11px 18px",
            borderRadius: "9px",
            fontWeight: "700",
            cursor: guardando
                ? "default"
                : "pointer",
        },

        saveButton: {
            border: "none",
            backgroundColor: "#159447",
            color: "#ffffff",
            padding: "11px 20px",
            borderRadius: "9px",
            fontWeight: "700",
            cursor: guardando
                ? "default"
                : "pointer",
            opacity: guardando
                ? 0.65
                : 1,
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },

        overlay: {
            position: "fixed",
            inset: 0,
            backgroundColor:
                "rgba(5,29,48,0.48)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
        },

        popup: {
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "28px",
            boxShadow:
                "0 20px 55px rgba(0,0,0,0.22)",
            textAlign: "center",
        },

        popupIcon: {
            width: "55px",
            height: "55px",
            margin: "0 auto 15px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
        },

        popupTitle: {
            color: "#082b4f",
            margin: "0 0 8px",
            fontSize: "19px",
        },

        popupText: {
            color: "#687b75",
            fontSize: "13px",
            lineHeight: "1.55",
        },

        popupButton: {
            marginTop: "20px",
            border: "none",
            backgroundColor: "#082b4f",
            color: "#ffffff",
            padding: "10px 22px",
            borderRadius: "9px",
            fontWeight: "700",
            cursor: "pointer",
        },
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.topBar}>
                    <div
                        style={
                            styles.titleArea
                        }
                    >
                        <button
                            type="button"
                            style={
                                styles.backButton
                            }
                            onClick={() =>
                                navigate(
                                    "/admin/catalogo"
                                )
                            }
                        >
                            <FaArrowLeft />
                        </button>

                        <div>
                            <h1
                                style={
                                    styles.title
                                }
                            >
                                Nuevo producto
                            </h1>

                            <p
                                style={
                                    styles.subtitle
                                }
                            >
                                Registra la
                                información completa
                                del producto.
                            </p>
                        </div>
                    </div>

                    <span
                        style={
                            styles.status
                        }
                    >
                        NUEVO PRODUCTO
                    </span>
                </div>

                {cargandoCatalogos ? (
                    <div
                        style={
                            styles.loadingBox
                        }
                    >
                        Cargando información
                        del catálogo...
                    </div>
                ) : (
                    <form
                        onSubmit={
                            handleGuardar
                        }
                    >
                        <DatosProducto
                            datos={producto}
                            onChange={
                                handleProductoChange
                            }
                            marcas={marcas}
                            laboratorios={
                                laboratorios
                            }
                            disabled={
                                guardando
                            }
                        />

                        <CategoriasProducto
                            categorias={
                                categorias
                            }
                            seleccionadas={
                                categoriasSeleccionadas
                            }
                            onChange={
                                setCategoriasSeleccionadas
                            }
                            disabled={
                                guardando
                            }
                        />

                        <PresentacionesProducto
                            presentaciones={
                                presentaciones
                            }
                            onChange={
                                handlePresentacionesChange
                            }
                            disabled={
                                guardando
                            }
                        />

                        {presentaciones.map(
                            (
                                presentacion,
                                index
                            ) => (
                                <div
                                    key={
                                        presentacion.id_presentacion_producto ||
                                        `precios-${index}`
                                    }
                                    style={
                                        styles.priceArea
                                    }
                                >
                                    <div
                                        style={
                                            styles.priceHeading
                                        }
                                    >
                                        <span
                                            style={
                                                styles.priceNumber
                                            }
                                        >
                                            <FaMoneyBillWave />
                                        </span>

                                        Precios de{" "}
                                        {presentacion.nombre ||
                                            `Presentación ${index +
                                            1
                                            }`}
                                    </div>

                                    <PreciosProducto
                                        precios={
                                            presentacion.precios ||
                                            []
                                        }
                                        listasPrecio={
                                            listasPrecio
                                        }
                                        onChange={(
                                            nuevosPrecios
                                        ) =>
                                            handlePreciosChange(
                                                index,
                                                nuevosPrecios
                                            )
                                        }
                                        disabled={
                                            guardando
                                        }
                                    />
                                </div>
                            )
                        )}

                        <div
                            style={
                                styles.actions
                            }
                        >
                            <button
                                type="button"
                                disabled={
                                    guardando
                                }
                                onClick={() =>
                                    navigate(
                                        "/admin/catalogo"
                                    )
                                }
                                style={
                                    styles.cancelButton
                                }
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    guardando
                                }
                                style={
                                    styles.saveButton
                                }
                            >
                                <FaSave />

                                {guardando
                                    ? "Guardando..."
                                    : "Guardar producto"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {mensaje && (
                <div
                    style={
                        styles.overlay
                    }
                >
                    <div
                        style={
                            styles.popup
                        }
                    >
                        <div
                            style={{
                                ...styles.popupIcon,

                                backgroundColor:
                                    tipoMensaje ===
                                        "exito"
                                        ? "#eaf7f0"
                                        : "#fff0ee",

                                color:
                                    tipoMensaje ===
                                        "exito"
                                        ? "#159447"
                                        : "#c0392b",
                            }}
                        >
                            {tipoMensaje ===
                                "exito" ? (
                                <FaCheckCircle />
                            ) : (
                                <FaExclamationTriangle />
                            )}
                        </div>

                        <h3
                            style={
                                styles.popupTitle
                            }
                        >
                            {tipoMensaje ===
                                "exito"
                                ? "Producto registrado"
                                : "No fue posible continuar"}
                        </h3>

                        <p
                            style={
                                styles.popupText
                            }
                        >
                            {mensaje}
                        </p>

                        {tipoMensaje !==
                            "exito" && (
                                <button
                                    type="button"
                                    onClick={
                                        cerrarMensaje
                                    }
                                    style={
                                        styles.popupButton
                                    }
                                >
                                    Entendido
                                </button>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NuevoProducto;