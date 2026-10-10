import {
    agregarItem,
    actualizarItem,
    eliminarItem,
} from "../services/itemCarritoService.js";


// Los errores que lanza el service traen su código HTTP (400, 404, 502...).
// Si el error no trae código es un fallo inesperado y se responde 500.
const responderError = (res, error, contexto, mensajePorDefecto) => {
    console.error(`${contexto}:`, error);

    if (error.status) {
        return res.status(error.status).json({
            message: error.message,
        });
    }

    res.status(500).json({
        message: mensajePorDefecto,
    });
};


// ======================================================
// AGREGAR UNA PRESENTACIÓN AL CARRITO
// Body: { id_carrito, id_presentacion, cantidad }
// 201 si es una línea nueva, 200 si se sumó a una que ya existía.
// Responde con el carrito completo actualizado.
// ======================================================

export const agregarItemCarrito = async (req, res) => {
    try {
        //const { carrito, creado } = await agregarItem(req.body);
        const { carrito, creado } = await agregarItem(req.body ?? {});

        res.status(creado ? 201 : 200).json(carrito);
    } catch (error) {
        responderError(
            res,
            error,
            "Error al agregar item al carrito",
            "Error al agregar el item al carrito"
        );
    }
};


// ======================================================
// ACTUALIZAR LA CANTIDAD DE UN ITEM
// Body: { cantidad }
// ======================================================

export const actualizarItemCarrito = async (req, res) => {
    try {
        const carrito = await actualizarItem({
            id_item_carrito: req.params.id,
            //cantidad: req.body.cantidad,
            cantidad: req.body?.cantidad,
        });

        res.status(200).json(carrito);
    } catch (error) {
        responderError(
            res,
            error,
            "Error al actualizar item del carrito",
            "Error al actualizar el item del carrito"
        );
    }
};


// ======================================================
// ELIMINAR UN ITEM DEL CARRITO
// ======================================================

export const eliminarItemCarrito = async (req, res) => {
    try {
        const carrito = await eliminarItem(req.params.id);

        res.status(200).json(carrito);
    } catch (error) {
        responderError(
            res,
            error,
            "Error al eliminar item del carrito",
            "Error al eliminar el item del carrito"
        );
    }
};