import express from "express";

import {
    crearPedido,
    listarPedidos,
    listarMisPedidos,
    obtenerPedido,
    cambiarEstadoPedido,
    iniciarPagoPedido,
    consultarPagosPedido,
} from "../controllers/pedidoController.js";

import {
    identificar,
    soloAdministrador,
    soloCliente,
} from "../middlewares/authMiddleware.js";

import {
    verificarPropietarioCarritoEnBody,
    verificarPropietarioPedido,
    ignorarIdClienteDelBody,
} from "../middlewares/propietarioMiddleware.js";

const router = express.Router();

router.post(
    "/",
    identificar,
    verificarPropietarioCarritoEnBody,
    ignorarIdClienteDelBody,
    crearPedido
);

router.get("/", identificar, soloAdministrador, listarPedidos);

// "/mis-pedidos" va ANTES de "/:id", si no Express tomaría "mis-pedidos" como un id.
router.get("/mis-pedidos", identificar, soloCliente, listarMisPedidos);

router.get("/:id", identificar, verificarPropietarioPedido, obtenerPedido);

// SIN PROTEGER a propósito: el servicio de pagos llama este endpoint sin token
// para confirmar o cancelar el pedido. Pendiente protegerlo con una clave
// entre servicios.
router.patch("/:id/estado", cambiarEstadoPedido);

router.post("/:id/pago", identificar, verificarPropietarioPedido, iniciarPagoPedido);
router.get("/:id/pagos", identificar, verificarPropietarioPedido, consultarPagosPedido);

export default router;