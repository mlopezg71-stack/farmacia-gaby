import {
    crearOObtenerCarritoActivo,
    obtenerCarritoActivo as obtenerCarritoActivoService,
    obtenerCarritoDetallado,
    vaciarCarrito as vaciarCarritoService,
    abandonarCarrito as abandonarCarritoService,
} from "../services/carritoService.js";


// El dueño del carrito sale de la sesión (req.identidad, que deja el middleware
// identificar), nunca del body: así nadie puede abrir ni crear el carrito de otro.
const datosIdentidadCarrito = (identidad) => {
    if (identidad.tipo === "CLIENTE") {
        return { id_cliente: identidad.id_cliente };
    }

    if (identidad.tipo === "INVITADO") {
        return { token_invitado: identidad.token_invitado };
    }

    const error = new Error("Solo los clientes o invitados pueden tener carrito");

    error.status = 403;

    throw error;
};


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
// CREAR U OBTENER EL CARRITO ACTIVO
// Body opcional: { moneda, id_sucursal }. El dueño sale de la sesión.
// 201 si se creó uno nuevo, 200 si ya existía uno activo.
// ======================================================

export const crearCarrito = async (req, res) => {
    try {
        const { moneda, id_sucursal } = req.body ?? {};

        const { carrito, creado } = await crearOObtenerCarritoActivo({
            moneda,
            id_sucursal,
            ...datosIdentidadCarrito(req.identidad),
        });

        const detalle = await obtenerCarritoDetallado(carrito.id_carrito);

        res.status(creado ? 201 : 200).json(detalle);
    } catch (error) {
        responderError(
            res,
            error,
            "Error al crear carrito",
            "Error al crear el carrito"
        );
    }
};


// ======================================================
// OBTENER EL CARRITO ACTIVO (sin crearlo)
// GET /carritos/activo
// Cliente: con su token JWT. Invitado: con el header x-token-invitado.
// ======================================================

export const obtenerCarritoActivo = async (req, res) => {
    try {
        const detalle = await obtenerCarritoActivoService(
            datosIdentidadCarrito(req.identidad)
        );

        res.status(200).json(detalle);
    } catch (error) {
        responderError(
            res,
            error,
            "Error al obtener carrito activo",
            "Error al obtener el carrito activo"
        );
    }
};


// ======================================================
// OBTENER CARRITO POR ID (con items, precios y totales)
// ======================================================

export const obtenerCarrito = async (req, res) => {
    try {
        const detalle = await obtenerCarritoDetallado(req.params.id);

        res.status(200).json(detalle);
    } catch (error) {
        responderError(
            res,
            error,
            "Error al obtener carrito",
            "Error al obtener el carrito"
        );
    }
};


// ======================================================
// VACIAR CARRITO (borra los items, el carrito sigue activo)
// ======================================================

export const vaciarCarrito = async (req, res) => {
    try {
        const detalle = await vaciarCarritoService(req.params.id);

        res.status(200).json(detalle);
    } catch (error) {
        responderError(
            res,
            error,
            "Error al vaciar carrito",
            "Error al vaciar el carrito"
        );
    }
};


// ======================================================
// ABANDONAR CARRITO (estado ABANDONADO)
// ======================================================

export const abandonarCarrito = async (req, res) => {
    try {
        const detalle = await abandonarCarritoService(req.params.id);

        res.status(200).json(detalle);
    } catch (error) {
        responderError(
            res,
            error,
            "Error al abandonar carrito",
            "Error al abandonar el carrito"
        );
    }
};