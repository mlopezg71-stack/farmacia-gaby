import express from "express";
import cors from "cors";

import carritoRoutes from "./routes/carritoRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/carrito", carritoRoutes);
app.use("/productos", productoRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "propuesta-carrito",
        status: "OK",
        message: "Farmacia Gaby - Propuesta de carrito funcionando",
    });
});

const PORT = process.env.PORT || 3010;

app.listen(PORT, () => {
    console.log(`Propuesta de carrito corriendo en puerto ${PORT}`);
});
