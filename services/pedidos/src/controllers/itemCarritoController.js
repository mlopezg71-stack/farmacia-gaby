import prisma from "../config/prisma.js";
import { obtenerProductosCatalogo } from "../services/catalogoService.js";

// Agregar una presentación al carrito
export const agregarItemCarrito = async (req, res) => {
    try {
        const {
            id_carrito,
            id_presentacion,
            cantidad,
        } = req.body;

        if (!id_carrito || !id_presentacion || !cantidad) {
            return res.status(400).json({
                message: "id_carrito, id_presentacion y cantidad son obligatorios",
            });
        }

        if (Number(cantidad) <= 0) {
            return res.status(400).json({
                message: "La cantidad debe ser mayor que 0",
            });
        }

        const carrito = await prisma.carrito.findUnique({
            where: {
                id_carrito: Number(id_carrito),
            },
        });

        if (!carrito) {
            return res.status(404).json({
                message: "Carrito no encontrado",
            });
        }

        if (carrito.estado !== "ACTIVO") {
            return res.status(400).json({
                message: "El carrito no está activo",
            });
        }

        const productos = await obtenerProductosCatalogo();

        let presentacionEncontrada = null;
        let productoEncontrado = null;
        let precioEncontrado = null;

        for (const producto of productos) {
            const presentaciones =
                producto.rel_presentacion_producto_id_producto || [];

            const presentacion = presentaciones.find(
                (item) =>
                    Number(item.id_presentacion_producto) ===
                    Number(id_presentacion)
            );

            if (presentacion) {
                presentacionEncontrada = presentacion;
                productoEncontrado = producto;

                const precios =
                    presentacion.rel_precio_presentacion_id_presentacion ||
                    [];

                if (precios.length > 0) {
                    precioEncontrado = precios[0];
                }

                break;
            }
        }

        if (!presentacionEncontrada || !productoEncontrado) {
            return res.status(404).json({
                message: "La presentación no existe en el catálogo público",
            });
        }

        if (
            presentacionEncontrada.estado !== "ACTIVO" ||
            presentacionEncontrada.permite_venta !== true
        ) {
            return res.status(400).json({
                message: "La presentación no está disponible para venta",
            });
        }

        if (!precioEncontrado) {
            return res.status(400).json({
                message: "La presentación no tiene un precio disponible",
            });
        }

        const itemExistente = await prisma.itemCarrito.findUnique({
            where: {
                id_carrito_id_presentacion: {
                    id_carrito: Number(id_carrito),
                    id_presentacion: Number(id_presentacion),
                },
            },
        });

        if (itemExistente) {
            const item = await prisma.itemCarrito.update({
                where: {
                    id_item_carrito: itemExistente.id_item_carrito,
                },
                data: {
                    cantidad:
                        itemExistente.cantidad + Number(cantidad),
                    precio_observado: precioEncontrado.importe,
                },
            });

            return res.status(200).json(item);
        }

        const item = await prisma.itemCarrito.create({
            data: {
                id_carrito: Number(id_carrito),
                id_presentacion: Number(id_presentacion),
                cantidad: Number(cantidad),
                precio_observado: precioEncontrado.importe,
            },
        });

        res.status(201).json(item);
    } catch (error) {
        console.error("Error al agregar item al carrito:", error);

        res.status(500).json({
            message: "Error al agregar el item al carrito",
        });
    }
};

// Actualizar cantidad de un item
export const actualizarItemCarrito = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || Number(cantidad) <= 0) {
            return res.status(400).json({
                message: "La cantidad debe ser mayor que 0",
            });
        }

        const item = await prisma.itemCarrito.findUnique({
            where: {
                id_item_carrito: Number(id),
            },
        });

        if (!item) {
            return res.status(404).json({
                message: "Item del carrito no encontrado",
            });
        }

        const itemActualizado = await prisma.itemCarrito.update({
            where: {
                id_item_carrito: Number(id),
            },
            data: {
                cantidad: Number(cantidad),
            },
        });

        res.status(200).json(itemActualizado);
    } catch (error) {
        console.error("Error al actualizar item del carrito:", error);

        res.status(500).json({
            message: "Error al actualizar el item del carrito",
        });
    }
};

// Eliminar un item del carrito
export const eliminarItemCarrito = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.itemCarrito.findUnique({
            where: {
                id_item_carrito: Number(id),
            },
        });

        if (!item) {
            return res.status(404).json({
                message: "Item del carrito no encontrado",
            });
        }

        await prisma.itemCarrito.delete({
            where: {
                id_item_carrito: Number(id),
            },
        });

        res.status(200).json({
            message: "Item eliminado correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar item del carrito:", error);

        res.status(500).json({
            message: "Error al eliminar el item del carrito",
        });
    }
};