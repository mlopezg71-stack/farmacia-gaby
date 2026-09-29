import prisma from "../config/prisma.js";


// ======================================================
// LISTAR PRECIOS DE UNA PRESENTACIÓN
// GET /precios/presentacion/:idPresentacion
// ======================================================

export const listarPreciosPresentacion = async (req, res) => {
    try {
        const idPresentacion = Number(
            req.params.idPresentacion
        );

        if (
            !Number.isInteger(idPresentacion) ||
            idPresentacion <= 0
        ) {
            return res.status(400).json({
                message: "ID de presentación inválido",
            });
        }

        const precios =
            await prisma.precioPresentacion.findMany({
                where: {
                    id_presentacion: idPresentacion,
                },

                include: {
                    ref_id_lista: true,
                },

                orderBy: {
                    desde: "desc",
                },
            });

        res.status(200).json(precios);
    } catch (error) {
        console.error(
            "Error al listar precios:",
            error
        );

        res.status(500).json({
            message:
                "Error al obtener los precios de la presentación",
        });
    }
};


// ======================================================
// VISUALIZAR PRECIO
// GET /precios/:id
// ======================================================

export const obtenerPrecio = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de precio inválido",
            });
        }

        const precio =
            await prisma.precioPresentacion.findUnique({
                where: {
                    id_precio_presentacion: id,
                },

                include: {
                    ref_id_lista: true,
                    ref_id_presentacion: {
                        include: {
                            ref_id_producto: true,
                        },
                    },
                },
            });

        if (!precio) {
            return res.status(404).json({
                message: "Precio no encontrado",
            });
        }

        res.status(200).json(precio);
    } catch (error) {
        console.error(
            "Error al obtener precio:",
            error
        );

        res.status(500).json({
            message: "Error al obtener el precio",
        });
    }
};


// ======================================================
// CREAR PRECIO
// POST /precios
// ======================================================

export const crearPrecio = async (req, res) => {
    try {
        const {
            importe,
            incluye_impuesto,
            tasa_impuesto,
            id_sucursal,
            canal,
            desde,
            hasta,
            id_lista,
            id_presentacion,
        } = req.body;

        if (
            importe === undefined ||
            importe === null ||
            importe === "" ||
            tasa_impuesto === undefined ||
            tasa_impuesto === null ||
            tasa_impuesto === "" ||
            !desde ||
            id_lista === undefined ||
            id_presentacion === undefined
        ) {
            return res.status(400).json({
                message:
                    "importe, tasa_impuesto, desde, id_lista e id_presentacion son obligatorios",
            });
        }

        const idLista = Number(id_lista);
        const idPresentacion = Number(id_presentacion);

        if (
            !Number.isInteger(idLista) ||
            idLista <= 0
        ) {
            return res.status(400).json({
                message:
                    "id_lista inválido",
            });
        }

        if (
            !Number.isInteger(idPresentacion) ||
            idPresentacion <= 0
        ) {
            return res.status(400).json({
                message:
                    "id_presentacion inválido",
            });
        }

        const importeNumero = Number(importe);
        const tasaNumero = Number(tasa_impuesto);

        if (
            !Number.isFinite(importeNumero) ||
            importeNumero < 0
        ) {
            return res.status(400).json({
                message:
                    "importe debe ser un número válido mayor o igual a cero",
            });
        }

        if (
            !Number.isFinite(tasaNumero) ||
            tasaNumero < 0
        ) {
            return res.status(400).json({
                message:
                    "tasa_impuesto debe ser un número válido mayor o igual a cero",
            });
        }

        const fechaDesde = new Date(desde);

        if (Number.isNaN(fechaDesde.getTime())) {
            return res.status(400).json({
                message: "Fecha desde inválida",
            });
        }

        let fechaHasta = null;

        if (hasta) {
            fechaHasta = new Date(hasta);

            if (Number.isNaN(fechaHasta.getTime())) {
                return res.status(400).json({
                    message: "Fecha hasta inválida",
                });
            }

            if (fechaHasta < fechaDesde) {
                return res.status(400).json({
                    message:
                        "La fecha hasta no puede ser anterior a la fecha desde",
                });
            }
        }

        const lista =
            await prisma.listaPrecio.findUnique({
                where: {
                    id_lista_precio: idLista,
                },
            });

        if (!lista) {
            return res.status(404).json({
                message:
                    "Lista de precios no encontrada",
            });
        }

        const presentacion =
            await prisma.presentacionProducto.findUnique({
                where: {
                    id_presentacion_producto:
                        idPresentacion,
                },
            });

        if (!presentacion) {
            return res.status(404).json({
                message:
                    "Presentación no encontrada",
            });
        }

        const precio =
            await prisma.precioPresentacion.create({
                data: {
                    importe: importe.toString(),

                    incluye_impuesto:
                        incluye_impuesto !== undefined
                            ? incluye_impuesto === true
                            : true,

                    tasa_impuesto:
                        tasa_impuesto.toString(),

                    id_sucursal:
                        id_sucursal !== undefined &&
                            id_sucursal !== null &&
                            id_sucursal !== ""
                            ? Number(id_sucursal)
                            : null,

                    canal:
                        canal?.trim() || "TODOS",

                    desde: fechaDesde,

                    hasta: fechaHasta,

                    id_lista: idLista,

                    id_presentacion:
                        idPresentacion,
                },

                include: {
                    ref_id_lista: true,
                },
            });

        res.status(201).json({
            message:
                "Precio creado correctamente",
            precio,
        });
    } catch (error) {
        console.error(
            "Error al crear precio:",
            error
        );

        res.status(500).json({
            message: "Error al crear el precio",
        });
    }
};


// ======================================================
// MODIFICAR PRECIO
// PUT /precios/:id
// ======================================================

export const modificarPrecio = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de precio inválido",
            });
        }

        const {
            importe,
            incluye_impuesto,
            tasa_impuesto,
            id_sucursal,
            canal,
            desde,
            hasta,
            id_lista,
        } = req.body;

        const precioActual =
            await prisma.precioPresentacion.findUnique({
                where: {
                    id_precio_presentacion: id,
                },
            });

        if (!precioActual) {
            return res.status(404).json({
                message: "Precio no encontrado",
            });
        }

        if (
            importe !== undefined &&
            (
                importe === null ||
                importe === "" ||
                !Number.isFinite(Number(importe)) ||
                Number(importe) < 0
            )
        ) {
            return res.status(400).json({
                message:
                    "importe debe ser un número válido mayor o igual a cero",
            });
        }

        if (
            tasa_impuesto !== undefined &&
            (
                tasa_impuesto === null ||
                tasa_impuesto === "" ||
                !Number.isFinite(
                    Number(tasa_impuesto)
                ) ||
                Number(tasa_impuesto) < 0
            )
        ) {
            return res.status(400).json({
                message:
                    "tasa_impuesto debe ser un número válido mayor o igual a cero",
            });
        }

        if (id_lista !== undefined) {
            const idLista = Number(id_lista);

            if (
                !Number.isInteger(idLista) ||
                idLista <= 0
            ) {
                return res.status(400).json({
                    message:
                        "id_lista inválido",
                });
            }

            const lista =
                await prisma.listaPrecio.findUnique({
                    where: {
                        id_lista_precio: idLista,
                    },
                });

            if (!lista) {
                return res.status(404).json({
                    message:
                        "Lista de precios no encontrada",
                });
            }
        }

        let fechaDesde =
            precioActual.desde;

        if (desde !== undefined) {
            fechaDesde = new Date(desde);

            if (Number.isNaN(fechaDesde.getTime())) {
                return res.status(400).json({
                    message: "Fecha desde inválida",
                });
            }
        }

        let fechaHasta =
            precioActual.hasta;

        if (hasta !== undefined) {
            if (
                hasta === null ||
                hasta === ""
            ) {
                fechaHasta = null;
            } else {
                fechaHasta = new Date(hasta);

                if (
                    Number.isNaN(
                        fechaHasta.getTime()
                    )
                ) {
                    return res.status(400).json({
                        message:
                            "Fecha hasta inválida",
                    });
                }
            }
        }

        if (
            fechaHasta &&
            fechaHasta < fechaDesde
        ) {
            return res.status(400).json({
                message:
                    "La fecha hasta no puede ser anterior a la fecha desde",
            });
        }

        const precio =
            await prisma.precioPresentacion.update({
                where: {
                    id_precio_presentacion: id,
                },

                data: {
                    ...(importe !== undefined && {
                        importe:
                            importe.toString(),
                    }),

                    ...(incluye_impuesto !==
                        undefined && {
                        incluye_impuesto:
                            incluye_impuesto === true,
                    }),

                    ...(tasa_impuesto !==
                        undefined && {
                        tasa_impuesto:
                            tasa_impuesto.toString(),
                    }),

                    ...(id_sucursal !== undefined && {
                        id_sucursal:
                            id_sucursal !== null &&
                                id_sucursal !== ""
                                ? Number(id_sucursal)
                                : null,
                    }),

                    ...(canal !== undefined && {
                        canal:
                            canal?.trim() || "TODOS",
                    }),

                    ...(desde !== undefined && {
                        desde: fechaDesde,
                    }),

                    ...(hasta !== undefined && {
                        hasta: fechaHasta,
                    }),

                    ...(id_lista !== undefined && {
                        id_lista:
                            Number(id_lista),
                    }),
                },

                include: {
                    ref_id_lista: true,
                },
            });

        res.status(200).json({
            message:
                "Precio modificado correctamente",
            precio,
        });
    } catch (error) {
        console.error(
            "Error al modificar precio:",
            error
        );

        res.status(500).json({
            message:
                "Error al modificar el precio",
        });
    }
};