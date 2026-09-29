import express from "express";

import {
    crearPedidoFacturacion,
    obtenerPedidoFacturacion,
} from "../controllers/pedidoFacturacionController.js";

const router = express.Router();

router.post("/", crearPedidoFacturacion);
router.get("/:id_pedido", obtenerPedidoFacturacion);

export default router;