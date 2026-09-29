import express from "express";
import cors from "cors";

import existenciaRoutes from "./routes/existenciaRoutes.js";
import reservaRoutes from "./routes/reservaRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/existencias", existenciaRoutes);
app.use("/reservas", reservaRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "inventario",
        status: "OK",
        message: "Farmacia Gaby - Inventario Service funcionando",
    });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Inventario Service corriendo en puerto ${PORT}`);
});