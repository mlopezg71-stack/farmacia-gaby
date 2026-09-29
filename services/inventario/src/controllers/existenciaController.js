import prisma from "../config/prisma.js";

// Consultar existencia disponible de una presentación en una sucursal
export const consultarExistencia = async (req, res) => {
    try {
        const { id_presentacion, id_sucursal } = req.query;

        if (!id_presentacion || !id_sucursal) {
            return res.status(400).json({
                message:
                    "id_presentacion e id_sucursal son obligatorios",
            });
        }

        const existencias = await prisma.existencia.findMany({
            where: {
                id_presentacion: Number(id_presentacion),
                ref_id_ubicacion: {
                    id_sucursal: Number(id_sucursal),
                    activa: true,
                },
                ref_id_lote: {
                    estado: "DISPONIBLE",
                },
            },
            include: {
                ref_id_ubicacion: true,
                ref_id_lote: true,
            },
            orderBy: {
                ref_id_lote: {
                    fecha_vencimiento: "asc",
                },
            },
        });

        const resultado = existencias.map((existencia) => ({
            id_existencia: existencia.id_existencia,
            id_presentacion: existencia.id_presentacion,
            id_ubicacion: existencia.id_ubicacion,
            id_lote: existencia.id_lote,
            cantidad_fisica: existencia.cantidad_fisica,
            cantidad_reservada: existencia.cantidad_reservada,
            cantidad_disponible:
                existencia.cantidad_fisica -
                existencia.cantidad_reservada,
            version: existencia.version,
            lote: existencia.ref_id_lote,
            ubicacion: existencia.ref_id_ubicacion,
        }));

        const cantidadDisponible = resultado.reduce(
            (total, existencia) =>
                total + existencia.cantidad_disponible,
            0
        );

        res.status(200).json({
            id_presentacion: Number(id_presentacion),
            id_sucursal: Number(id_sucursal),
            cantidad_disponible: cantidadDisponible,
            existencias: resultado,
        });
    } catch (error) {
        console.error(
            "Error al consultar existencia:",
            error
        );

        res.status(500).json({
            message: "Error al consultar la existencia",
        });
    }
};

// ======================================================
// DISPONIBILIDAD GENERAL
// Uso: catálogo público / consulta rápida
// ======================================================
export const consultarDisponibilidadGeneral = async (req, res) => {
    try {
        const { ids_presentacion } = req.query;

        if (!ids_presentacion) {
            return res.status(400).json({
                message: "ids_presentacion es obligatorio",
            });
        }

        const idsPresentacion = [
            ...new Set(
                ids_presentacion
                    .split(",")
                    .map((id) => Number(id.trim()))
                    .filter((id) => Number.isInteger(id) && id > 0)
            ),
        ];

        if (idsPresentacion.length === 0) {
            return res.status(400).json({
                message:
                    "Debe proporcionar al menos un id_presentacion válido",
            });
        }

        const existencias = await prisma.existencia.findMany({
            where: {
                id_presentacion: {
                    in: idsPresentacion,
                },
                ref_id_ubicacion: {
                    activa: true,
                    ref_id_sucursal: {
                        estado: "ACTIVO",
                    },
                },
                ref_id_lote: {
                    estado: "DISPONIBLE",
                },
            },
            select: {
                id_presentacion: true,
                cantidad_fisica: true,
                cantidad_reservada: true,
            },
        });

        const disponibilidad = new Map(
            idsPresentacion.map((id) => [id, 0])
        );

        for (const existencia of existencias) {
            const cantidadDisponible = Math.max(
                existencia.cantidad_fisica -
                existencia.cantidad_reservada,
                0
            );

            disponibilidad.set(
                existencia.id_presentacion,
                disponibilidad.get(
                    existencia.id_presentacion
                ) + cantidadDisponible
            );
        }

        const resultado = idsPresentacion.map(
            (id_presentacion) => ({
                id_presentacion,
                cantidad_disponible:
                    disponibilidad.get(id_presentacion),
                disponible:
                    disponibilidad.get(id_presentacion) > 0,
            })
        );

        res.status(200).json(resultado);
    } catch (error) {
        console.error(
            "Error al consultar disponibilidad general:",
            error
        );

        res.status(500).json({
            message:
                "Error al consultar la disponibilidad general",
        });
    }
};


// ======================================================
// RESUMEN DE INVENTARIO
// Uso: administración
// ======================================================
export const listarResumenInventario = async (req, res) => {
    try {
        const existencias = await prisma.existencia.findMany({
            include: {
                ref_id_ubicacion: {
                    include: {
                        ref_id_sucursal: true,
                    },
                },
                ref_id_lote: true,
            },
            orderBy: [
                {
                    id_presentacion: "asc",
                },
                {
                    id_ubicacion: "asc",
                },
            ],
        });

        const resultado = existencias.map((existencia) => ({
            id_existencia: existencia.id_existencia,

            id_presentacion:
                existencia.id_presentacion,

            cantidad_fisica:
                existencia.cantidad_fisica,

            cantidad_reservada:
                existencia.cantidad_reservada,

            cantidad_disponible: Math.max(
                existencia.cantidad_fisica -
                existencia.cantidad_reservada,
                0
            ),

            minimo: existencia.minimo,
            maximo: existencia.maximo,

            lote: {
                id_lote:
                    existencia.ref_id_lote.id_lote,
                numero:
                    existencia.ref_id_lote.numero,
                fabricante_referencia:
                    existencia.ref_id_lote
                        .fabricante_referencia,
                fecha_fabricacion:
                    existencia.ref_id_lote
                        .fecha_fabricacion,
                fecha_vencimiento:
                    existencia.ref_id_lote
                        .fecha_vencimiento,
                estado:
                    existencia.ref_id_lote.estado,
            },

            ubicacion: {
                id_ubicacion:
                    existencia.ref_id_ubicacion
                        .id_ubicacion_inventario,
                codigo:
                    existencia.ref_id_ubicacion.codigo,
                nombre:
                    existencia.ref_id_ubicacion.nombre,
                tipo:
                    existencia.ref_id_ubicacion.tipo,
                activa:
                    existencia.ref_id_ubicacion.activa,
            },

            sucursal: {
                id_sucursal:
                    existencia.ref_id_ubicacion
                        .ref_id_sucursal.id_sucursal,
                codigo:
                    existencia.ref_id_ubicacion
                        .ref_id_sucursal.codigo,
                nombre:
                    existencia.ref_id_ubicacion
                        .ref_id_sucursal.nombre,
            },
        }));

        res.status(200).json(resultado);
    } catch (error) {
        console.error(
            "Error al listar resumen de inventario:",
            error
        );

        res.status(500).json({
            message:
                "Error al obtener el resumen de inventario",
        });
    }
};