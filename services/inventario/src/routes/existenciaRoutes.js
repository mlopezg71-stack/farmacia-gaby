import express from "express";

import {
    consultarExistencia,
    consultarDisponibilidadGeneral,
    listarResumenInventario,
} from "../controllers/existenciaController.js";

const router = express.Router();

router.get(
    "/disponibilidad-general",
    consultarDisponibilidadGeneral
);

router.get(
    "/resumen",
    listarResumenInventario
);

router.get(
    "/",
    consultarExistencia
);

export default router;