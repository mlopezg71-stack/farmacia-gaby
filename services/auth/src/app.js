import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* RUTAS */
app.use("/api/auth", authRoutes);

/* HEALTH CHECK */
app.get("/health", (req, res) => {
    res.status(200).json({
        service: "auth",
        status: "OK",
        message: "Farmacia Gaby - Auth Service funcionando",
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Auth Service corriendo en puerto ${PORT}`);
});