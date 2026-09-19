import express from "express";

import {
    listarMedicos,
    crear,
    listar,
    obtenerPorId,
    actualizar,
    desactivar,
    reactivar,
    listarRoles
} from "../controllers/usuariosController.js";

const router = express.Router();

// Roles
router.get("/roles", listarRoles);

// Médicos
router.get("/medicos", listarMedicos);

// Usuarios
router.post("/", crear);
router.get("/", listar);
router.get("/:id", obtenerPorId);
router.put("/:id", actualizar);

// Estado
router.patch("/:id/desactivar", desactivar);
router.patch("/:id/reactivar", reactivar);

export default router;