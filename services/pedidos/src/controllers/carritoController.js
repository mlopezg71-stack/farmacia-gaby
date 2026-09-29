import prisma from "../config/prisma.js";

// Crear carrito
export const crearCarrito = async (req, res) => {
    try {
        const {
            id_cliente,
            token_invitado_hash,
            moneda,
            id_sucursal,
            vence_at,
        } = req.body;

        if (!vence_at) {
            return res.status(400).json({
                message: "vence_at es obligatorio",
            });
        }

        const fechaVencimiento = new Date(vence_at);

        if (Number.isNaN(fechaVencimiento.getTime())) {
            return res.status(400).json({
                message: "vence_at no contiene una fecha válida",
            });
        }

        const carrito = await prisma.carrito.create({
            data: {
                id_cliente:
                    id_cliente !== undefined &&
                        id_cliente !== null
                        ? Number(id_cliente)
                        : null,

                token_invitado_hash:
                    token_invitado_hash ?? null,

                moneda: moneda ?? "GTQ",

                id_sucursal:
                    id_sucursal !== undefined &&
                        id_sucursal !== null
                        ? Number(id_sucursal)
                        : null,

                vence_at: fechaVencimiento,
            },
            include: {
                rel_item_carrito_id_carrito: true,
            },
        });

        res.status(201).json(carrito);
    } catch (error) {
        console.error(
            "Error al crear carrito:",
            error
        );

        res.status(500).json({
            message: "Error al crear el carrito",
        });
    }
};

// Obtener carrito por ID
export const obtenerCarrito = async (req, res) => {
    try {
        const { id } = req.params;

        const carrito = await prisma.carrito.findUnique({
            where: {
                id_carrito: Number(id),
            },
            include: {
                rel_item_carrito_id_carrito: true,
            },
        });

        if (!carrito) {
            return res.status(404).json({
                message: "Carrito no encontrado",
            });
        }

        res.status(200).json(carrito);
    } catch (error) {
        console.error(
            "Error al obtener carrito:",
            error
        );

        res.status(500).json({
            message: "Error al obtener el carrito",
        });
    }
};