import axiosClient from "./axiosConfig";

export const obtenerProductos = async () => {
    const response = await axiosClient.get("/productos");
    return response.data;
};

export const obtenerCarrito = async () => {
    const response = await axiosClient.get("/carrito");
    return response.data;
};

export const agregarProducto = async (id_presentacion, cantidad = 1) => {
    const response = await axiosClient.post("/carrito/items", {
        id_presentacion,
        cantidad,
    });
    return response.data;
};

export const aumentarCantidad = async (id_item_carrito) => {
    const response = await axiosClient.patch(
        `/carrito/items/${id_item_carrito}/aumentar`
    );
    return response.data;
};

export const disminuirCantidad = async (id_item_carrito) => {
    const response = await axiosClient.patch(
        `/carrito/items/${id_item_carrito}/disminuir`
    );
    return response.data;
};

export const actualizarCantidad = async (id_item_carrito, cantidad) => {
    const response = await axiosClient.put(
        `/carrito/items/${id_item_carrito}`,
        { cantidad }
    );
    return response.data;
};

export const eliminarProducto = async (id_item_carrito) => {
    const response = await axiosClient.delete(
        `/carrito/items/${id_item_carrito}`
    );
    return response.data;
};

export const vaciarCarrito = async () => {
    const response = await axiosClient.delete("/carrito");
    return response.data;
};
