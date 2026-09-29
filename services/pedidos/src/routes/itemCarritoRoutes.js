import express from "express";

import {
    agregarItemCarrito,
    actualizarItemCarrito,
    eliminarItemCarrito,
} from "../controllers/itemCarritoController.js";

const router = express.Router();

router.post("/", agregarItemCarrito);
router.put("/:id", actualizarItemCarrito);
router.delete("/:id", eliminarItemCarrito);

export default router;