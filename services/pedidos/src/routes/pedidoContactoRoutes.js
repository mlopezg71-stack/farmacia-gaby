import express from "express";

import {
    crearPedidoContacto,
    obtenerPedidoContacto,
} from "../controllers/pedidoContactoController.js";

const router = express.Router();

router.post("/", crearPedidoContacto);
router.get("/:id_pedido", obtenerPedidoContacto);

export default router;