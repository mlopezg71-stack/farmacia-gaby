import express from "express";

import {
    listar,
    contar,
    marcarLeida,
    marcarTodas
} from "../controllers/notificacionesController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, listar);

router.get("/contador", verifyToken, contar);

router.put("/marcar-todas/leidas", verifyToken, marcarTodas);

router.put("/:id/leida", verifyToken, marcarLeida);

export default router;