import prisma from "../config/prisma.js";
import { randomUUID } from "crypto";

// Crear reserva de inventario para un pedido
export const crearReserva = async (req, res) => {
    try {
        const {
            id_pedido,
            id_sucursal,
            clave_idempotencia,
            vence_at,
            detalles,
        } = req.body;

        if (
            !id_pedido ||
            !id_sucursal ||
            !clave_idempotencia ||
            !vence_at ||
            !Array.isArray(detalles) ||
            detalles.length === 0
        ) {
            return res.status(400).json({
                message:
                    "id_pedido, id_sucursal, clave_idempotencia, vence_at y detalles son obligatorios",
            });
        }

        const reservaExistente =
            await prisma.reservaInventario.findUnique({
                where: {
                    clave_idempotencia,
                },
                include: {
                    rel_reserva_detalle_id_reserva: true,
                },
            });

        if (reservaExistente) {
            return res.status(200).json(reservaExistente);
        }

        for (const detalle of detalles) {
            if (
                !detalle.id_detalle_pedido ||
                !detalle.id_presentacion ||
                !detalle.cantidad ||
                Number(detalle.cantidad) <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Cada detalle debe incluir id_detalle_pedido, id_presentacion y una cantidad mayor que 0",
                });
            }
        }

        const reserva = await prisma.$transaction(async (tx) => {
            const nuevaReserva =
                await tx.reservaInventario.create({
                    data: {
                        id_pedido: Number(id_pedido),
                        id_sucursal: Number(id_sucursal),
                        clave_idempotencia,
                        vence_at: new Date(vence_at),
                        estado: "ACTIVA",
                    },
                });

            for (const detalle of detalles) {
                let cantidadPendiente = Number(
                    detalle.cantidad
                );

                // FEFO: primero los lotes con vencimiento más próximo
                const existencias =
                    await tx.existencia.findMany({
                        where: {
                            id_presentacion: Number(
                                detalle.id_presentacion
                            ),
                            ref_id_ubicacion: {
                                id_sucursal:
                                    Number(id_sucursal),
                                activa: true,
                            },
                            ref_id_lote: {
                                estado: "DISPONIBLE",
                            },
                        },
                        include: {
                            ref_id_lote: true,
                        },
                    });

                existencias.sort((a, b) => {
                    const fechaA =
                        a.ref_id_lote.fecha_vencimiento;
                    const fechaB =
                        b.ref_id_lote.fecha_vencimiento;

                    if (!fechaA && !fechaB) {
                        return 0;
                    }

                    if (!fechaA) {
                        return 1;
                    }

                    if (!fechaB) {
                        return -1;
                    }

                    return (
                        new Date(fechaA).getTime() -
                        new Date(fechaB).getTime()
                    );
                });

                const disponibleTotal =
                    existencias.reduce(
                        (total, existencia) =>
                            total +
                            (existencia.cantidad_fisica -
                                existencia.cantidad_reservada),
                        0
                    );

                if (
                    disponibleTotal <
                    cantidadPendiente
                ) {
                    throw new Error(
                        `STOCK_INSUFICIENTE:${detalle.id_presentacion}`
                    );
                }

                for (const existencia of existencias) {
                    if (cantidadPendiente <= 0) {
                        break;
                    }

                    const disponible =
                        existencia.cantidad_fisica -
                        existencia.cantidad_reservada;

                    if (disponible <= 0) {
                        continue;
                    }

                    const cantidadReservar = Math.min(
                        disponible,
                        cantidadPendiente
                    );

                    await tx.reservaDetalle.create({
                        data: {
                            id_detalle_pedido: Number(
                                detalle.id_detalle_pedido
                            ),
                            cantidad: cantidadReservar,
                            id_reserva:
                                nuevaReserva.id_reserva_inventario,
                            id_existencia:
                                existencia.id_existencia,
                        },
                    });

                    await tx.existencia.update({
                        where: {
                            id_existencia:
                                existencia.id_existencia,
                        },
                        data: {
                            cantidad_reservada: {
                                increment:
                                    cantidadReservar,
                            },
                            version: {
                                increment: 1,
                            },
                        },
                    });

                    cantidadPendiente -=
                        cantidadReservar;
                }
            }

            await tx.eventoReserva.create({
                data: {
                    estado: "ACTIVA",
                    motivo:
                        "Reserva creada para pedido",
                    clave_evento: `RESERVA-CREADA-${randomUUID()}`,
                    id_reserva:
                        nuevaReserva.id_reserva_inventario,
                },
            });

            return tx.reservaInventario.findUnique({
                where: {
                    id_reserva_inventario:
                        nuevaReserva.id_reserva_inventario,
                },
                include: {
                    rel_reserva_detalle_id_reserva: {
                        include: {
                            ref_id_existencia: {
                                include: {
                                    ref_id_lote: true,
                                    ref_id_ubicacion: true,
                                },
                            },
                        },
                    },
                    rel_evento_reserva_id_reserva: true,
                },
            });
        });

        res.status(201).json(reserva);
    } catch (error) {
        console.error(
            "Error al crear reserva de inventario:",
            error
        );

        if (
            error.message?.startsWith(
                "STOCK_INSUFICIENTE:"
            )
        ) {
            const idPresentacion =
                error.message.split(":")[1];

            return res.status(409).json({
                message:
                    "Stock insuficiente para completar la reserva",
                id_presentacion:
                    Number(idPresentacion),
            });
        }

        res.status(500).json({
            message:
                "Error al crear la reserva de inventario",
        });
    }
};
// Confirmar una reserva de inventario
export const confirmarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_actor } = req.body;

        const reserva = await prisma.reservaInventario.findUnique({
            where: {
                id_reserva_inventario: Number(id),
            },
        });

        if (!reserva) {
            return res.status(404).json({
                message: "Reserva de inventario no encontrada",
            });
        }

        if (reserva.estado !== "ACTIVA") {
            return res.status(400).json({
                message:
                    "Solo una reserva ACTIVA puede ser confirmada",
            });
        }

        if (reserva.vence_at <= new Date()) {
            return res.status(400).json({
                message:
                    "La reserva ya alcanzó su fecha de vencimiento",
            });
        }

        const reservaConfirmada = await prisma.$transaction(
            async (tx) => {
                const actualizada =
                    await tx.reservaInventario.update({
                        where: {
                            id_reserva_inventario: Number(id),
                        },
                        data: {
                            estado: "CONFIRMADA",
                            confirmada_at: new Date(),
                            version: {
                                increment: 1,
                            },
                        },
                    });

                await tx.eventoReserva.create({
                    data: {
                        estado: "CONFIRMADA",
                        motivo: "Reserva confirmada",
                        id_actor:
                            id_actor !== undefined &&
                                id_actor !== null
                                ? Number(id_actor)
                                : null,
                        clave_evento:
                            `RESERVA-CONFIRMADA-${randomUUID()}`,
                        id_reserva:
                            actualizada.id_reserva_inventario,
                    },
                });

                return actualizada;
            }
        );

        res.status(200).json(reservaConfirmada);
    } catch (error) {
        console.error(
            "Error al confirmar reserva de inventario:",
            error
        );

        res.status(500).json({
            message:
                "Error al confirmar la reserva de inventario",
        });
    }
};
// Consumir una reserva de inventario
export const consumirReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_actor } = req.body;

        const reserva = await prisma.reservaInventario.findUnique({
            where: {
                id_reserva_inventario: Number(id),
            },
            include: {
                rel_reserva_detalle_id_reserva: true,
            },
        });

        if (!reserva) {
            return res.status(404).json({
                message: "Reserva de inventario no encontrada",
            });
        }

        if (reserva.estado !== "CONFIRMADA") {
            return res.status(400).json({
                message:
                    "Solo una reserva CONFIRMADA puede ser consumida",
            });
        }

        const reservaConsumida = await prisma.$transaction(
            async (tx) => {
                for (
                    const detalle of
                    reserva.rel_reserva_detalle_id_reserva
                ) {
                    const existencia =
                        await tx.existencia.findUnique({
                            where: {
                                id_existencia:
                                    detalle.id_existencia,
                            },
                        });

                    if (!existencia) {
                        throw new Error(
                            `EXISTENCIA_NO_ENCONTRADA:${detalle.id_existencia}`
                        );
                    }

                    if (
                        existencia.cantidad_fisica <
                        detalle.cantidad ||
                        existencia.cantidad_reservada <
                        detalle.cantidad
                    ) {
                        throw new Error(
                            `INVENTARIO_INCONSISTENTE:${detalle.id_existencia}`
                        );
                    }

                    await tx.existencia.update({
                        where: {
                            id_existencia:
                                detalle.id_existencia,
                        },
                        data: {
                            cantidad_fisica: {
                                decrement: detalle.cantidad,
                            },
                            cantidad_reservada: {
                                decrement: detalle.cantidad,
                            },
                            version: {
                                increment: 1,
                            },
                        },
                    });
                }

                const actualizada =
                    await tx.reservaInventario.update({
                        where: {
                            id_reserva_inventario:
                                Number(id),
                        },
                        data: {
                            estado: "CONSUMIDA",
                            consumida_at: new Date(),
                            version: {
                                increment: 1,
                            },
                        },
                    });

                await tx.eventoReserva.create({
                    data: {
                        estado: "CONSUMIDA",
                        motivo:
                            "Inventario reservado consumido",
                        id_actor:
                            id_actor !== undefined &&
                                id_actor !== null
                                ? Number(id_actor)
                                : null,
                        clave_evento:
                            `RESERVA-CONSUMIDA-${randomUUID()}`,
                        id_reserva:
                            actualizada.id_reserva_inventario,
                    },
                });

                return actualizada;
            }
        );

        res.status(200).json(reservaConsumida);
    } catch (error) {
        console.error(
            "Error al consumir reserva de inventario:",
            error
        );

        if (
            error.message?.startsWith(
                "EXISTENCIA_NO_ENCONTRADA:"
            )
        ) {
            return res.status(409).json({
                message:
                    "Una existencia asociada a la reserva ya no existe",
            });
        }

        if (
            error.message?.startsWith(
                "INVENTARIO_INCONSISTENTE:"
            )
        ) {
            return res.status(409).json({
                message:
                    "El inventario reservado presenta una inconsistencia",
            });
        }

        res.status(500).json({
            message:
                "Error al consumir la reserva de inventario",
        });
    }
};

// Liberar una reserva de inventario
export const liberarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_actor, motivo } = req.body;

        const reserva = await prisma.reservaInventario.findUnique({
            where: {
                id_reserva_inventario: Number(id),
            },
            include: {
                rel_reserva_detalle_id_reserva: true,
            },
        });

        if (!reserva) {
            return res.status(404).json({
                message: "Reserva de inventario no encontrada",
            });
        }

        if (
            reserva.estado !== "ACTIVA" &&
            reserva.estado !== "CONFIRMADA"
        ) {
            return res.status(400).json({
                message:
                    "Solo una reserva ACTIVA o CONFIRMADA puede ser liberada",
            });
        }

        const reservaLiberada = await prisma.$transaction(
            async (tx) => {
                for (
                    const detalle of
                    reserva.rel_reserva_detalle_id_reserva
                ) {
                    const existencia =
                        await tx.existencia.findUnique({
                            where: {
                                id_existencia:
                                    detalle.id_existencia,
                            },
                        });

                    if (!existencia) {
                        throw new Error(
                            `EXISTENCIA_NO_ENCONTRADA:${detalle.id_existencia}`
                        );
                    }

                    if (
                        existencia.cantidad_reservada <
                        detalle.cantidad
                    ) {
                        throw new Error(
                            `RESERVA_INCONSISTENTE:${detalle.id_existencia}`
                        );
                    }

                    await tx.existencia.update({
                        where: {
                            id_existencia:
                                detalle.id_existencia,
                        },
                        data: {
                            cantidad_reservada: {
                                decrement: detalle.cantidad,
                            },
                            version: {
                                increment: 1,
                            },
                        },
                    });
                }

                const actualizada =
                    await tx.reservaInventario.update({
                        where: {
                            id_reserva_inventario:
                                Number(id),
                        },
                        data: {
                            estado: "LIBERADA",
                            liberada_at: new Date(),
                            version: {
                                increment: 1,
                            },
                        },
                    });

                await tx.eventoReserva.create({
                    data: {
                        estado: "LIBERADA",
                        motivo:
                            motivo ??
                            "Reserva de inventario liberada",
                        id_actor:
                            id_actor !== undefined &&
                                id_actor !== null
                                ? Number(id_actor)
                                : null,
                        clave_evento:
                            `RESERVA-LIBERADA-${randomUUID()}`,
                        id_reserva:
                            actualizada.id_reserva_inventario,
                    },
                });

                return actualizada;
            }
        );

        res.status(200).json(reservaLiberada);
    } catch (error) {
        console.error(
            "Error al liberar reserva de inventario:",
            error
        );

        if (
            error.message?.startsWith(
                "EXISTENCIA_NO_ENCONTRADA:"
            )
        ) {
            return res.status(409).json({
                message:
                    "Una existencia asociada a la reserva ya no existe",
            });
        }

        if (
            error.message?.startsWith(
                "RESERVA_INCONSISTENTE:"
            )
        ) {
            return res.status(409).json({
                message:
                    "La cantidad reservada presenta una inconsistencia",
            });
        }

        res.status(500).json({
            message:
                "Error al liberar la reserva de inventario",
        });
    }
};
// Obtener reserva de inventario por pedido
export const obtenerReservaPorPedido = async (req, res) => {
    try {
        const { id_pedido } = req.params;

        const reserva = await prisma.reservaInventario.findFirst({
            where: {
                id_pedido: Number(id_pedido),
            },
            orderBy: {
                created_at: "desc",
            },
            include: {
                rel_reserva_detalle_id_reserva: {
                    include: {
                        ref_id_existencia: {
                            include: {
                                ref_id_lote: true,
                                ref_id_ubicacion: true,
                            },
                        },
                    },
                },
                rel_evento_reserva_id_reserva: true,
            },
        });

        if (!reserva) {
            return res.status(404).json({
                message:
                    "No se encontró una reserva para el pedido",
            });
        }

        res.status(200).json(reserva);
    } catch (error) {
        console.error(
            "Error al obtener reserva por pedido:",
            error
        );

        res.status(500).json({
            message:
                "Error al obtener la reserva del pedido",
        });
    }
};