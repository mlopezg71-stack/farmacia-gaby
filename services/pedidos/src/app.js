import express from "express";
import cors from "cors";

import carritoRoutes from "./routes/carritoRoutes.js";
import itemCarritoRoutes from "./routes/itemCarritoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import pedidoContactoRoutes from "./routes/pedidoContactoRoutes.js";
import pedidoFacturacionRoutes from "./routes/pedidoFacturacionRoutes.js";
import envioRoutes from "./routes/envioRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/carritos", carritoRoutes);
app.use("/items-carrito", itemCarritoRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/pedidos-contacto", pedidoContactoRoutes);
app.use("/pedidos-facturacion", pedidoFacturacionRoutes);
app.use("/envios", envioRoutes);

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