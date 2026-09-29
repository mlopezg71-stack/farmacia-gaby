import express from "express";

import {
    listarCategoriasProducto,
    guardarCategoriasProducto,
} from "../controllers/productoCategoriaController.js";

import {
    verificarToken,
    soloAdministrador,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
    "/producto/:idProducto",
    listarCategoriasProducto
);

router.put(
    "/producto/:idProducto",
    verificarToken,
    soloAdministrador,
    guardarCategoriasProducto
);

export default router;