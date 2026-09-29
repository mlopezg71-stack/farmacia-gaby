import express from "express";

import {
    listarPagos,
    obtenerPago,
    crearPago,
    obtenerPagosPorPedido,
    cambiarEstadoPago,
} from "../controllers/pagoController.js";

const router = express.Router();

router.post("/", crearPago);
router.get("/", listarPagos);
router.get("/pedido/:id_pedido", obtenerPagosPorPedido);
router.get("/:id", obtenerPago);
router.patch("/:id/estado", cambiarEstadoPago);

export default router;