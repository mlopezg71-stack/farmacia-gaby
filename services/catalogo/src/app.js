import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "catalogo",
        status: "OK",
        message: "Farmacia Gaby - Catalogo Service funcionando",
    });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Catalogo Service corriendo en puerto ${PORT}`);
});