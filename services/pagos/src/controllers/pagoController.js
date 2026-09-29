import prisma from "../config/prisma.js";

import {
    confirmarPedido,
    cancelarPedido,
} from "../services/pedidosService.js";

// Listar pagos
export const listarPagos = async (req, res) => {
    try {
        const pagos = await prisma.pago.findMany({
            include: {
                rel_intento_pago_id_pago: true,
                rel_reembolso_id_pago: true,
            },
            orderBy: {
                created_at: "desc",
            },
        });

        res.status(200).json(pagos);
    } catch (error) {
        console.error("Error al listar pagos:", error);

        res.status(500).json({
            message: "Error al listar los pagos",
        });
    }
};

// Obtener pago por ID
export const obtenerPago = async (req, res) => {
    try {
        const { id } = req.params;

        const pago = await prisma.pago.findUnique({
            where: {
                id_pago: Number(id),
            },
            include: {
                rel_intento_pago_id_pago: true,
                rel_reembolso_id_pago: true,
            },
        });

        if (!pago) {
            return res.status(404).json({
                message: "Pago no encontrado",
            });
        }

        res.status(200).json(pago);
    } catch (error) {
        console.error("Error al obtener pago:", error);

        res.status(500).json({
            message: "Error al obtener el pago",
        });
    }
};

// Crear pago
export const crearPago = async (req, res) => {
    try {
        const {
            id_pedido,
            id_cliente,
            monto,
            moneda,
            metodo,
            clave_idempotencia,
        } = req.body;

        if (
            !id_pedido ||
            monto === undefined ||
            monto === null ||
            !metodo ||
            !clave_idempotencia
        ) {
            return res.status(400).json({
                message:
                    "id_pedido, monto, metodo y clave_idempotencia son obligatorios",
            });
        }

        if (Number(monto) <= 0) {
            return res.status(400).json({
                message: "El monto debe ser mayor que 0",
            });
        }

        const metodosPermitidos = [
            "EFECTIVO",
            "TARJETA",
            "TRANSFERENCIA",
            "OTRO",
        ];

        if (!metodosPermitidos.includes(metodo)) {
            return res.status(400).json({
                message: "Método de pago no válido",
            });
        }

        const pagoExistente = await prisma.pago.findUnique({
            where: {
                clave_idempotencia,
            },
        });

        if (pagoExistente) {
            return res.status(200).json(pagoExistente);
        }

        const pago = await prisma.pago.create({
            data: {
                id_pedido: Number(id_pedido),
                id_cliente:
                    id_cliente !== undefined &&
                        id_cliente !== null
                        ? Number(id_cliente)
                        : null,
                monto,
                moneda: moneda ?? "GTQ",
                metodo,
                clave_idempotencia,
                rel_intento_pago_id_pago: {
                    create: {
                        proveedor: "SIMULADO",
                        clave_idempotencia:
                            `INTENTO-${clave_idempotencia}`,
                        monto,
                    },
                },
            },
            include: {
                rel_intento_pago_id_pago: true,
            },
        });

        res.status(201).json(pago);
    } catch (error) {
        console.error("Error al crear pago:", error);

        res.status(500).json({
            message: "Error al crear el pago",
        });
    }
};

// Obtener pagos por pedido
export const obtenerPagosPorPedido = async (req, res) => {
    try {
        const { id_pedido } = req.params;

        const pagos = await prisma.pago.findMany({
            where: {
                id_pedido: Number(id_pedido),
            },
            include: {
                rel_intento_pago_id_pago: true,
                rel_reembolso_id_pago: true,
            },
            orderBy: {
                created_at: "desc",
            },
        });

        res.status(200).json(pagos);
    } catch (error) {
        console.error(
            "Error al obtener pagos del pedido:",
            error
        );

        res.status(500).json({
            message:
                "Error al obtener los pagos del pedido",
        });
    }
};

// Cambiar estado de un pago
export const cambiarEstadoPago = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = [
            "PENDIENTE",
            "AUTORIZADO",
            "CONFIRMADO",
            "FALLIDO",
            "CANCELADO",
            "REEMBOLSADO_PARCIAL",
            "REEMBOLSADO",
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                message: "Estado de pago no válido",
            });
        }

        const pago = await prisma.pago.findUnique({
            where: {
                id_pago: Number(id),
            },
        });

        if (!pago) {
            return res.status(404).json({
                message: "Pago no encontrado",
            });
        }

        if (pago.estado === estado) {
            return res.status(400).json({
                message: "El pago ya se encuentra en ese estado",
            });
        }

        const transicionesPermitidas = {
            PENDIENTE: [
                "AUTORIZADO",
                "CONFIRMADO",
                "FALLIDO",
                "CANCELADO",
            ],
            AUTORIZADO: [
                "CONFIRMADO",
                "FALLIDO",
                "CANCELADO",
            ],
            CONFIRMADO: [
                "REEMBOLSADO_PARCIAL",
                "REEMBOLSADO",
            ],
            REEMBOLSADO_PARCIAL: [
                "REEMBOLSADO",
            ],
            FALLIDO: [],
            CANCELADO: [],
            REEMBOLSADO: [],
        };

        const siguientesEstados =
            transicionesPermitidas[pago.estado] ?? [];

        if (!siguientesEstados.includes(estado)) {
            return res.status(400).json({
                message:
                    `No se permite cambiar el pago de ${pago.estado} a ${estado}`,
            });
        }

        if (estado === "CONFIRMADO") {
            try {
                await confirmarPedido(
                    pago.id_pedido
                );
            } catch (errorPedido) {
                return res
                    .status(errorPedido.status || 503)
                    .json({
                        message:
                            errorPedido.data?.message ??
                            "No fue posible confirmar el pedido",
                    });
            }
        }

        if (estado === "CANCELADO") {
            try {
                await cancelarPedido(
                    pago.id_pedido,
                    null,
                    "Pago cancelado"
                );
            } catch (errorPedido) {
                return res
                    .status(errorPedido.status || 503)
                    .json({
                        message:
                            errorPedido.data?.message ??
                            "No fue posible cancelar el pedido",
                    });
            }
        }

        if (estado === "CONFIRMADO") {
            await prisma.intentoPago.updateMany({
                where: {
                    id_pago: pago.id_pago,
                    estado: {
                        in: ["PENDIENTE", "AUTORIZADO"],
                    },
                },
                data: {
                    estado: "CONFIRMADO",
                    finalizado_at: new Date(),
                },
            });
        }

        if (estado === "FALLIDO") {
            await prisma.intentoPago.updateMany({
                where: {
                    id_pago: pago.id_pago,
                    estado: {
                        in: ["PENDIENTE", "AUTORIZADO"],
                    },
                },
                data: {
                    estado: "FALLIDO",
                    finalizado_at: new Date(),
                },
            });
        }

        if (estado === "CANCELADO") {
            await prisma.intentoPago.updateMany({
                where: {
                    id_pago: pago.id_pago,
                    estado: {
                        in: ["PENDIENTE", "AUTORIZADO"],
                    },
                },
                data: {
                    estado: "CANCELADO",
                    finalizado_at: new Date(),
                },
            });
        }

        if (estado === "AUTORIZADO") {
            await prisma.intentoPago.updateMany({
                where: {
                    id_pago: pago.id_pago,
                    estado: "PENDIENTE",
                },
                data: {
                    estado: "AUTORIZADO",
                },
            });
        }

        const pagoActualizado = await prisma.pago.update({
            where: {
                id_pago: Number(id),
            },
            data: {
                estado,
                autorizado_at:
                    estado === "AUTORIZADO"
                        ? new Date()
                        : pago.autorizado_at,
                confirmado_at:
                    estado === "CONFIRMADO"
                        ? new Date()
                        : pago.confirmado_at,
                version: {
                    increment: 1,
                },
            },
        });

        res.status(200).json(pagoActualizado);
    } catch (error) {
        console.error(
            "Error al cambiar estado del pago:",
            error
        );

        res.status(500).json({
            message: "Error al cambiar el estado del pago",
        });
    }
};