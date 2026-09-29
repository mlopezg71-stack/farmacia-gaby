import express from "express";

import {
    crearPedido,
    listarPedidos,
    obtenerPedido,
    cambiarEstadoPedido,
    iniciarPagoPedido,
    consultarPagosPedido,
} from "../controllers/pedidoController.js";

const router = express.Router();

router.post("/", crearPedido);
router.get("/", listarPedidos);
router.get("/:id", obtenerPedido);
router.patch("/:id/estado", cambiarEstadoPedido);
router.post("/:id/pago", iniciarPagoPedido);
router.get("/:id/pagos", consultarPagosPedido);

export default router;