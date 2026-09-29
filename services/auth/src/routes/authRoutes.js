import express from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";

import {
    registroCliente,
    login,
    solicitarRecuperacion,
    restablecerPassword,
    obtenerPerfil,
    actualizarPerfil,
    obtenerDirecciones,
    crearDireccion,
    actualizarDireccion,
    eliminarDireccion,
    establecerPredeterminada,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/registro", registroCliente);
router.post("/login", login);
router.post("/recuperar-password", solicitarRecuperacion);
router.post("/restablecer-password", restablecerPassword);
router.get("/perfil", verificarToken, obtenerPerfil);
router.put("/perfil", verificarToken, actualizarPerfil);
router.get("/direcciones", verificarToken, obtenerDirecciones);
router.post("/direcciones", verificarToken, crearDireccion);
router.put("/direcciones/:id", verificarToken, actualizarDireccion);
router.delete("/direcciones/:id", verificarToken, eliminarDireccion);
router.put("/direcciones/:id/predeterminada", verificarToken, establecerPredeterminada);

export default router;