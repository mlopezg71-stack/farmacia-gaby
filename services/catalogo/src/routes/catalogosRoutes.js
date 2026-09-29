import express from "express";

import {
    listarMarcas,
    crearMarca,
    modificarMarca,
    listarLaboratorios,
    crearLaboratorio,
    modificarLaboratorio,
    listarCategorias,
    crearCategoria,
    modificarCategoria,
    listarListasPrecio,
    crearListaPrecio,
    modificarListaPrecio,
} from "../controllers/catalogosController.js";

import {
    verificarToken,
    soloAdministrador,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ======================================================
// MARCAS
// ======================================================

router.get(
    "/marcas",
    listarMarcas
);

router.post(
    "/marcas",
    verificarToken,
    soloAdministrador,
    crearMarca
);

router.put(
    "/marcas/:id",
    verificarToken,
    soloAdministrador,
    modificarMarca
);


// ======================================================
// LABORATORIOS
// ======================================================

router.get(
    "/laboratorios",
    listarLaboratorios
);

router.post(
    "/laboratorios",
    verificarToken,
    soloAdministrador,
    crearLaboratorio
);

router.put(
    "/laboratorios/:id",
    verificarToken,
    soloAdministrador,
    modificarLaboratorio
);


// ======================================================
// CATEGORÍAS
// ======================================================

router.get(
    "/categorias",
    listarCategorias
);

router.post(
    "/categorias",
    verificarToken,
    soloAdministrador,
    crearCategoria
);

router.put(
    "/categorias/:id",
    verificarToken,
    soloAdministrador,
    modificarCategoria
);


// ======================================================
// LISTAS DE PRECIO
// ======================================================

router.get(
    "/listas-precio",
    listarListasPrecio
);

router.post(
    "/listas-precio",
    verificarToken,
    soloAdministrador,
    crearListaPrecio
);

router.put(
    "/listas-precio/:id",
    verificarToken,
    soloAdministrador,
    modificarListaPrecio
);


export default router;