import express from "express";

import {
    agregarItemCarrito,
    actualizarItemCarrito,
    eliminarItemCarrito,
} from "../controllers/itemCarritoController.js";

import { identificar } from "../middlewares/authMiddleware.js";
import {
    verificarPropietarioCarritoEnBody,
    verificarPropietarioItem,
} from "../middlewares/propietarioMiddleware.js";

const router = express.Router();

router.post("/", identificar, verificarPropietarioCarritoEnBody, agregarItemCarrito);
router.put("/:id", identificar, verificarPropietarioItem, actualizarItemCarrito);
router.delete("/:id", identificar, verificarPropietarioItem, eliminarItemCarrito);

export default router;