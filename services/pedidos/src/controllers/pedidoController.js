import prisma from "../config/prisma.js";
import {
    crearPago,
    obtenerPagosPorPedido,
} from "../services/pagosService.js";
// Listar pedidos
export const listarPedidos = async (req, res) => {
    try {
        const pedidos = await prisma.pedido.findMany({
            orderBy: {
                created_at: "desc",
            },
            include: {
                rel_detalle_pedido_id_pedido: true,
                rel_pedido_contacto_id_pedido: true,
                rel_pedido_facturacion_id_pedido: true,
                rel_historial_pedido_id_pedido: true,
                rel_envio_id_pedido: true,
            },
        });

        res.status(200).json(pedidos);
    } catch (error) {
        console.error("Error al listar pedidos:", error);

        res.status(500).json({
            message: "Error al listar los pedidos",
        });
    }
};

// Obtener pedido por ID
export const obtenerPedido = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await prisma.pedido.findUnique({
            where: {
                id_pedido: Number(id),
            },
            include: {
                rel_detalle_pedido_id_pedido: true,
                rel_pedido_contacto_id_pedido: true,
                rel_pedido_facturacion_id_pedido: true,
                rel_historial_pedido_id_pedido: true,
                rel_envio_id_pedido: true,
            },
        });

        if (!pedido) {
            return res.status(404).json({
                message: "Pedido no encontrado",
            });
        }

        res.status(200).json(pedido);
    } catch (error) {
        console.error("Error al obtener pedido:", error);

        res.status(500).json({
            message: "Error al obtener el pedido",
        });
    }
};

import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { obtenerProductosCatalogo } from "../services/catalogoService.js";
import {
    crearReservaInventario,
    obtenerReservaPorPedido,
    confirmarReservaInventario,
    liberarReservaInventario,
    consumirReservaInventario,
} from "../services/inventarioService.js";

// Crear pedido a partir de un carrito
export const crearPedido = async (req, res) => {
    try {
        const {
            id_carrito,
            id_cliente,
            id_sucursal,
            modalidad,
            clave_idempotencia,
        } = req.body;

        if (!id_carrito || !id_sucursal || !modalidad || !clave_idempotencia) {
            return res.status(400).json({
                message:
                    "id_carrito, id_sucursal, modalidad y clave_idempotencia son obligatorios",
            });
        }

        // Verificar idempotencia
        const pedidoExistente = await prisma.pedido.findUnique({
            where: {
                clave_idempotencia,
            },
        });

        if (pedidoExistente) {
            return res.status(200).json(pedidoExistente);
        }

        // Obtener carrito con sus items
        const carrito = await prisma.carrito.findUnique({
            where: {
                id_carrito: Number(id_carrito),
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

        if (carrito.estado !== "ACTIVO") {
            return res.status(400).json({
                message: "El carrito no está activo",
            });
        }

        if (carrito.rel_item_carrito_id_carrito.length === 0) {
            return res.status(400).json({
                message: "El carrito está vacío",
            });
        }

        // Obtener información actual del Catálogo
        const productos = await obtenerProductosCatalogo();

        const detalles = [];

        for (const item of carrito.rel_item_carrito_id_carrito) {
            let presentacionEncontrada = null;
            let productoEncontrado = null;
            let precioEncontrado = null;

            for (const producto of productos) {
                const presentaciones =
                    producto.rel_presentacion_producto_id_producto || [];

                const presentacion = presentaciones.find(
                    (presentacion) =>
                        Number(presentacion.id_presentacion_producto) ===
                        Number(item.id_presentacion)
                );

                if (presentacion) {
                    presentacionEncontrada = presentacion;
                    productoEncontrado = producto;

                    const precios =
                        presentacion
                            .rel_precio_presentacion_id_presentacion || [];

                    if (precios.length > 0) {
                        precioEncontrado = precios[0];
                    }

                    break;
                }
            }

            if (!presentacionEncontrada || !productoEncontrado) {
                return res.status(400).json({
                    message: `La presentación ${item.id_presentacion} ya no está disponible en Catálogo`,
                });
            }

            if (
                presentacionEncontrada.estado !== "ACTIVO" ||
                presentacionEncontrada.permite_venta !== true
            ) {
                return res.status(400).json({
                    message: `La presentación ${item.id_presentacion} no está disponible para venta`,
                });
            }

            if (!precioEncontrado) {
                return res.status(400).json({
                    message: `La presentación ${item.id_presentacion} no tiene precio disponible`,
                });
            }

            const cantidad = Number(item.cantidad);
            const precio = new Prisma.Decimal(precioEncontrado.importe);
            const tasa = new Prisma.Decimal(
                precioEncontrado.tasa_impuesto
            );

            let baseImponible;
            let impuesto;

            if (precioEncontrado.incluye_impuesto) {
                baseImponible = precio.div(
                    new Prisma.Decimal(1).plus(tasa)
                );

                impuesto = precio.minus(baseImponible);
            } else {
                baseImponible = precio;
                impuesto = baseImponible.mul(tasa);
            }

            const totalLinea = precio.mul(cantidad);
            const baseLinea = baseImponible.mul(cantidad);
            const impuestoLinea = impuesto.mul(cantidad);

            detalles.push({
                id_presentacion: Number(item.id_presentacion),
                sku: presentacionEncontrada.sku || `PRES-${item.id_presentacion}`,
                nombre_producto: productoEncontrado.nombre,
                presentacion: presentacionEncontrada.nombre,
                unidades_base: Number(
                    presentacionEncontrada.unidades_base
                ),
                cantidad,
                precio_unitario: precio,
                descuento: new Prisma.Decimal(0),
                base_imponible: baseLinea,
                tasa_impuesto: tasa,
                impuesto: impuestoLinea,
                total_linea: totalLinea,
                requiere_receta:
                    productoEncontrado.requiere_receta === true,
            });
        }

        const subtotal = detalles.reduce(
            (total, detalle) =>
                total.plus(detalle.base_imponible),
            new Prisma.Decimal(0)
        );

        const impuesto = detalles.reduce(
            (total, detalle) =>
                total.plus(detalle.impuesto),
            new Prisma.Decimal(0)
        );

        const descuento = new Prisma.Decimal(0);
        const envio = new Prisma.Decimal(0);

        const total = subtotal
            .minus(descuento)
            .plus(impuesto)
            .plus(envio);

        const numero = `PED-${Date.now()}-${randomUUID()
            .slice(0, 8)
            .toUpperCase()}`;

        const pedido = await prisma.$transaction(async (tx) => {
            const nuevoPedido = await tx.pedido.create({
                data: {
                    numero,
                    id_cliente:
                        id_cliente !== undefined && id_cliente !== null
                            ? Number(id_cliente)
                            : carrito.id_cliente,
                    id_sucursal: Number(id_sucursal),
                    modalidad,
                    estado: "BORRADOR",
                    moneda: carrito.moneda,
                    subtotal,
                    descuento,
                    impuesto,
                    envio,
                    total,
                    clave_idempotencia,
                    id_carrito: carrito.id_carrito,
                    version_precios: "catalogo",
                    rel_detalle_pedido_id_pedido: {
                        create: detalles,
                    },
                    rel_historial_pedido_id_pedido: {
                        create: {
                            estado_anterior: null,
                            estado_nuevo: "BORRADOR",
                            motivo: "Creación del pedido desde carrito",
                            evento_origen: `PEDIDO-CREADO-${randomUUID()}`,
                        },
                    },
                },
                include: {
                    rel_detalle_pedido_id_pedido: true,
                    rel_historial_pedido_id_pedido: true,
                },
            });

            await tx.carrito.update({
                where: {
                    id_carrito: carrito.id_carrito,
                },
                data: {
                    estado: "CONVERTIDO",
                },
            });

            return nuevoPedido;
        });

        const venceReserva = new Date(
            Date.now() + 15 * 60 * 1000
        );

        const detallesReserva =
            pedido.rel_detalle_pedido_id_pedido.map(
                (detalle) => ({
                    id_detalle_pedido:
                        detalle.id_detalle_pedido,
                    id_presentacion:
                        detalle.id_presentacion,
                    cantidad: detalle.cantidad,
                })
            );

        let reservaInventario;

        try {
            reservaInventario =
                await crearReservaInventario({
                    id_pedido: pedido.id_pedido,
                    id_sucursal: pedido.id_sucursal,
                    clave_idempotencia:
                        `RESERVA-${pedido.clave_idempotencia}`,
                    vence_at: venceReserva.toISOString(),
                    detalles: detallesReserva,
                });

        } catch (errorInventario) {
            console.error(
                "Error al reservar inventario:",
                errorInventario
            );

            await prisma.$transaction(async (tx) => {
                await tx.pedido.update({
                    where: {
                        id_pedido: pedido.id_pedido,
                    },
                    data: {
                        estado: "REVISION",
                    },
                });

                await tx.historialPedido.create({
                    data: {
                        estado_anterior: "BORRADOR",
                        estado_nuevo: "REVISION",
                        motivo:
                            errorInventario.data?.message ??
                            "No fue posible reservar el inventario",
                        evento_origen:
                            `INVENTARIO-RESERVA-FALLIDA-${randomUUID()}`,
                        id_pedido: pedido.id_pedido,
                    },
                });
            });

            return res
                .status(errorInventario.status || 503)
                .json({
                    message:
                        errorInventario.data?.message ??
                        "No fue posible reservar el inventario",
                    pedido: {
                        ...pedido,
                        estado: "REVISION",
                    },
                    inventario:
                        errorInventario.data ?? null,
                });
        }

        res.status(201).json({
            pedido,
            reserva_inventario: reservaInventario,
        });
    } catch (error) {
        console.error("Error al crear pedido:", error);

        res.status(500).json({
            message: "Error al crear el pedido",
        });
    }
};

// Cambiar estado de un pedido
export const cambiarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, motivo, id_actor } = req.body;

        if (!estado) {
            return res.status(400).json({
                message: "El estado es obligatorio",
            });
        }

        const pedido = await prisma.pedido.findUnique({
            where: {
                id_pedido: Number(id),
            },
        });

        if (!pedido) {
            return res.status(404).json({
                message: "Pedido no encontrado",
            });
        }

        if (pedido.estado === estado) {
            return res.status(400).json({
                message: "El pedido ya se encuentra en ese estado",
            });
        }

        const estadosPermitidos = [
            "BORRADOR",
            "PENDIENTE_RECETA",
            "PENDIENTE_CONFIRMACION",
            "CONFIRMADO",
            "PREPARANDO",
            "LISTO",
            "EN_ENTREGA",
            "COMPLETADO",
            "CANCELADO",
            "REVISION",
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                message: "Estado de pedido no válido",
            });
        }

        const transicionesPermitidas = {
            BORRADOR: [
                "PENDIENTE_RECETA",
                "PENDIENTE_CONFIRMACION",
                "CANCELADO",
                "REVISION",
            ],
            PENDIENTE_RECETA: [
                "PENDIENTE_CONFIRMACION",
                "CANCELADO",
                "REVISION",
            ],
            PENDIENTE_CONFIRMACION: [
                "CONFIRMADO",
                "CANCELADO",
                "REVISION",
            ],
            CONFIRMADO: [
                "PREPARANDO",
                "CANCELADO",
                "REVISION",
            ],
            PREPARANDO: [
                "LISTO",
                "CANCELADO",
                "REVISION",
            ],
            LISTO: [
                "EN_ENTREGA",
                "COMPLETADO",
                "CANCELADO",
                "REVISION",
            ],
            EN_ENTREGA: [
                "COMPLETADO",
                "CANCELADO",
                "REVISION",
            ],
            REVISION: [
                "PENDIENTE_RECETA",
                "PENDIENTE_CONFIRMACION",
                "CANCELADO",
            ],
            COMPLETADO: [],
            CANCELADO: [],
        };

        const siguientesEstados =
            transicionesPermitidas[pedido.estado] ?? [];

        if (!siguientesEstados.includes(estado)) {
            return res.status(400).json({
                message:
                    `No se permite cambiar el pedido de ${pedido.estado} a ${estado}`,
            });
        }

        let reservaInventario = null;

        if (
            estado === "CONFIRMADO" ||
            estado === "CANCELADO" ||
            estado === "COMPLETADO"
        ) {
            try {
                reservaInventario =
                    await obtenerReservaPorPedido(
                        pedido.id_pedido
                    );
            } catch (errorInventario) {
                return res
                    .status(errorInventario.status || 503)
                    .json({
                        message:
                            errorInventario.data?.message ??
                            "No fue posible obtener la reserva de inventario",
                    });
            }
        }

        if (estado === "CONFIRMADO") {
            try {
                await confirmarReservaInventario(
                    reservaInventario.id_reserva_inventario,
                    id_actor
                );
            } catch (errorInventario) {
                return res
                    .status(errorInventario.status || 503)
                    .json({
                        message:
                            errorInventario.data?.message ??
                            "No fue posible confirmar la reserva de inventario",
                    });
            }
        }

        if (estado === "CANCELADO") {
            try {
                await liberarReservaInventario(
                    reservaInventario.id_reserva_inventario,
                    id_actor,
                    motivo ?? "Pedido cancelado"
                );
            } catch (errorInventario) {
                return res
                    .status(errorInventario.status || 503)
                    .json({
                        message:
                            errorInventario.data?.message ??
                            "No fue posible liberar la reserva de inventario",
                    });
            }
        }

        if (estado === "COMPLETADO") {
            try {
                await consumirReservaInventario(
                    reservaInventario.id_reserva_inventario,
                    id_actor
                );
            } catch (errorInventario) {
                return res
                    .status(errorInventario.status || 503)
                    .json({
                        message:
                            errorInventario.data?.message ??
                            "No fue posible consumir la reserva de inventario",
                    });
            }
        }

        const pedidoActualizado = await prisma.$transaction(
            async (tx) => {
                const actualizado = await tx.pedido.update({
                    where: {
                        id_pedido: Number(id),
                    },
                    data: {
                        estado,
                        ...(estado === "CONFIRMADO"
                            ? { confirmado_at: new Date() }
                            : {}),
                        ...(estado === "CANCELADO"
                            ? {
                                cancelado_at: new Date(),
                                motivo_cancelacion:
                                    motivo ?? null,
                            }
                            : {}),
                    },
                });

                await tx.historialPedido.create({
                    data: {
                        estado_anterior: pedido.estado,
                        estado_nuevo: estado,
                        motivo: motivo ?? null,
                        id_actor:
                            id_actor !== undefined &&
                                id_actor !== null
                                ? Number(id_actor)
                                : null,
                        evento_origen: `PEDIDO-${pedido.id_pedido}-${Date.now()}`,
                        id_pedido: pedido.id_pedido,
                    },
                });

                return actualizado;
            }
        );

        res.status(200).json(pedidoActualizado);
    } catch (error) {
        console.error(
            "Error al cambiar estado del pedido:",
            error
        );

        res.status(500).json({
            message: "Error al cambiar el estado del pedido",
        });
    }
};
// Iniciar pago de un pedido
export const iniciarPagoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { metodo } = req.body;

        if (!metodo) {
            return res.status(400).json({
                message: "El método de pago es obligatorio",
            });
        }

        const pedido = await prisma.pedido.findUnique({
            where: {
                id_pedido: Number(id),
            },
        });

        if (!pedido) {
            return res.status(404).json({
                message: "Pedido no encontrado",
            });
        }

        if (
            pedido.estado === "CANCELADO" ||
            pedido.estado === "COMPLETADO"
        ) {
            return res.status(400).json({
                message:
                    "No se puede iniciar un pago para este pedido",
            });
        }

        const pagosExistentes = await obtenerPagosPorPedido(
            pedido.id_pedido
        );

        const pagoActivo = pagosExistentes.find(
            (pago) =>
                pago.estado === "PENDIENTE" ||
                pago.estado === "AUTORIZADO" ||
                pago.estado === "CONFIRMADO"
        );

        if (pagoActivo) {
            return res.status(200).json({
                message:
                    "El pedido ya tiene un pago activo",
                pago: pagoActivo,
            });
        }

        const pago = await crearPago({
            id_pedido: pedido.id_pedido,
            id_cliente: pedido.id_cliente,
            monto: pedido.total,
            metodo,
            clave_idempotencia:
                `PAGO-${pedido.clave_idempotencia}-${pagosExistentes.length + 1}`,
        });

        if (pedido.estado === "BORRADOR") {
            await prisma.$transaction(async (tx) => {
                await tx.pedido.update({
                    where: {
                        id_pedido: pedido.id_pedido,
                    },
                    data: {
                        estado: "PENDIENTE_CONFIRMACION",
                    },
                });

                await tx.historialPedido.create({
                    data: {
                        estado_anterior: "BORRADOR",
                        estado_nuevo: "PENDIENTE_CONFIRMACION",
                        motivo: "Pago iniciado",
                        evento_origen:
                            `PAGO-INICIADO-${pedido.id_pedido}-${Date.now()}`,
                        id_pedido: pedido.id_pedido,
                    },
                });
            });
        }

        res.status(201).json({
            pedido: {
                id_pedido: pedido.id_pedido,
                numero: pedido.numero,
                total: pedido.total,
                moneda: pedido.moneda,
            },
            pago,
        });
    } catch (error) {
        console.error(
            "Error al iniciar pago del pedido:",
            error
        );

        res.status(error.status || 500).json({
            message:
                error.data?.message ??
                "Error al iniciar el pago del pedido",
        });
    }
};

// Consultar pagos de un pedido
export const consultarPagosPedido = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await prisma.pedido.findUnique({
            where: {
                id_pedido: Number(id),
            },
        });

        if (!pedido) {
            return res.status(404).json({
                message: "Pedido no encontrado",
            });
        }

        const pagos = await obtenerPagosPorPedido(
            pedido.id_pedido
        );

        res.status(200).json({
            pedido: {
                id_pedido: pedido.id_pedido,
                numero: pedido.numero,
                total: pedido.total,
                moneda: pedido.moneda,
                estado: pedido.estado,
            },
            pagos,
        });
    } catch (error) {
        console.error(
            "Error al consultar pagos del pedido:",
            error
        );

        res.status(error.status || 500).json({
            message:
                error.data?.message ??
                "Error al consultar los pagos del pedido",
        });
    }
};