import prisma from "../config/prisma.js";

// Crear envío de un pedido
export const crearEnvio = async (req, res) => {
    try {
        const {
            id_pedido,
            numero_seguimiento,
            transportista,
            destino_historico,
            costo,
            id_repartidor,
            programado_at,
            id_franja,
        } = req.body;

        if (
            !id_pedido ||
            !numero_seguimiento ||
            !destino_historico ||
            costo === undefined
        ) {
            return res.status(400).json({
                message:
                    "id_pedido, numero_seguimiento, destino_historico y costo son obligatorios",
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

        const envioExistente = await prisma.envio.findFirst({
            where: {
                id_pedido: Number(id_pedido),
            },
        });

        if (envioExistente) {
            return res.status(409).json({
                message: "El pedido ya tiene un envío registrado",
            });
        }

        const envio = await prisma.envio.create({
            data: {
                id_pedido: Number(id_pedido),
                numero_seguimiento,
                transportista: transportista ?? null,
                estado: "PENDIENTE",
                destino_historico,
                costo,
                id_repartidor:
                    id_repartidor !== undefined &&
                        id_repartidor !== null
                        ? Number(id_repartidor)
                        : null,
                programado_at: programado_at
                    ? new Date(programado_at)
                    : null,
                id_franja:
                    id_franja !== undefined &&
                        id_franja !== null
                        ? Number(id_franja)
                        : null,
            },
        });

        res.status(201).json(envio);
    } catch (error) {
        console.error("Error al crear envío:", error);

        res.status(500).json({
            message: "Error al crear el envío",
        });
    }
};

// Obtener envío de un pedido
export const obtenerEnvioPorPedido = async (req, res) => {
    try {
        const { id_pedido } = req.params;

        const envio = await prisma.envio.findFirst({
            where: {
                id_pedido: Number(id_pedido),
            },
        });

        if (!envio) {
            return res.status(404).json({
                message: "Envío no encontrado",
            });
        }

        res.status(200).json(envio);
    } catch (error) {
        console.error("Error al obtener envío:", error);

        res.status(500).json({
            message: "Error al obtener el envío",
        });
    }
};