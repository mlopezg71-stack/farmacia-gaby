import express from "express";

import {
    listarPreciosPresentacion,
    obtenerPrecio,
    crearPrecio,
    modificarPrecio,
} from "../controllers/precioController.js";

import {
    verificarToken,
    soloAdministrador,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ======================================================
// CONSULTAS
// ======================================================

router.get(
    "/presentacion/:idPresentacion",
    listarPreciosPresentacion
);

router.get(
    "/:id",
    listarPreciosPresentacion
);


// ======================================================
// ADMINISTRACIÓN
// ======================================================

router.post(
    "/",
    verificarToken,
    soloAdministrador,
    crearPrecio
);

router.put(
    "/:id",
    verificarToken,
    soloAdministrador,
    modificarPrecio
);


export default router;