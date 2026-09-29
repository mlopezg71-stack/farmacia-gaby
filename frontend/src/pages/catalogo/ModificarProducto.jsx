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

const ModificarProducto = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    // =====================================================
    // ESTADOS
    // =====================================================

    const [producto, setProducto] = useState(null);

    const [
        categoriasSeleccionadas,
        setCategoriasSeleccionadas,
    ] = useState([]);

    const [
        presentaciones,
        setPresentaciones,
    ] = useState([]);

    const [marcas, setMarcas] = useState([]);
    const [laboratorios, setLaboratorios] =
        useState([]);
    const [categorias, setCategorias] =
        useState([]);
    const [listasPrecio, setListasPrecio] =
        useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [mensaje, setMensaje] =
        useState(null);

    // =====================================================
    // NORMALIZAR RESPUESTAS
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

        if (
            Array.isArray(
                respuesta?.laboratorios
            )
        ) {
            return respuesta.laboratorios;
        }

        if (
            Array.isArray(
                respuesta?.categorias
            )
        ) {
            return respuesta.categorias;
        }

        if (
            Array.isArray(
                respuesta?.listasPrecio
            )
        ) {
            return respuesta.listasPrecio;
        }

        if (
            Array.isArray(
                respuesta?.listas_precio
            )
        ) {
            return respuesta.listas_precio;
        }

        return [];
    };

    // =====================================================
    // CATEGORÍAS
    // =====================================================

    const normalizarCategoriasProducto = (
        datos = []
    ) => {
        if (!Array.isArray(datos)) {
            return [];
        }

        return datos
            .map((item) => {
                const idCategoria =
                    item.id_categoria ??
                    item.categoria
                        ?.id_categoria;

                if (!idCategoria) {
                    return null;
                }

                return {
                    id_categoria:
                        Number(idCategoria),

                    principal:
                        Boolean(
                            item.principal
                        ),
                };
            })
            .filter(Boolean);
    };

    // =====================================================
    // FECHA PARA INPUT DATETIME-LOCAL
    // =====================================================

    const fechaParaInput = (fecha) => {
        if (!fecha) {
            return "";
        }

        return String(fecha).slice(
            0,
            16
        );
    };

    // =====================================================
    // PRESENTACIONES
    // =====================================================

    const normalizarPresentaciones = (
        datos = []
    ) => {
        if (!Array.isArray(datos)) {
            return [];
        }

        return datos.map(
            (presentacion) => ({
                ...presentacion,

                id_presentacion_producto:
                    presentacion.id_presentacion_producto ??
                    null,

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
                    "1",

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

                            id_precio_presentacion:
                                precio.id_precio_presentacion ??
                                null,

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
                                "12",

                            id_sucursal:
                                precio.id_sucursal ??
                                "",

                            canal:
                                precio.canal ??
                                "TODOS",

                            desde:
                                fechaParaInput(
                                    precio.desde
                                ),

                            hasta:
                                fechaParaInput(
                                    precio.hasta
                                ),
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
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setMensaje(null);

                const [
                    respuestaProducto,
                    respuestaMarcas,
                    respuestaLaboratorios,
                    respuestaCategorias,
                    respuestaListas,
                ] = await Promise.all([
                    fetch(
                        `${API_CATALOGO}/productos/admin/${id}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    ),

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

                if (
                    !respuestaProducto.ok
                ) {
                    const errorProducto =
                        await respuestaProducto
                            .json()
                            .catch(
                                () => ({})
                            );

                    throw new Error(
                        errorProducto.message ||
                        errorProducto.error ||
                        "No fue posible cargar el producto."
                    );
                }

                const [
                    resultadoProducto,
                    resultadoMarcas,
                    resultadoLaboratorios,
                    resultadoCategorias,
                    resultadoListas,
                ] = await Promise.all([
                    respuestaProducto.json(),

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

                const productoRecibido =
                    resultadoProducto
                        ?.producto ??
                    resultadoProducto;

                if (
                    !productoRecibido
                        ?.id_producto
                ) {
                    throw new Error(
                        "No se encontró el producto."
                    );
                }

                // =====================================
                // CATÁLOGOS
                // =====================================

                setMarcas(
                    normalizarArray(
                        resultadoMarcas
                    )
                );

                setLaboratorios(
                    normalizarArray(
                        resultadoLaboratorios
                    )
                );

                setCategorias(
                    normalizarArray(
                        resultadoCategorias
                    )
                );

                setListasPrecio(
                    normalizarArray(
                        resultadoListas
                    )
                );

                // =====================================
                // PRODUCTO
                // =====================================

                setProducto({
                    id_producto:
                        productoRecibido.id_producto,

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

                // =====================================
                // CATEGORÍAS
                // =====================================

                setCategoriasSeleccionadas(
                    normalizarCategoriasProducto(
                        productoRecibido
                            .categorias ??
                        productoRecibido
                            .productoCategorias ??
                        []
                    )
                );

                // =====================================
                // PRESENTACIONES
                // =====================================

                setPresentaciones(
                    normalizarPresentaciones(
                        productoRecibido
                            .presentaciones ??
                        []
                    )
                );
            } catch (error) {
                console.error(
                    "Error cargando producto:",
                    error
                );

                setMensaje({
                    tipo: "error",
                    texto:
                        error.message ||
                        "Ocurrió un error al cargar el producto.",
                });
            } finally {
                setCargando(false);
            }
        };

        if (id && token) {
            cargarDatos();
        }
    }, [id, token]);

    // =====================================================
    // MODIFICAR DATOS DEL PRODUCTO
    // =====================================================

    const cambiarProducto = (nuevoProducto) => {
        setProducto(nuevoProducto);
    };

    // =====================================================
    // MODIFICAR PRECIOS DE UNA PRESENTACIÓN
    // =====================================================

    const cambiarPreciosPresentacion = (
        indexPresentacion,
        nuevosPrecios
    ) => {
        setPresentaciones((prev) =>
            prev.map(
                (
                    presentacion,
                    index
                ) =>
                    index ===
                        indexPresentacion
                        ? {
                            ...presentacion,
                            precios:
                                nuevosPrecios,
                        }
                        : presentacion
            )
        );
    };

    // =====================================================
    // VALIDACIÓN
    // =====================================================

    const validarFormulario = () => {
        if (!producto?.nombre?.trim()) {
            return "El nombre del producto es obligatorio.";
        }

        if (!producto?.slug?.trim()) {
            return "El slug del producto es obligatorio.";
        }

        if (!producto?.tipo) {
            return "El tipo de producto es obligatorio.";
        }

        if (
            !producto?.unidad_base?.trim()
        ) {
            return "La unidad base es obligatoria.";
        }

        if (
            categoriasSeleccionadas.length >
            0
        ) {
            const principales =
                categoriasSeleccionadas.filter(
                    (categoria) =>
                        categoria.principal
                );

            if (
                principales.length !== 1
            ) {
                return "Debe existir exactamente una categoría principal.";
            }
        }

        for (
            let i = 0;
            i < presentaciones.length;
            i++
        ) {
            const presentacion =
                presentaciones[i];

            if (
                !presentacion.nombre?.trim()
            ) {
                return `La presentación ${i + 1
                    } debe tener nombre.`;
            }

            if (!presentacion.tipo) {
                return `La presentación ${i + 1
                    } debe tener tipo.`;
            }

            if (
                !presentacion.unidades_base ||
                Number(
                    presentacion.unidades_base
                ) <= 0
            ) {
                return `La presentación ${i + 1
                    } debe tener unidades base válidas.`;
            }

            const precios =
                presentacion.precios ??
                [];

            for (
                let j = 0;
                j < precios.length;
                j++
            ) {
                const precio =
                    precios[j];

                if (!precio.id_lista) {
                    return `El precio ${j + 1
                        } de la presentación ${i + 1
                        } debe tener una lista de precio.`;
                }

                if (
                    precio.importe === "" ||
                    Number(
                        precio.importe
                    ) < 0
                ) {
                    return `El precio ${j + 1
                        } de la presentación ${i + 1
                        } debe tener un importe válido.`;
                }

                if (!precio.desde) {
                    return `El precio ${j + 1
                        } de la presentación ${i + 1
                        } debe tener fecha de inicio.`;
                }

                if (
                    precio.hasta &&
                    new Date(
                        precio.hasta
                    ) <
                    new Date(
                        precio.desde
                    )
                ) {
                    return `La fecha final del precio ${j + 1
                        } no puede ser anterior a la fecha inicial.`;
                }
            }
        }

        return null;
    };

    // =====================================================
    // PAYLOAD PRODUCTO
    // =====================================================

    const construirPayloadProducto =
        () => ({
            nombre:
                producto.nombre.trim(),

            slug:
                producto.slug.trim(),

            descripcion_corta:
                producto.descripcion_corta?.trim() ||
                null,

            descripcion_larga:
                producto.descripcion_larga?.trim() ||
                null,

            tipo:
                producto.tipo,

            requiere_receta:
                Boolean(
                    producto.requiere_receta
                ),

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
                producto.estado,

            visible_web:
                Boolean(
                    producto.visible_web
                ),

            destacado:
                Boolean(
                    producto.destacado
                ),

            unidad_base:
                producto.unidad_base.trim(),

            id_marca:
                producto.id_marca
                    ? Number(
                        producto.id_marca
                    )
                    : null,

            id_laboratorio:
                producto.id_laboratorio
                    ? Number(
                        producto.id_laboratorio
                    )
                    : null,
        });

    // =====================================================
    // PAYLOAD PRESENTACIÓN
    // =====================================================

    const construirPayloadPresentacion = (
        presentacion
    ) => ({
        sku:
            presentacion.sku?.trim() ||
            null,

        codigo_barras:
            presentacion.codigo_barras?.trim() ||
            null,

        nombre:
            presentacion.nombre.trim(),

        tipo:
            presentacion.tipo,

        unidades_base:
            Number(
                presentacion.unidades_base
            ),

        contenido:
            presentacion.contenido ===
                ""
                ? null
                : Number(
                    presentacion.contenido
                ),

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
            Boolean(
                presentacion.permite_venta
            ),

        permite_fraccionamiento:
            Boolean(
                presentacion.permite_fraccionamiento
            ),

        peso_gramos:
            presentacion.peso_gramos ===
                ""
                ? null
                : Number(
                    presentacion.peso_gramos
                ),

        estado:
            presentacion.estado,

        id_producto:
            Number(id),
    });

    // =====================================================
    // PAYLOAD PRECIO
    // =====================================================

    const construirPayloadPrecio = (
        precio,
        idPresentacion
    ) => ({
        importe:
            Number(precio.importe),

        incluye_impuesto:
            Boolean(
                precio.incluye_impuesto
            ),

        tasa_impuesto:
            precio.tasa_impuesto ===
                ""
                ? 0
                : Number(
                    precio.tasa_impuesto
                ),

        id_sucursal:
            precio.id_sucursal ===
                ""
                ? null
                : Number(
                    precio.id_sucursal
                ),

        canal:
            precio.canal ||
            "TODOS",

        desde:
            precio.desde,

        hasta:
            precio.hasta ||
            null,

        id_lista:
            Number(
                precio.id_lista
            ),

        id_presentacion:
            Number(
                idPresentacion
            ),
    });

    // =====================================================
    // PETICIÓN CON VALIDACIÓN
    // =====================================================

    const enviarJSON = async (
        url,
        metodo,
        body
    ) => {
        const respuesta = await fetch(
            url,
            {
                method: metodo,

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body:
                    JSON.stringify(
                        body
                    ),
            }
        );

        const resultado =
            await respuesta
                .json()
                .catch(() => ({}));

        if (!respuesta.ok) {
            throw new Error(
                resultado.message ||
                resultado.error ||
                "No fue posible guardar los cambios."
            );
        }

        return resultado;
    };

    // =====================================================
    // GUARDAR
    // =====================================================

    const guardarCambios = async () => {
        if (guardando) {
            return;
        }

        const errorValidacion =
            validarFormulario();

        if (errorValidacion) {
            setMensaje({
                tipo: "error",
                texto:
                    errorValidacion,
            });

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return;
        }

        try {
            setGuardando(true);
            setMensaje(null);

            // =========================================
            // 1. PRODUCTO
            // =========================================

            await enviarJSON(
                `${API_CATALOGO}/productos/admin/${id}`,
                "PUT",
                construirPayloadProducto()
            );

            // =========================================
            // 2. CATEGORÍAS
            // =========================================

            await enviarJSON(
                `${API_CATALOGO}/producto-categorias/producto/${id}`,
                "PUT",
                {
                    categorias:
                        categoriasSeleccionadas.map(
                            (
                                categoria
                            ) => ({
                                id_categoria:
                                    Number(
                                        categoria.id_categoria
                                    ),

                                principal:
                                    Boolean(
                                        categoria.principal
                                    ),
                            })
                        ),
                }
            );

            // =========================================
            // 3. PRESENTACIONES
            // =========================================

            for (
                const presentacion of presentaciones
            ) {
                let idPresentacion =
                    presentacion.id_presentacion_producto;

                const payloadPresentacion =
                    construirPayloadPresentacion(
                        presentacion
                    );

                // -------------------------------------
                // EXISTENTE
                // -------------------------------------

                if (idPresentacion) {
                    await enviarJSON(
                        `${API_CATALOGO}/presentaciones/${idPresentacion}`,
                        "PUT",
                        payloadPresentacion
                    );
                }

                // -------------------------------------
                // NUEVA
                // -------------------------------------

                else {
                    const resultado =
                        await enviarJSON(
                            `${API_CATALOGO}/presentaciones`,
                            "POST",
                            payloadPresentacion
                        );

                    idPresentacion =
                        resultado
                            ?.presentacion
                            ?.id_presentacion_producto ??
                        resultado
                            ?.id_presentacion_producto;

                    if (!idPresentacion) {
                        throw new Error(
                            `No fue posible obtener el ID de la presentación "${presentacion.nombre}".`
                        );
                    }
                }

                // =====================================
                // 4. PRECIOS DE LA PRESENTACIÓN
                // =====================================

                for (
                    const precio of
                    presentacion.precios ??
                    []
                ) {
                    const payloadPrecio =
                        construirPayloadPrecio(
                            precio,
                            idPresentacion
                        );

                    // ---------------------------------
                    // PRECIO EXISTENTE
                    // ---------------------------------

                    if (
                        precio.id_precio_presentacion
                    ) {
                        await enviarJSON(
                            `${API_CATALOGO}/precios/${precio.id_precio_presentacion}`,
                            "PUT",
                            payloadPrecio
                        );
                    }

                    // ---------------------------------
                    // PRECIO NUEVO
                    // ---------------------------------

                    else {
                        await enviarJSON(
                            `${API_CATALOGO}/precios`,
                            "POST",
                            payloadPrecio
                        );
                    }
                }
            }

            // =========================================
            // ÉXITO
            // =========================================

            setMensaje({
                tipo: "exito",
                texto:
                    "Producto modificado correctamente.",
            });

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            setTimeout(() => {
                navigate(
                    `/admin/catalogo/ver/${id}`
                );
            }, 1200);
        } catch (error) {
            console.error(
                "Error modificando producto:",
                error
            );

            setMensaje({
                tipo: "error",
                texto:
                    error.message ||
                    "Ocurrió un error al modificar el producto.",
            });

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
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
            fontFamily:
                '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            padding: "25px 35px 40px",
            boxSizing: "border-box",
        },

        topBar: {
            display: "flex",
            justifyContent:
                "space-between",
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
            border:
                "1px solid #dce7e3",
            backgroundColor:
                "#ffffff",
            color: "#082b4f",
            display: "flex",
            alignItems: "center",
            justifyContent:
                "center",
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

        saveButton: {
            border: "none",
            borderRadius: "10px",
            backgroundColor:
                guardando
                    ? "#7db99a"
                    : "#159447",
            color: "#ffffff",
            padding: "11px 17px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: "700",
            cursor:
                guardando
                    ? "default"
                    : "pointer",
        },

        message: {
            borderRadius: "11px",
            padding: "13px 15px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "12px",
            fontWeight: "600",
        },

        loading: {
            minHeight: "450px",
            display: "flex",
            alignItems: "center",
            justifyContent:
                "center",
            color: "#71817c",
            fontSize: "14px",
        },

        pricesBlock: {
            marginTop: "15px",
            paddingLeft: "18px",
            borderLeft:
                "3px solid #e2ebe7",
        },

        pricesTitle: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
            color: "#082b4f",
            fontSize: "13px",
            fontWeight: "700",
        },
    };

    // =====================================================
    // CARGANDO
    // =====================================================

    if (cargando) {
        return (
            <div style={styles.page}>
                <div
                    style={
                        styles.loading
                    }
                >
                    Cargando producto...
                </div>
            </div>
        );
    }

    // =====================================================
    // SIN PRODUCTO
    // =====================================================

    if (!producto) {
        return (
            <div style={styles.page}>
                <div
                    style={{
                        ...styles.message,
                        backgroundColor:
                            "#fff7f7",
                        border:
                            "1px solid #f0d8d8",
                        color:
                            "#a93226",
                    }}
                >
                    <FaExclamationTriangle />

                    {mensaje?.texto ||
                        "No fue posible cargar el producto."}
                </div>

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
                                `/admin/catalogo/ver/${id}`
                            )
                        }
                        title="Volver"
                    >
                        <FaArrowLeft />
                    </button>

                    <div>
                        <h1
                            style={
                                styles.title
                            }
                        >
                            Modificar producto
                        </h1>

                        <p
                            style={
                                styles.subtitle
                            }
                        >
                            Actualiza la información
                            del producto seleccionado.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    style={
                        styles.saveButton
                    }
                    disabled={
                        guardando
                    }
                    onClick={
                        guardarCambios
                    }
                >
                    <FaSave />

                    {guardando
                        ? "Guardando..."
                        : "Guardar modificaciones"}
                </button>
            </div>

            {/* =========================================
                MENSAJE
            ========================================= */}

            {mensaje && (
                <div
                    style={{
                        ...styles.message,

                        backgroundColor:
                            mensaje.tipo ===
                                "exito"
                                ? "#eaf7f0"
                                : "#fff7f7",

                        border:
                            mensaje.tipo ===
                                "exito"
                                ? "1px solid #cde9d9"
                                : "1px solid #f0d8d8",

                        color:
                            mensaje.tipo ===
                                "exito"
                                ? "#117a3d"
                                : "#a93226",
                    }}
                >
                    {mensaje.tipo ===
                        "exito" ? (
                        <FaCheckCircle />
                    ) : (
                        <FaExclamationTriangle />
                    )}

                    {mensaje.texto}
                </div>
            )}

            {/* =========================================
                INFORMACIÓN DEL PRODUCTO
            ========================================= */}

            <DatosProducto
                datos={producto}
                onChange={
                    cambiarProducto
                }
                marcas={marcas}
                laboratorios={
                    laboratorios
                }
                disabled={
                    guardando
                }
            />

            {/* =========================================
                CATEGORÍAS
            ========================================= */}

            <CategoriasProducto
                categorias={categorias}
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

            {/* =========================================
                PRESENTACIONES
            ========================================= */}

            <PresentacionesProducto
                presentaciones={
                    presentaciones
                }
                onChange={
                    setPresentaciones
                }
                disabled={
                    guardando
                }
            />

            {/* =========================================
                PRECIOS POR PRESENTACIÓN
            ========================================= */}

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
                            styles.pricesBlock
                        }
                    >
                        <div
                            style={
                                styles.pricesTitle
                            }
                        >
                            <FaMoneyBillWave />

                            Precios de{" "}
                            {presentacion.nombre ||
                                `Presentación ${index +
                                1
                                }`}
                        </div>

                        <PreciosProducto
                            precios={
                                presentacion.precios ??
                                []
                            }
                            listasPrecio={
                                listasPrecio
                            }
                            onChange={(
                                nuevosPrecios
                            ) =>
                                cambiarPreciosPresentacion(
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
        </div>
    );
};

export default ModificarProducto;