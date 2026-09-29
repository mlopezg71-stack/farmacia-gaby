import prisma from "../config/prisma.js";

export const crearReembolso = async (req, res) => {
    try {
        const {
            id_pago,
            id_devolucion,
            monto,
            motivo,
            clave_idempotencia,
        } = req.body;

        if (
            !id_pago ||
            monto === undefined ||
            monto === null ||
            !motivo ||
            !clave_idempotencia
        ) {
            return res.status(400).json({
                message:
                    "id_pago, monto, motivo y clave_idempotencia son obligatorios",
            });
        }

        if (Number(monto) <= 0) {
            return res.status(400).json({
                message:
                    "El monto del reembolso debe ser mayor que 0",
            });
        }

        const reembolsoExistente =
            await prisma.reembolso.findUnique({
                where: {
                    clave_idempotencia,
                },
            });

        if (reembolsoExistente) {
            return res
                .status(200)
                .json(reembolsoExistente);
        }

        const pago = await prisma.pago.findUnique({
            where: {
                id_pago: Number(id_pago),
            },
        });

        if (!pago) {
            return res.status(404).json({
                message: "Pago no encontrado",
            });
        }

        if (
            pago.estado !== "CONFIRMADO" &&
            pago.estado !== "REEMBOLSADO_PARCIAL"
        ) {
            return res.status(400).json({
                message:
                    "El pago no está disponible para reembolso",
            });
        }

        const reembolsosActivos =
            await prisma.reembolso.findMany({
                where: {
                    id_pago: pago.id_pago,
                    estado: {
                        in: [
                            "SOLICITADO",
                            "PROCESANDO",
                            "CONFIRMADO",
                        ],
                    },
                },
            });

        const totalReembolsado =
            reembolsosActivos.reduce(
                (total, reembolso) =>
                    total + Number(reembolso.monto),
                0
            );

        const montoDisponible =
            Number(pago.monto) - totalReembolsado;

        if (Number(monto) > montoDisponible) {
            return res.status(400).json({
                message:
                    "El monto del reembolso supera el monto disponible para reembolsar",
            });
        }

        const reembolso =
            await prisma.reembolso.create({
                data: {
                    id_pago: pago.id_pago,
                    id_devolucion:
                        id_devolucion !== undefined &&
                            id_devolucion !== null
                            ? Number(id_devolucion)
                            : null,
                    monto,
                    motivo,
                    proveedor: "SIMULADO",
                    clave_idempotencia,
                },
            });

        res.status(201).json(reembolso);
    } catch (error) {
        console.error(
            "Error al crear reembolso:",
            error
        );

        res.status(500).json({
            message:
                "Error al crear el reembolso",
        });
    }
};

export const obtenerReembolsosPorPago = async (req, res) => {
    try {
        const { id_pago } = req.params;

        const reembolsos = await prisma.reembolso.findMany({
            where: {
                id_pago: Number(id_pago),
            },
            orderBy: {
                created_at: "desc",
            },
        });

        res.status(200).json(reembolsos);
    } catch (error) {
        console.error(
            "Error al obtener reembolsos del pago:",
            error
        );

        res.status(500).json({
            message:
                "Error al obtener los reembolsos del pago",
        });
    }
};

export const obtenerReembolso = async (req, res) => {
    try {
        const { id } = req.params;

        const reembolso = await prisma.reembolso.findUnique({
            where: {
                id_reembolso: Number(id),
            },
        });

        if (!reembolso) {
            return res.status(404).json({
                message: "Reembolso no encontrado",
            });
        }

        res.status(200).json(reembolso);
    } catch (error) {
        console.error(
            "Error al obtener reembolso:",
            error
        );

        res.status(500).json({
            message:
                "Error al obtener el reembolso",
        });
    }
};

export const cambiarEstadoReembolso = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = [
            "SOLICITADO",
            "PROCESANDO",
            "CONFIRMADO",
            "FALLIDO",
            "CANCELADO",
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                message: "Estado de reembolso no válido",
            });
        }

        const reembolso = await prisma.reembolso.findUnique({
            where: {
                id_reembolso: Number(id),
            },
        });

        if (!reembolso) {
            return res.status(404).json({
                message: "Reembolso no encontrado",
            });
        }

        if (reembolso.estado === estado) {
            return res.status(400).json({
                message:
                    "El reembolso ya se encuentra en ese estado",
            });
        }

        const transicionesPermitidas = {
            SOLICITADO: [
                "PROCESANDO",
                "CANCELADO",
            ],
            PROCESANDO: [
                "CONFIRMADO",
                "FALLIDO",
                "CANCELADO",
            ],
            CONFIRMADO: [],
            FALLIDO: [],
            CANCELADO: [],
        };

        const siguientesEstados =
            transicionesPermitidas[reembolso.estado] ?? [];

        if (!siguientesEstados.includes(estado)) {
            return res.status(400).json({
                message:
                    `No se permite cambiar el reembolso de ${reembolso.estado} a ${estado}`,
            });
        }

        const reembolsoActualizado =
            await prisma.reembolso.update({
                where: {
                    id_reembolso: Number(id),
                },
                data: {
                    estado,
                    confirmado_at:
                        estado === "CONFIRMADO"
                            ? new Date()
                            : reembolso.confirmado_at,
                },
            });

        if (estado === "CONFIRMADO") {
            const pago = await prisma.pago.findUnique({
                where: {
                    id_pago: reembolso.id_pago,
                },
            });

            if (!pago) {
                return res.status(404).json({
                    message:
                        "El pago asociado al reembolso no fue encontrado",
                });
            }

            const reembolsosConfirmados =
                await prisma.reembolso.findMany({
                    where: {
                        id_pago: reembolso.id_pago,
                        estado: "CONFIRMADO",
                    },
                });

            const totalReembolsado =
                reembolsosConfirmados.reduce(
                    (total, item) =>
                        total + Number(item.monto),
                    0
                );

            const nuevoEstadoPago =
                totalReembolsado >= Number(pago.monto)
                    ? "REEMBOLSADO"
                    : "REEMBOLSADO_PARCIAL";

            await prisma.pago.update({
                where: {
                    id_pago: pago.id_pago,
                },
                data: {
                    estado: nuevoEstadoPago,
                    version: {
                        increment: 1,
                    },
                },
            });
        }

        res.status(200).json(reembolsoActualizado);
    } catch (error) {
        console.error(
            "Error al cambiar estado del reembolso:",
            error
        );

        res.status(500).json({
            message:
                "Error al cambiar el estado del reembolso",
        });
    }
};

