import express from "express";

import {
    listarProductosPublicos,
    listarProductosAdmin,
    obtenerProductoAdmin,
    crearProducto,
    modificarProducto,
    cambiarEstadoProducto,
} from "../controllers/productoController.js";

import {
    verificarToken,
    soloAdministrador,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ======================================================
// ADMINISTRACIÓN
// ======================================================

router.get(
    "/admin",
    verificarToken,
    soloAdministrador,
    listarProductosAdmin
);

router.get(
    "/admin/:id",
    verificarToken,
    soloAdministrador,
    obtenerProductoAdmin
);

router.post(
    "/admin",
    verificarToken,
    soloAdministrador,
    crearProducto
);

router.put(
    "/admin/:id",
    verificarToken,
    soloAdministrador,
    modificarProducto
);

router.patch(
    "/admin/:id/estado",
    verificarToken,
    soloAdministrador,
    cambiarEstadoProducto
);


// ======================================================
// PÚBLICO
// ======================================================

router.get(
    "/",
    listarProductosPublicos
);


export default router;