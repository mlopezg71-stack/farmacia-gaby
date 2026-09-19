import express from "express";

import { listarBitacora } from "../controllers/bitacoraController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["ADMIN"]), listarBitacora);

export default router;