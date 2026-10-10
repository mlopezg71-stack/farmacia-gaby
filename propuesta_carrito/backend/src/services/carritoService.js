import { productosMock } from "../config/datosMock.js";

const carrito = {
    estado: "ACTIVO",
    items: [],
};

let contadorItems = 1;

const buscarPresentacion = (id_presentacion) => {
    return productosMock.find(
        (producto) =>
            Number(producto.id_presentacion) ===
            Number(id_presentacion)
    );
};

const calcularSubtotal = (item) => {
    return Number((item.cantidad * item.precio_observado).toFixed(2));
};

const construirItem = (item) => ({
    id_item_carrito: item.id_item_carrito,
    id_presentacion: item.id_presentacion,
    nombre: item.nombre,
    categoria: item.categoria,
    precio_observado: item.precio_observado,
    cantidad: item.cantidad,
    subtotal: calcularSubtotal(item),
});

const calcularTotal = () => {
    return Number(
        carrito.items
            .reduce(
                (acumulado, item) =>
                    acumulado + item.cantidad * item.precio_observado,
                0
            )
            .toFixed(2)
    );
};

export const obtenerCarritoService = () => {
    return {
        estado: carrito.estado,
        items: carrito.items.map(construirItem),
        total: calcularTotal(),
        cantidad_items: carrito.items.reduce(
            (acumulado, item) => acumulado + item.cantidad,
            0
        ),
    };
};

export const agregarItemService = ({ id_presentacion, cantidad }) => {
    const presentacion = buscarPresentacion(id_presentacion);

    if (!presentacion) {
        const error = new Error(
            "La presentación no existe en el catálogo"
        );
        error.statusCode = 404;
        throw error;
    }

    const itemExistente = carrito.items.find(
        (item) =>
            Number(item.id_presentacion) ===
            Number(id_presentacion)
    );

    if (itemExistente) {
        itemExistente.cantidad += Number(cantidad);
        itemExistente.precio_observado = presentacion.precio;
        return construirItem(itemExistente);
    }

    const item = {
        id_item_carrito: contadorItems++,
        id_presentacion: presentacion.id_presentacion,
        nombre: presentacion.nombre,
        categoria: presentacion.categoria,
        precio_observado: presentacion.precio,
        cantidad: Number(cantidad),
    };

    carrito.items.push(item);

    return construirItem(item);
};

export const aumentarCantidadService = (id_item_carrito) => {
    const item = carrito.items.find(
        (actual) =>
            Number(actual.id_item_carrito) === Number(id_item_carrito)
    );

    if (!item) {
        const error = new Error("Item del carrito no encontrado");
        error.statusCode = 404;
        throw error;
    }

    item.cantidad += 1;

    return construirItem(item);
};

export const disminuirCantidadService = (id_item_carrito) => {
    const item = carrito.items.find(
        (actual) =>
            Number(actual.id_item_carrito) === Number(id_item_carrito)
    );

    if (!item) {
        const error = new Error("Item del carrito no encontrado");
        error.statusCode = 404;
        throw error;
    }

    if (item.cantidad > 1) {
        item.cantidad -= 1;
    }

    return construirItem(item);
};

export const actualizarCantidadService = (
    id_item_carrito,
    cantidad
) => {
    const item = carrito.items.find(
        (actual) =>
            Number(actual.id_item_carrito) === Number(id_item_carrito)
    );

    if (!item) {
        const error = new Error("Item del carrito no encontrado");
        error.statusCode = 404;
        throw error;
    }

    item.cantidad = Number(cantidad);

    return construirItem(item);
};

export const eliminarItemService = (id_item_carrito) => {
    const indice = carrito.items.findIndex(
        (actual) =>
            Number(actual.id_item_carrito) === Number(id_item_carrito)
    );

    if (indice === -1) {
        const error = new Error("Item del carrito no encontrado");
        error.statusCode = 404;
        throw error;
    }

    const [eliminado] = carrito.items.splice(indice, 1);

    return construirItem(eliminado);
};

export const vaciarCarritoService = () => {
    carrito.items = [];

    return {
        estado: carrito.estado,
        items: [],
        total: 0,
        cantidad_items: 0,
    };
};

export const obtenerProductosService = () => {
    return productosMock;
};
