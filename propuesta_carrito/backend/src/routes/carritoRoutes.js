import express from "express";

import {
    obtenerCarrito,
    agregarItemCarrito,
    aumentarCantidad,
    disminuirCantidad,
    actualizarItemCarrito,
    eliminarItemCarrito,
    vaciarCarrito,
} from "../controllers/carritoController.js";

const router = express.Router();

router.get("/", obtenerCarrito);
router.post("/items", agregarItemCarrito);
router.patch("/items/:id/aumentar", aumentarCantidad);
router.patch("/items/:id/disminuir", disminuirCantidad);
router.put("/items/:id", actualizarItemCarrito);
router.delete("/items/:id", eliminarItemCarrito);
router.delete("/", vaciarCarrito);

export default router;
