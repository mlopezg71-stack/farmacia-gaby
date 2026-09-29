import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    FaSearch,
    FaShoppingCart,
    FaPills,
} from "react-icons/fa";

import HeaderPublico from "../../components/public/HeaderPublico";
import FooterPublico from "../../components/public/FooterPublico";

const Productos = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const categoriaUrl = searchParams.get("categoria");

    const [busqueda, setBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
        categoriaUrl || "Todas"
    );
    const [filtroReceta, setFiltroReceta] = useState("todos");
    const [orden, setOrden] = useState("nombre");

    // ======================================================
    // DATOS REALES
    // ======================================================

    const [productosBackend, setProductosBackend] = useState([]);
    const [categoriasBackend, setCategoriasBackend] = useState([]);
    const [existenciasBackend, setExistenciasBackend] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // ======================================================
    // CARGAR CATÁLOGO + CATEGORÍAS + INVENTARIO
    // ======================================================

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError("");

                const [
                    respuestaProductos,
                    respuestaCategorias,
                    respuestaExistencias,
                ] = await Promise.all([
                    fetch("http://localhost:3002/productos"),
                    fetch("http://localhost:3002/catalogos/categorias"),
                    fetch("http://localhost:3003/existencias/resumen"),
                ]);

                if (!respuestaProductos.ok) {
                    throw new Error(
                        "No fue posible cargar los productos"
                    );
                }

                if (!respuestaCategorias.ok) {
                    throw new Error(
                        "No fue posible cargar las categorías"
                    );
                }

                if (!respuestaExistencias.ok) {
                    throw new Error(
                        "No fue posible cargar las existencias"
                    );
                }

                const productos = await respuestaProductos.json();
                const categorias = await respuestaCategorias.json();
                const existencias = await respuestaExistencias.json();

                setProductosBackend(
                    Array.isArray(productos) ? productos : []
                );

                setCategoriasBackend(
                    Array.isArray(categorias) ? categorias : []
                );

                setExistenciasBackend(
                    Array.isArray(existencias) ? existencias : []
                );
            } catch (error) {
                console.error(
                    "Error al cargar productos:",
                    error
                );

                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    // ======================================================
    // CATEGORÍAS REALES
    // ======================================================

    const categorias = useMemo(() => {
        return [
            "Todas",
            ...categoriasBackend
                .filter(
                    (categoria) =>
                        categoria?.nombre &&
                        categoria?.activa !== false
                )
                .map((categoria) => categoria.nombre),
        ];
    }, [categoriasBackend]);

    // ======================================================
    // CONSTRUIR PRODUCTOS PARA CONSERVAR EL MISMO DISEÑO
    // ======================================================

    const productos = useMemo(() => {
        const resultado = [];

        productosBackend.forEach((producto) => {
            const presentaciones =
                producto.rel_presentacion_producto_id_producto || [];

            const categoriasProducto =
                producto.rel_producto_categoria_id_producto || [];

            const categoriaPrincipal =
                categoriasProducto.find(
                    (relacion) => relacion.principal === true
                ) || categoriasProducto[0];

            const nombreCategoria =
                categoriaPrincipal?.ref_id_categoria?.nombre ||
                "Sin categoría";

            presentaciones.forEach((presentacion) => {
                const precios =
                    presentacion
                        .rel_precio_presentacion_id_presentacion || [];

                const ahora = new Date();

                const preciosVigentes = precios.filter((precio) => {
                    const desde = precio.desde
                        ? new Date(precio.desde)
                        : null;

                    const hasta = precio.hasta
                        ? new Date(precio.hasta)
                        : null;

                    const yaInicio =
                        !desde || desde <= ahora;

                    const noFinalizo =
                        !hasta || hasta >= ahora;

                    return yaInicio && noFinalizo;
                });

                const precioSeleccionado =
                    preciosVigentes
                        .sort(
                            (a, b) =>
                                new Date(b.desde || 0) -
                                new Date(a.desde || 0)
                        )[0] ||
                    precios
                        .sort(
                            (a, b) =>
                                new Date(b.desde || 0) -
                                new Date(a.desde || 0)
                        )[0];

                const idPresentacion =
                    presentacion.id_presentacion_producto;

                const stockDisponible = existenciasBackend
                    .filter(
                        (existencia) =>
                            Number(existencia.id_presentacion) ===
                            Number(idPresentacion)
                    )
                    .reduce(
                        (total, existencia) =>
                            total +
                            Number(
                                existencia.cantidad_disponible || 0
                            ),
                        0
                    );

                resultado.push({
                    id: idPresentacion,

                    nombre:
                        presentacion.nombre ||
                        producto.nombre,

                    precio: Number(
                        precioSeleccionado?.importe || 0
                    ),

                    stock: stockDisponible,

                    requiereReceta:
                        producto.requiere_receta === true,

                    categoria: nombreCategoria,

                    idProducto: producto.id_producto,

                    idPresentacion,

                    sku: presentacion.sku || null,

                    marca:
                        producto.ref_id_marca?.nombre || null,

                    laboratorio:
                        producto.ref_id_laboratorio?.nombre ||
                        null,
                });
            });
        });

        return resultado;
    }, [productosBackend, existenciasBackend]);

    // ======================================================
    // SELECCIONAR CATEGORÍA
    // ======================================================

    const seleccionarCategoria = (categoria) => {
        setCategoriaSeleccionada(categoria);

        if (categoria === "Todas") {
            searchParams.delete("categoria");
        } else {
            searchParams.set("categoria", categoria);
        }

        setSearchParams(searchParams);
    };

    // ======================================================
    // FILTRAR PRODUCTOS
    // ======================================================

    const productosFiltrados = useMemo(() => {
        let resultado = [...productos];

        if (busqueda.trim()) {
            resultado = resultado.filter((producto) =>
                producto.nombre
                    .toLowerCase()
                    .includes(busqueda.toLowerCase())
            );
        }

        if (categoriaSeleccionada !== "Todas") {
            resultado = resultado.filter(
                (producto) =>
                    producto.categoria === categoriaSeleccionada
            );
        }

        if (filtroReceta === "receta") {
            resultado = resultado.filter(
                (producto) => producto.requiereReceta
            );
        }

        if (filtroReceta === "sin-receta") {
            resultado = resultado.filter(
                (producto) => !producto.requiereReceta
            );
        }

        if (orden === "precio-menor") {
            resultado.sort(
                (a, b) => a.precio - b.precio
            );
        }

        if (orden === "precio-mayor") {
            resultado.sort(
                (a, b) => b.precio - a.precio
            );
        }

        if (orden === "nombre") {
            resultado.sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            );
        }

        return resultado;
    }, [
        productos,
        busqueda,
        categoriaSeleccionada,
        filtroReceta,
        orden,
    ]);

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f7f9fc",
                fontFamily: "Arial, sans-serif",
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
                {/* ENCABEZADO */}
                <div
                    style={{
                        marginBottom: "30px",
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 8px",
                            color: "#174a8b",
                            fontSize: "32px",
                            fontWeight: "800",
                        }}
                    >
                        Productos
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#6b7280",
                            fontSize: "15px",
                        }}
                    >
                        Encuentra los productos disponibles en Farmacia Gaby.
                    </p>
                </div>

                {/* BUSCADOR Y ORDEN */}
                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "25px",
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            flex: "1 1 500px",
                        }}
                    >
                        <FaSearch
                            style={{
                                position: "absolute",
                                left: "18px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#7b8794",
                            }}
                        />

                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) =>
                                setBusqueda(e.target.value)
                            }
                            placeholder="Buscar producto por nombre..."
                            style={{
                                width: "100%",
                                height: "48px",
                                border: "1px solid #dce2e8",
                                borderRadius: "10px",
                                padding: "0 18px 0 48px",
                                fontSize: "14px",
                                outline: "none",
                                backgroundColor: "#ffffff",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    <select
                        value={orden}
                        onChange={(e) => setOrden(e.target.value)}
                        style={{
                            height: "48px",
                            minWidth: "210px",
                            border: "1px solid #dce2e8",
                            borderRadius: "10px",
                            padding: "0 14px",
                            backgroundColor: "#ffffff",
                            color: "#334155",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                        }}
                    >
                        <option value="nombre">
                            Ordenar por nombre
                        </option>

                        <option value="precio-menor">
                            Precio: menor a mayor
                        </option>

                        <option value="precio-mayor">
                            Precio: mayor a menor
                        </option>
                    </select>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "250px minmax(0, 1fr)",
                        gap: "28px",
                        alignItems: "start",
                    }}
                >
                    {/* FILTROS */}
                    <aside
                        style={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "14px",
                            padding: "22px",
                        }}
                    >
                        <h3
                            style={{
                                margin: "0 0 18px",
                                color: "#174a8b",
                                fontSize: "17px",
                            }}
                        >
                            Categorías
                        </h3>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                            }}
                        >
                            {categorias.map((categoria) => {
                                const activa =
                                    categoriaSeleccionada === categoria;

                                return (
                                    <button
                                        key={categoria}
                                        type="button"
                                        onClick={() =>
                                            seleccionarCategoria(categoria)
                                        }
                                        style={{
                                            border: "none",
                                            borderRadius: "7px",
                                            padding: "9px 10px",
                                            textAlign: "left",
                                            backgroundColor: activa
                                                ? "#eef6ff"
                                                : "transparent",
                                            color: activa
                                                ? "#174a8b"
                                                : "#475569",
                                            fontSize: "13px",
                                            fontWeight: activa
                                                ? "700"
                                                : "500",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {categoria}
                                    </button>
                                );
                            })}
                        </div>

                        <div
                            style={{
                                borderTop: "1px solid #e5e7eb",
                                marginTop: "20px",
                                paddingTop: "20px",
                            }}
                        >
                            <h3
                                style={{
                                    margin: "0 0 14px",
                                    color: "#174a8b",
                                    fontSize: "17px",
                                }}
                            >
                                Tipo de producto
                            </h3>

                            <select
                                value={filtroReceta}
                                onChange={(e) =>
                                    setFiltroReceta(e.target.value)
                                }
                                style={{
                                    width: "100%",
                                    height: "42px",
                                    border: "1px solid #dce2e8",
                                    borderRadius: "8px",
                                    padding: "0 10px",
                                    backgroundColor: "#ffffff",
                                    color: "#475569",
                                    outline: "none",
                                }}
                            >
                                <option value="todos">
                                    Todos
                                </option>

                                <option value="sin-receta">
                                    Sin receta
                                </option>

                                <option value="receta">
                                    Requiere receta
                                </option>
                            </select>
                        </div>
                    </aside>

                    {/* PRODUCTOS */}
                    <section>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "18px",
                            }}
                        >
                            <span
                                style={{
                                    color: "#64748b",
                                    fontSize: "14px",
                                }}
                            >
                                {productosFiltrados.length} productos encontrados
                            </span>
                        </div>

                        {productosFiltrados.length > 0 ? (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fill, minmax(230px, 1fr))",
                                    gap: "20px",
                                }}
                            >
                                {productosFiltrados.map((producto) => (
                                    <article
                                        key={producto.id}
                                        style={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "14px",
                                            overflow: "hidden",
                                            boxShadow:
                                                "0 4px 14px rgba(0,0,0,0.04)",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {/* IMAGEN TEMPORAL */}
                                        <div
                                            style={{
                                                height: "180px",
                                                backgroundColor: "#f3f6f9",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderBottom:
                                                    "1px solid #edf0f4",
                                            }}
                                        >
                                            <FaPills
                                                size={55}
                                                color="#b8c5d1"
                                            />
                                        </div>

                                        <div
                                            style={{
                                                padding: "18px",
                                                display: "flex",
                                                flexDirection: "column",
                                                flex: 1,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "#00a651",
                                                    fontSize: "11px",
                                                    fontWeight: "700",
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                {producto.categoria}
                                            </span>

                                            <h3
                                                style={{
                                                    margin: 0,
                                                    color: "#263b5e",
                                                    fontSize: "14px",
                                                    lineHeight: "1.45",
                                                    minHeight: "60px",
                                                }}
                                            >
                                                {producto.nombre}
                                            </h3>

                                            {producto.requiereReceta && (
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            display:
                                                                "inline-block",
                                                            backgroundColor:
                                                                "#fff4e5",
                                                            color: "#a65d00",
                                                            borderRadius:
                                                                "5px",
                                                            padding:
                                                                "5px 8px",
                                                            fontSize:
                                                                "11px",
                                                            fontWeight:
                                                                "700",
                                                        }}
                                                    >
                                                        Requiere receta
                                                    </span>
                                                </div>
                                            )}

                                            <div
                                                style={{
                                                    marginTop: "auto",
                                                    paddingTop: "18px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                        marginBottom: "13px",
                                                    }}
                                                >
                                                    <strong
                                                        style={{
                                                            color: "#174a8b",
                                                            fontSize: "20px",
                                                        }}
                                                    >
                                                        Q
                                                        {producto.precio.toFixed(
                                                            2
                                                        )}
                                                    </strong>

                                                    <span
                                                        style={{
                                                            color:
                                                                producto.stock >
                                                                    0
                                                                    ? "#00a651"
                                                                    : "#c0392b",
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                        }}
                                                    >
                                                        {producto.stock > 0
                                                            ? "Disponible"
                                                            : "Agotado"}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        producto.stock <= 0
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        height: "42px",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        backgroundColor:
                                                            producto.stock > 0
                                                                ? "#00a651"
                                                                : "#cbd5e1",
                                                        color: "#ffffff",
                                                        fontSize: "13px",
                                                        fontWeight: "700",
                                                        cursor:
                                                            producto.stock > 0
                                                                ? "pointer"
                                                                : "not-allowed",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    <FaShoppingCart />

                                                    Agregar al carrito
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "14px",
                                    padding: "60px 25px",
                                    textAlign: "center",
                                    color: "#64748b",
                                }}
                            >
                                No se encontraron productos con los filtros seleccionados.
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <FooterPublico />
        </div>
    );
};
export default Productos;