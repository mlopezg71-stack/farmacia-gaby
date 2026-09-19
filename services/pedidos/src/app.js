import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "pedidos",
        status: "OK",
        message: "Farmacia Gaby - Pedidos Service funcionando",
    });
});

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
    console.log(`Pedidos Service corriendo en puerto ${PORT}`);
});