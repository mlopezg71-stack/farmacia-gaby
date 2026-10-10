import prisma from "../config/prisma.js";
import { hashearToken } from "../services/carritoService.js";
import { esAdministrador } from "./authMiddleware.js";


// ======================================================
// ¿DE QUIÉN ES EL CARRITO / PEDIDO?
// Un carrito es de un cliente (id_cliente) o de un invitado (hash de su token).
// Si no es dueño se responde 404, igual que si no existiera, para no
// revelar qué ids existen.
// ======================================================

const esDuenoDelCarrito = (identidad, carrito) => {
    if (identidad.tipo === "CLIENTE") {
        return carrito.id_cliente === identidad.id_cliente;
    }

    if (identidad.tipo === "INVITADO") {
        return (
            carrito.token_invitado_hash !== null &&
            carrito.token_invitado_hash === hashearToken(identidad.token_invitado)
        );
    }

    return false;
};

const esEnteroPositivo = (valor) => {
    const numero = Number(valor);

    return Number.isInteger(numero) && numero > 0;
};

const seleccionCarrito = {
    id_carrito: true,
    id_cliente: true,
    token_invitado_hash: true,
};


// Rutas con el id del carrito en la URL: /carritos/:id/...
export const verificarPropietarioCarrito = async (req, res, next) => {
    try {
        if (!esEnteroPositivo(req.params.id)) {
            return res.status(400).json({
                message: "ID de carrito inválido",
            });
        }

        const carrito = await prisma.carrito.findUnique({
            where: { id_carrito: Number(req.params.id) },
            select: seleccionCarrito,
        });

        if (!carrito || !esDuenoDelCarrito(req.identidad, carrito)) {
            return res.status(404).json({
                message: "Carrito no encontrado",
            });
        }

        next();
    } catch (error) {
        console.error("Error al verificar propietario del carrito:", error);

        res.status(500).json({
            message: "Error al verificar el carrito",
        });
    }
};


// Rutas con el id del carrito en el body: POST /items-carrito y POST /pedidos.
// Si falta id_carrito se deja pasar: el service responde el 400 correspondiente.
export const verificarPropietarioCarritoEnBody = async (req, res, next) => {
    try {
        const id_carrito = req.body?.id_carrito;

        if (!esEnteroPositivo(id_carrito)) {
            return next();
        }

        const carrito = await prisma.carrito.findUnique({
            where: { id_carrito: Number(id_carrito) },
            select: seleccionCarrito,
        });

        if (!carrito || !esDuenoDelCarrito(req.identidad, carrito)) {
            return res.status(404).json({
                message: "Carrito no encontrado",
            });
        }

        next();
    } catch (error) {
        console.error("Error al verificar propietario del carrito:", error);

        res.status(500).json({
            message: "Error al verificar el carrito",
        });
    }
};


// Rutas con el id de un item en la URL: /items-carrito/:id
export const verificarPropietarioItem = async (req, res, next) => {
    try {
        if (!esEnteroPositivo(req.params.id)) {
            return res.status(400).json({
                message: "El id del item debe ser un número entero mayor que 0",
            });
        }

        const item = await prisma.itemCarrito.findUnique({
            where: { id_item_carrito: Number(req.params.id) },
        });

        if (!item) {
            return res.status(404).json({
                message: "Item del carrito no encontrado",
            });
        }

        const carrito = await prisma.carrito.findUnique({
            where: { id_carrito: item.id_carrito },
            select: seleccionCarrito,
        });

        if (!carrito || !esDuenoDelCarrito(req.identidad, carrito)) {
            return res.status(404).json({
                message: "Item del carrito no encontrado",
            });
        }

        next();
    } catch (error) {
        console.error("Error al verificar propietario del item:", error);

        res.status(500).json({
            message: "Error al verificar el item del carrito",
        });
    }
};


// Rutas con el id del pedido en la URL: /pedidos/:id/...
// Pueden verlo: el administrador, el cliente dueño del pedido y el invitado
// que tenga el token del carrito del que salió el pedido.
export const verificarPropietarioPedido = async (req, res, next) => {
    try {
        if (!esEnteroPositivo(req.params.id)) {
            return res.status(400).json({
                message: "ID de pedido inválido",
            });
        }

        if (esAdministrador(req.identidad)) {
            return next();
        }

        const pedido = await prisma.pedido.findUnique({
            where: { id_pedido: Number(req.params.id) },
            select: {
                id_cliente: true,
                ref_id_carrito: {
                    select: { token_invitado_hash: true },
                },
            },
        });

        let esDueno = false;

        if (pedido && req.identidad.tipo === "CLIENTE") {
            esDueno = pedido.id_cliente === req.identidad.id_cliente;
        }

        if (pedido && req.identidad.tipo === "INVITADO") {
            const hash = pedido.ref_id_carrito?.token_invitado_hash ?? null;

            esDueno =
                hash !== null &&
                hash === hashearToken(req.identidad.token_invitado);
        }

        if (!esDueno) {
            return res.status(404).json({
                message: "Pedido no encontrado",
            });
        }

        next();
    } catch (error) {
        console.error("Error al verificar propietario del pedido:", error);

        res.status(500).json({
            message: "Error al verificar el pedido",
        });
    }
};


// Al crear un pedido el cliente sale del carrito, no del body. Sin esto un
// usuario podría crear pedidos a nombre de otro id_cliente.
export const ignorarIdClienteDelBody = (req, res, next) => {
    if (req.body) {
        delete req.body.id_cliente;
    }

    next();
};