import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import prisma from "./config/prisma.js";

import authRoutes from "./routes/authRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import bitacoraRoutes from "./routes/bitacoraRoutes.js";
import notificacionesRoutes from "./routes/notificacionesRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

/* RUTAS */

app.use("/api/auth", authRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/usuarios", usuariosRoutes);

app.use("/api/bitacora", bitacoraRoutes);

app.use("/api/notificaciones", notificacionesRoutes);

/* RUTA PRINCIPAL */

app.get("/", async (req, res) => {
    try {
        await prisma.$connect();

        res.json({
            message: "Farmacia Gaby API funcionando correctamente",
            database: "Conectada correctamente a Railway",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al conectar con la base de datos",
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});