import prisma from "../config/prisma.js";


// ======================================================
// LISTAR PRESENTACIONES DE UN PRODUCTO
// GET /presentaciones/producto/:idProducto
// ======================================================

export const listarPresentacionesProducto = async (req, res) => {
    try {
        const idProducto = Number(req.params.idProducto);

        if (!Number.isInteger(idProducto) || idProducto <= 0) {
            return res.status(400).json({
                message: "ID de producto inválido",
            });
        }

        const presentaciones =
            await prisma.presentacionProducto.findMany({
                where: {
                    id_producto: idProducto,
                },

                include: {
                    rel_precio_presentacion_id_presentacion: {
                        include: {
                            ref_id_lista: true,
                        },

                        orderBy: {
                            desde: "desc",
                        },
                    },

                    rel_producto_imagen_id_presentacion: {
                        orderBy: {
                            orden: "asc",
                        },
                    },
                },

                orderBy: {
                    nombre: "asc",
                },
            });

        res.status(200).json(presentaciones);
    } catch (error) {
        console.error(
            "Error al listar presentaciones:",
            error
        );

        res.status(500).json({
            message:
                "Error al obtener las presentaciones",
        });
    }
};


// ======================================================
// VISUALIZAR PRESENTACIÓN
// GET /presentaciones/:id
// ======================================================

export const obtenerPresentacion = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de presentación inválido",
            });
        }

        const presentacion =
            await prisma.presentacionProducto.findUnique({
                where: {
                    id_presentacion_producto: id,
                },

                include: {
                    ref_id_producto: true,

                    rel_precio_presentacion_id_presentacion: {
                        include: {
                            ref_id_lista: true,
                        },

                        orderBy: {
                            desde: "desc",
                        },
                    },

                    rel_producto_imagen_id_presentacion: {
                        orderBy: {
                            orden: "asc",
                        },
                    },
                },
            });

        if (!presentacion) {
            return res.status(404).json({
                message: "Presentación no encontrada",
            });
        }

        res.status(200).json(presentacion);
    } catch (error) {
        console.error(
            "Error al obtener presentación:",
            error
        );

        res.status(500).json({
            message: "Error al obtener la presentación",
        });
    }
};


// ======================================================
// CREAR PRESENTACIÓN
// POST /presentaciones
// ======================================================

export const crearPresentacion = async (req, res) => {
    try {
        const {
            sku,
            codigo_barras,
            nombre,
            tipo,
            unidades_base,
            contenido,
            unidad_contenido,
            forma_farmaceutica,
            concentracion_descriptiva,
            permite_venta,
            permite_fraccionamiento,
            peso_gramos,
            estado,
            id_producto,
        } = req.body;

        if (
            !nombre ||
            !tipo ||
            id_producto === undefined ||
            unidades_base === undefined
        ) {
            return res.status(400).json({
                message:
                    "nombre, tipo, unidades_base e id_producto son obligatorios",
            });
        }

        const idProducto = Number(id_producto);
        const unidadesBase = Number(unidades_base);

        if (
            !Number.isInteger(idProducto) ||
            idProducto <= 0
        ) {
            return res.status(400).json({
                message: "id_producto inválido",
            });
        }

        if (
            !Number.isInteger(unidadesBase) ||
            unidadesBase <= 0
        ) {
            return res.status(400).json({
                message:
                    "unidades_base debe ser un entero mayor que cero",
            });
        }

        const presentacion =
            await prisma.presentacionProducto.create({
                data: {
                    sku: sku?.trim() || null,

                    codigo_barras:
                        codigo_barras?.trim() || null,

                    nombre: nombre.trim(),

                    tipo,

                    unidades_base: unidadesBase,

                    contenido:
                        contenido !== undefined &&
                            contenido !== null &&
                            contenido !== ""
                            ? contenido
                            : null,

                    unidad_contenido:
                        unidad_contenido?.trim() || null,

                    forma_farmaceutica:
                        forma_farmaceutica?.trim() || null,

                    concentracion_descriptiva:
                        concentracion_descriptiva?.trim() ||
                        null,

                    permite_venta:
                        permite_venta !== undefined
                            ? permite_venta === true
                            : true,

                    permite_fraccionamiento:
                        permite_fraccionamiento === true,

                    peso_gramos:
                        peso_gramos !== undefined &&
                            peso_gramos !== null &&
                            peso_gramos !== ""
                            ? peso_gramos
                            : null,

                    estado: estado || "ACTIVO",

                    id_producto: idProducto,
                },
            });

        res.status(201).json({
            message:
                "Presentación creada correctamente",
            presentacion,
        });
    } catch (error) {
        console.error(
            "Error al crear presentación:",
            error
        );

        res.status(500).json({
            message: "Error al crear la presentación",
        });
    }
};


// ======================================================
// MODIFICAR PRESENTACIÓN
// PUT /presentaciones/:id
// ======================================================

export const modificarPresentacion = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de presentación inválido",
            });
        }

        const {
            sku,
            codigo_barras,
            nombre,
            tipo,
            unidades_base,
            contenido,
            unidad_contenido,
            forma_farmaceutica,
            concentracion_descriptiva,
            permite_venta,
            permite_fraccionamiento,
            peso_gramos,
            estado,
        } = req.body;

        if (
            unidades_base !== undefined &&
            (!Number.isInteger(Number(unidades_base)) ||
                Number(unidades_base) <= 0)
        ) {
            return res.status(400).json({
                message:
                    "unidades_base debe ser un entero mayor que cero",
            });
        }

        const presentacion =
            await prisma.presentacionProducto.update({
                where: {
                    id_presentacion_producto: id,
                },

                data: {
                    ...(sku !== undefined && {
                        sku: sku?.trim() || null,
                    }),

                    ...(codigo_barras !== undefined && {
                        codigo_barras:
                            codigo_barras?.trim() || null,
                    }),

                    ...(nombre !== undefined && {
                        nombre: nombre.trim(),
                    }),

                    ...(tipo !== undefined && {
                        tipo,
                    }),

                    ...(unidades_base !== undefined && {
                        unidades_base:
                            Number(unidades_base),
                    }),

                    ...(contenido !== undefined && {
                        contenido:
                            contenido !== null &&
                                contenido !== ""
                                ? contenido
                                : null,
                    }),

                    ...(unidad_contenido !== undefined && {
                        unidad_contenido:
                            unidad_contenido?.trim() ||
                            null,
                    }),

                    ...(forma_farmaceutica !== undefined && {
                        forma_farmaceutica:
                            forma_farmaceutica?.trim() ||
                            null,
                    }),

                    ...(concentracion_descriptiva !==
                        undefined && {
                        concentracion_descriptiva:
                            concentracion_descriptiva?.trim() ||
                            null,
                    }),

                    ...(permite_venta !== undefined && {
                        permite_venta:
                            permite_venta === true,
                    }),

                    ...(permite_fraccionamiento !==
                        undefined && {
                        permite_fraccionamiento:
                            permite_fraccionamiento === true,
                    }),

                    ...(peso_gramos !== undefined && {
                        peso_gramos:
                            peso_gramos !== null &&
                                peso_gramos !== ""
                                ? peso_gramos
                                : null,
                    }),

                    ...(estado !== undefined && {
                        estado,
                    }),
                },
            });

        res.status(200).json({
            message:
                "Presentación modificada correctamente",
            presentacion,
        });
    } catch (error) {
        console.error(
            "Error al modificar presentación:",
            error
        );

        res.status(500).json({
            message:
                "Error al modificar la presentación",
        });
    }
};


// ======================================================
// CAMBIAR ESTADO
// PATCH /presentaciones/:id/estado
// ======================================================

export const cambiarEstadoPresentacion = async (
    req,
    res
) => {
    try {
        const id = Number(req.params.id);
        const { estado, permite_venta } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de presentación inválido",
            });
        }

        if (
            estado === undefined &&
            permite_venta === undefined
        ) {
            return res.status(400).json({
                message:
                    "Debe enviar estado o permite_venta",
            });
        }

        const presentacion =
            await prisma.presentacionProducto.update({
                where: {
                    id_presentacion_producto: id,
                },

                data: {
                    ...(estado !== undefined && {
                        estado,
                    }),

                    ...(permite_venta !== undefined && {
                        permite_venta:
                            permite_venta === true,
                    }),
                },
            });

        res.status(200).json({
            message:
                "Estado de presentación actualizado correctamente",
            presentacion,
        });
    } catch (error) {
        console.error(
            "Error al cambiar estado de presentación:",
            error
        );

        res.status(500).json({
            message:
                "Error al cambiar el estado de la presentación",
        });
    }
};