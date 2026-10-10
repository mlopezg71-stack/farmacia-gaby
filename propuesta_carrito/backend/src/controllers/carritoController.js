import {
    obtenerCarritoService,
    agregarItemService,
    aumentarCantidadService,
    disminuirCantidadService,
    actualizarCantidadService,
    eliminarItemService,
    vaciarCarritoService,
    obtenerProductosService,
} from "../services/carritoService.js";

export const obtenerCarrito = async (req, res) => {
    try {
        const carrito = obtenerCarritoService();
        res.status(200).json(carrito);
    } catch (error) {
        console.error("Error al obtener carrito:", error);

        res.status(500).json({
            message: "Error al obtener el carrito",
        });
    }
};

export const agregarItemCarrito = async (req, res) => {
    try {
        const { id_presentacion, cantidad } = req.body;

        if (!id_presentacion || !cantidad) {
            return res.status(400).json({
                message: "id_presentacion y cantidad son obligatorios",
            });
        }

        if (Number(cantidad) <= 0) {
            return res.status(400).json({
                message: "La cantidad debe ser mayor que 0",
            });
        }

        const item = agregarItemService({ id_presentacion, cantidad });

        res.status(201).json(item);
    } catch (error) {
        console.error("Error al agregar item al carrito:", error);

        res.status(error.statusCode || 500).json({
            message:
                error.statusCode === 404
                    ? error.message
                    : "Error al agregar el item al carrito",
        });
    }
};

export const aumentarCantidad = async (req, res) => {
    try {
        const { id } = req.params;

        const item = aumentarCantidadService(id);

        res.status(200).json(item);
    } catch (error) {
        console.error("Error al aumentar cantidad:", error);

        res.status(error.statusCode || 500).json({
            message:
                error.statusCode === 404
                    ? error.message
                    : "Error al aumentar la cantidad",
        });
    }
};

export const disminuirCantidad = async (req, res) => {
    try {
        const { id } = req.params;

        const item = disminuirCantidadService(id);

        res.status(200).json(item);
    } catch (error) {
        console.error("Error al disminuir cantidad:", error);

        res.status(error.statusCode || 500).json({
            message:
                error.statusCode === 404
                    ? error.message
                    : "Error al disminuir la cantidad",
        });
    }
};

export const actualizarItemCarrito = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || Number(cantidad) <= 0) {
            return res.status(400).json({
                message: "La cantidad debe ser mayor que 0",
            });
        }

        const item = actualizarCantidadService(id, cantidad);

        res.status(200).json(item);
    } catch (error) {
        console.error("Error al actualizar item del carrito:", error);

        res.status(error.statusCode || 500).json({
            message:
                error.statusCode === 404
                    ? error.message
                    : "Error al actualizar el item del carrito",
        });
    }
};

export const eliminarItemCarrito = async (req, res) => {
    try {
        const { id } = req.params;

        const item = eliminarItemService(id);

        res.status(200).json({
            message: "Item eliminado correctamente",
            item,
        });
    } catch (error) {
        console.error("Error al eliminar item del carrito:", error);

        res.status(error.statusCode || 500).json({
            message:
                error.statusCode === 404
                    ? error.message
                    : "Error al eliminar el item del carrito",
        });
    }
};

export const vaciarCarrito = async (req, res) => {
    try {
        const carrito = vaciarCarritoService();

        res.status(200).json(carrito);
    } catch (error) {
        console.error("Error al vaciar carrito:", error);

        res.status(500).json({
            message: "Error al vaciar el carrito",
        });
    }
};

export const obtenerProductos = async (req, res) => {
    try {
        const productos = obtenerProductosService();

        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);

        res.status(500).json({
            message: "Error al obtener los productos",
        });
    }
};
