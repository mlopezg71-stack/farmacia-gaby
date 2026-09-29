import express from "express";

import {
    crearReembolso,
    obtenerReembolsosPorPago,
    obtenerReembolso,
    cambiarEstadoReembolso,
} from "../controllers/reembolsoController.js";

const router = express.Router();

router.post("/", crearReembolso);

router.get("/:id", obtenerReembolso);

router.get(
    "/pago/:id_pago",
    obtenerReembolsosPorPago
);

router.patch(
    "/:id/estado",
    cambiarEstadoReembolso
);

export default router;