import express from "express";

import {
    listarPresentacionesProducto,
    obtenerPresentacion,
    crearPresentacion,
    modificarPresentacion,
    cambiarEstadoPresentacion,
} from "../controllers/presentacionController.js";

import {
    verificarToken,
    soloAdministrador,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ======================================================
// CONSULTAS
// ======================================================

router.get(
    "/producto/:idProducto",
    listarPresentacionesProducto
);

router.get(
    "/:id",
    obtenerPresentacion
);


// ======================================================
// ADMINISTRACIÓN
// ======================================================

router.post(
    "/",
    verificarToken,
    soloAdministrador,
    crearPresentacion
);

router.put(
    "/:id",
    verificarToken,
    soloAdministrador,
    modificarPresentacion
);

router.patch(
    "/:id/estado",
    verificarToken,
    soloAdministrador,
    cambiarEstadoPresentacion
);


export default router;