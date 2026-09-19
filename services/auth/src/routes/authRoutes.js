import express from "express";

import {
    registroCliente,
    login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/registro", registroCliente);
router.post("/login", login);

export default router;