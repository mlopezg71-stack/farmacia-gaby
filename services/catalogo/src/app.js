import express from "express";
import cors from "cors";

import productoRoutes from "./routes/productoRoutes.js";
import presentacionRoutes from "./routes/presentacionRoutes.js";
import catalogosRoutes from "./routes/catalogosRoutes.js";
import productoCategoriaRoutes from "./routes/productoCategoriaRoutes.js";
import precioRoutes from "./routes/precioRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/productos", productoRoutes);
app.use("/presentaciones", presentacionRoutes);
app.use("/catalogos", catalogosRoutes);
app.use("/producto-categorias", productoCategoriaRoutes);
app.use("/precios", precioRoutes);

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