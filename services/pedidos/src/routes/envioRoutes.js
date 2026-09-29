import express from "express";

import {
    crearEnvio,
    obtenerEnvioPorPedido,
} from "../controllers/envioController.js";

const router = express.Router();

router.post("/", crearEnvio);
router.get("/pedido/:id_pedido", obtenerEnvioPorPedido);

export default router;