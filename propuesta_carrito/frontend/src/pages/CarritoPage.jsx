import { useEffect, useRef, useState } from "react";

import {
    obtenerProductos,
    obtenerCarrito,
    agregarProducto,
    aumentarCantidad,
    disminuirCantidad,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
} from "../api/carritoApi.js";
import Encabezado from "../components/Encabezado.jsx";
import BarraNavegacion from "../components/BarraNavegacion.jsx";
import TarjetaProducto from "../components/TarjetaProducto.jsx";
import PanelCarrito from "../components/PanelCarrito.jsx";
import PiePagina from "../components/PiePagina.jsx";

function CarritoPage() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState({
        items: [],
        total: 0,
        cantidad_items: 0,
    });
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [cantidades, setCantidades] = useState({});
    const [busqueda, setBusqueda] = useState("");
    const referenciaCarrito = useRef(null);

    const cargarProductos = async () => {
        const data = await obtenerProductos();
        setProductos(data);
    };

    const cargarCarrito = async () => {
        const data = await obtenerCarrito();
        setCarrito(data);
    };

    useEffect(() => {
        cargarProductos();
        cargarCarrito();
    }, []);

    const abrirCarrito = () => {
        setMostrarCarrito(true);
        setTimeout(() => {
            referenciaCarrito.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const manejarAgregar = async (id_presentacion) => {
        const cantidad = Number(cantidades[id_presentacion]) || 1;
        await agregarProducto(id_presentacion, cantidad);
        await cargarCarrito();
    };

    const manejarCantidadTarjeta = (id_presentacion, valor) => {
        const cantidad = Number(valor);

        if (!cantidad || cantidad < 1) {
            return;
        }

        setCantidades({
            ...cantidades,
            [id_presentacion]: cantidad,
        });
    };

    const manejarAumentar = async (id_item_carrito) => {
        await aumentarCantidad(id_item_carrito);
        await cargarCarrito();
    };

    const manejarDisminuir = async (id_item_carrito) => {
        await disminuirCantidad(id_item_carrito);
        await cargarCarrito();
    };

    const manejarActualizar = async (id_item_carrito, valor) => {
        const cantidad = Number(valor);

        if (!cantidad || cantidad <= 0) {
            return;
        }

        await actualizarCantidad(id_item_carrito, cantidad);
        await cargarCarrito();
    };

    const manejarEliminar = async (id_item_carrito) => {
        await eliminarProducto(id_item_carrito);
        await cargarCarrito();
    };

    const manejarVaciar = async () => {
        await vaciarCarrito();
        await cargarCarrito();
    };

    const textoBusqueda = busqueda.trim().toLowerCase();

    const productosFiltrados = textoBusqueda
        ? productos.filter(
              (producto) =>
                  producto.nombre.toLowerCase().includes(textoBusqueda) ||
                  producto.categoria.toLowerCase().includes(textoBusqueda)
          )
        : productos;

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                fontFamily: "Arial, Helvetica, sans-serif",
                color: "#1d2b4f",
            }}
        >
            <Encabezado
                cantidadItems={carrito.cantidad_items}
                busqueda={busqueda}
                alCambiarBusqueda={setBusqueda}
                alAbrirCarrito={abrirCarrito}
            />

            <BarraNavegacion />

            <section
                style={{
                    background: "linear-gradient(135deg, #eef8ff 0%, #f0fff6 100%)",
                    borderBottom: "1px solid #e8eef3",
                }}
            >
                <div
                    style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        padding: "45px 35px",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            backgroundColor: "#e2f7eb",
                            color: "#008f49",
                            padding: "8px 15px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "700",
                            marginBottom: "18px",
                        }}
                    >
                        Tu farmacia en línea
                    </span>

                    <h1
                        style={{
                            margin: "0 0 16px 0",
                            color: "#123d73",
                            fontSize: "46px",
                            lineHeight: "1.08",
                            fontWeight: "800",
                        }}
                    >
                        Cuidando la salud <span style={{ color: "#00a651" }}>del hogar</span>
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            maxWidth: "540px",
                            color: "#5f6b7a",
                            fontSize: "17px",
                            lineHeight: "1.6",
                        }}
                    >
                        Explora productos de prueba, agrégalos al carrito y revisa
                        tu total antes de continuar.
                    </p>
                </div>
            </section>

            <main
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "50px 35px 0",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        marginBottom: "26px",
                    }}
                >
                    <div>
                        <h2 style={{ margin: "0 0 6px", color: "#123d73", fontSize: "26px" }}>
                            Productos destacados
                        </h2>

                        <p style={{ margin: 0, color: "#6b7280", fontSize: "15px" }}>
                            Encuentra productos disponibles para el cuidado de tu salud
                            y bienestar.
                        </p>
                    </div>

                    <button
                        type="button"
                        style={{
                            border: "1px solid #174a8b",
                            backgroundColor: "#ffffff",
                            color: "#174a8b",
                            borderRadius: "8px",
                            padding: "11px 18px",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Ver todos los productos
                    </button>
                </div>

                {productosFiltrados.length === 0 ? (
                    <p style={{ color: "#8a94a6", fontSize: "15px" }}>
                        No se encontraron productos para tu búsqueda
                    </p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                            gap: "22px",
                        }}
                    >
                        {productosFiltrados.map((producto) => (
                            <TarjetaProducto
                                key={producto.id_presentacion}
                                producto={producto}
                                cantidad={cantidades[producto.id_presentacion] || 1}
                                alCambiarCantidad={manejarCantidadTarjeta}
                                alAgregar={manejarAgregar}
                            />
                        ))}
                    </div>
                )}

                <div ref={referenciaCarrito}>
                    {mostrarCarrito && (
                        <PanelCarrito
                            carrito={carrito}
                            alAumentar={manejarAumentar}
                            alDisminuir={manejarDisminuir}
                            alActualizar={manejarActualizar}
                            alEliminar={manejarEliminar}
                            alVaciar={manejarVaciar}
                        />
                    )}
                </div>
            </main>

            <PiePagina />
        </div>
    );
}

export default CarritoPage;
