import prisma from "../config/prisma.js";

// Crear información de facturación de un pedido
export const crearPedidoFacturacion = async (req, res) => {
    try {
        const {
            id_pedido,
            nombre,
            identificacion_fiscal,
            direccion,
            correo,
        } = req.body;

        if (!id_pedido || !nombre) {
            return res.status(400).json({
                message: "id_pedido y nombre son obligatorios",
            });
        }

        const pedido = await prisma.pedido.findUnique({
            where: {
                id_pedido: Number(id_pedido),
            },
        });

        if (!pedido) {
            return res.status(404).json({
                message: "Pedido no encontrado",
            });
        }

        const facturacionExistente =
            await prisma.pedidoFacturacion.findUnique({
                where: {
                    id_pedido: Number(id_pedido),
                },
            });

        if (facturacionExistente) {
            return res.status(409).json({
                message:
                    "El pedido ya tiene información de facturación",
            });
        }

        const facturacion =
            await prisma.pedidoFacturacion.create({
                data: {
                    id_pedido: Number(id_pedido),
                    nombre,
                    identificacion_fiscal:
                        identificacion_fiscal ?? null,
                    direccion: direccion ?? null,
                    correo: correo ?? null,
                },
            });

        res.status(201).json(facturacion);
    } catch (error) {
        console.error(
            "Error al crear facturación del pedido:",
            error
        );

        res.status(500).json({
            message:
                "Error al crear la información de facturación",
        });
    }
};

// Obtener información de facturación de un pedido
export const obtenerPedidoFacturacion = async (req, res) => {
    try {
        const { id_pedido } = req.params;

        const facturacion =
            await prisma.pedidoFacturacion.findUnique({
                where: {
                    id_pedido: Number(id_pedido),
                },
            });

        if (!facturacion) {
            return res.status(404).json({
                message:
                    "Información de facturación no encontrada",
            });
        }

        res.status(200).json(facturacion);
    } catch (error) {
        console.error(
            "Error al obtener facturación del pedido:",
            error
        );

        res.status(500).json({
            message:
                "Error al obtener la información de facturación",
        });
    }
};