import express from "express";
import cors from "cors";
import pagoRoutes from "./routes/pagoRoutes.js";
import reembolsoRoutes from "./routes/reembolsoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/pagos", pagoRoutes);
app.use("/reembolsos", reembolsoRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "pagos",
        status: "OK",
        message: "Farmacia Gaby - Pagos Service funcionando",
    });
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Pagos Service corriendo en puerto ${PORT}`);
});