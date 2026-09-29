import express from "express";

import {
    crearCarrito,
    obtenerCarrito,
} from "../controllers/carritoController.js";

const router = express.Router();

router.post("/", crearCarrito);
router.get("/:id", obtenerCarrito);

export default router;