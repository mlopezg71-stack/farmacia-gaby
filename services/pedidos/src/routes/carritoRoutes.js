import express from "express";

import {
    crearCarrito,
    obtenerCarritoActivo,
    obtenerCarrito,
    vaciarCarrito,
    abandonarCarrito,
} from "../controllers/carritoController.js";

import { identificar } from "../middlewares/authMiddleware.js";
import { verificarPropietarioCarrito } from "../middlewares/propietarioMiddleware.js";

const router = express.Router();

router.post("/", identificar, crearCarrito);

// "/activo" va ANTES de "/:id", si no Express tomaría "activo" como un id.
router.get("/activo", identificar, obtenerCarritoActivo);

router.get("/:id", identificar, verificarPropietarioCarrito, obtenerCarrito);
router.delete("/:id/items", identificar, verificarPropietarioCarrito, vaciarCarrito);
router.patch("/:id/abandonar", identificar, verificarPropietarioCarrito, abandonarCarrito);

export default router;