import express from "express";

import {
    crearReserva,
    confirmarReserva,
    consumirReserva,
    liberarReserva,
    obtenerReservaPorPedido,
} from "../controllers/reservaController.js";

const router = express.Router();

router.post("/", crearReserva);
router.get("/pedido/:id_pedido", obtenerReservaPorPedido);
router.patch("/:id/confirmar", confirmarReserva);
router.patch("/:id/consumir", consumirReserva);
router.patch("/:id/liberar", liberarReserva);

export default router;