import prisma from "../config/prisma.js";


// ======================================================
// INCLUDE COMPLETO DEL PRODUCTO
// ======================================================

const includeProductoCompleto = {
    ref_id_marca: true,

    ref_id_laboratorio: true,

    rel_presentacion_producto_id_producto: {
        include: {
            rel_precio_presentacion_id_presentacion: {
                include: {
                    ref_id_lista: true,
                },
            },
        },
        orderBy: {
            nombre: "asc",
        },
    },

    rel_producto_categoria_id_producto: {
        include: {
            ref_id_categoria: true,
        },
    },

    rel_producto_imagen_id_producto: {
        orderBy: {
            orden: "asc",
        },
    },
};


// ======================================================
// PÚBLICO
// ======================================================

export const listarProductosPublicos = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany({
            where: {
                estado: "PUBLICADO",
                visible_web: true,
            },

            include: {
                ref_id_marca: true,

                ref_id_laboratorio: true,

                rel_presentacion_producto_id_producto: {
                    where: {
                        estado: "ACTIVO",
                        permite_venta: true,
                    },

                    include: {
                        rel_precio_presentacion_id_presentacion: {
                            include: {
                                ref_id_lista: true,
                            },
                        },
                    },

                    orderBy: {
                        nombre: "asc",
                    },
                },

                rel_producto_categoria_id_producto: {
                    include: {
                        ref_id_categoria: true,
                    },
                },

                rel_producto_imagen_id_producto: {
                    orderBy: {
                        orden: "asc",
                    },
                },
            },

            orderBy: {
                nombre: "asc",
            },
        });

        res.status(200).json(productos);
    } catch (error) {
        console.error(
            "Error al listar productos públicos:",
            error
        );

        res.status(500).json({
            message: "Error al obtener los productos",
        });
    }
};


// ======================================================
// ADMIN - LISTAR TODOS
// ======================================================

export const listarProductosAdmin = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany({
            include: includeProductoCompleto,

            orderBy: {
                nombre: "asc",
            },
        });

        res.status(200).json(productos);
    } catch (error) {
        console.error(
            "Error al listar productos administrativos:",
            error
        );

        res.status(500).json({
            message: "Error al obtener los productos",
        });
    }
};


// ======================================================
// ADMIN - OBTENER PRODUCTO
// ======================================================

export const obtenerProductoAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de producto inválido",
            });
        }

        const producto = await prisma.producto.findUnique({
            where: {
                id_producto: id,
            },

            include: includeProductoCompleto,
        });

        if (!producto) {
            return res.status(404).json({
                message: "Producto no encontrado",
            });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error(
            "Error al obtener producto:",
            error
        );

        res.status(500).json({
            message: "Error al obtener el producto",
        });
    }
};


// ======================================================
// ADMIN - CREAR PRODUCTO
// ======================================================

export const crearProducto = async (req, res) => {
    try {
        const {
            nombre,
            slug,
            descripcion_corta,
            descripcion_larga,
            tipo,
            requiere_receta,
            registro_sanitario,
            conservacion,
            advertencias,
            estado,
            visible_web,
            destacado,
            unidad_base,
            id_marca,
            id_laboratorio,
        } = req.body;

        if (
            !nombre ||
            !slug ||
            !tipo ||
            !unidad_base
        ) {
            return res.status(400).json({
                message:
                    "Nombre, slug, tipo y unidad base son obligatorios",
            });
        }

        const productoExistente =
            await prisma.producto.findUnique({
                where: {
                    slug,
                },
            });

        if (productoExistente) {
            return res.status(409).json({
                message:
                    "Ya existe un producto con ese slug",
            });
        }

        if (id_marca !== undefined && id_marca !== null) {
            const marca = await prisma.marca.findUnique({
                where: {
                    id_marca: Number(id_marca),
                },
            });

            if (!marca) {
                return res.status(400).json({
                    message:
                        "La marca seleccionada no existe",
                });
            }
        }

        if (
            id_laboratorio !== undefined &&
            id_laboratorio !== null
        ) {
            const laboratorio =
                await prisma.laboratorio.findUnique({
                    where: {
                        id_laboratorio:
                            Number(id_laboratorio),
                    },
                });

            if (!laboratorio) {
                return res.status(400).json({
                    message:
                        "El laboratorio seleccionado no existe",
                });
            }
        }

        const producto = await prisma.producto.create({
            data: {
                nombre,
                slug,

                descripcion_corta:
                    descripcion_corta || null,

                descripcion_larga:
                    descripcion_larga || null,

                tipo,

                requiere_receta:
                    requiere_receta ?? false,

                registro_sanitario:
                    registro_sanitario || null,

                conservacion:
                    conservacion || null,

                advertencias:
                    advertencias || null,

                estado:
                    estado || "BORRADOR",

                visible_web:
                    visible_web ?? false,

                destacado:
                    destacado ?? false,

                unidad_base,

                id_marca:
                    id_marca !== undefined &&
                        id_marca !== null
                        ? Number(id_marca)
                        : null,

                id_laboratorio:
                    id_laboratorio !== undefined &&
                        id_laboratorio !== null
                        ? Number(id_laboratorio)
                        : null,
            },

            include: includeProductoCompleto,
        });

        res.status(201).json({
            message: "Producto creado correctamente",
            producto,
        });
    } catch (error) {
        console.error(
            "Error al crear producto:",
            error
        );

        res.status(500).json({
            message: "Error al crear el producto",
        });
    }
};


// ======================================================
// ADMIN - MODIFICAR PRODUCTO
// ======================================================

export const modificarProducto = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de producto inválido",
            });
        }

        const productoActual =
            await prisma.producto.findUnique({
                where: {
                    id_producto: id,
                },
            });

        if (!productoActual) {
            return res.status(404).json({
                message: "Producto no encontrado",
            });
        }

        const {
            nombre,
            slug,
            descripcion_corta,
            descripcion_larga,
            tipo,
            requiere_receta,
            registro_sanitario,
            conservacion,
            advertencias,
            estado,
            visible_web,
            destacado,
            unidad_base,
            id_marca,
            id_laboratorio,
        } = req.body;

        if (slug && slug !== productoActual.slug) {
            const productoConSlug =
                await prisma.producto.findUnique({
                    where: {
                        slug,
                    },
                });

            if (
                productoConSlug &&
                productoConSlug.id_producto !== id
            ) {
                return res.status(409).json({
                    message:
                        "Ya existe otro producto con ese slug",
                });
            }
        }

        if (id_marca !== undefined && id_marca !== null) {
            const marca = await prisma.marca.findUnique({
                where: {
                    id_marca: Number(id_marca),
                },
            });

            if (!marca) {
                return res.status(400).json({
                    message:
                        "La marca seleccionada no existe",
                });
            }
        }

        if (
            id_laboratorio !== undefined &&
            id_laboratorio !== null
        ) {
            const laboratorio =
                await prisma.laboratorio.findUnique({
                    where: {
                        id_laboratorio:
                            Number(id_laboratorio),
                    },
                });

            if (!laboratorio) {
                return res.status(400).json({
                    message:
                        "El laboratorio seleccionado no existe",
                });
            }
        }

        const data = {};

        if (nombre !== undefined) {
            data.nombre = nombre;
        }

        if (slug !== undefined) {
            data.slug = slug;
        }

        if (descripcion_corta !== undefined) {
            data.descripcion_corta =
                descripcion_corta || null;
        }

        if (descripcion_larga !== undefined) {
            data.descripcion_larga =
                descripcion_larga || null;
        }

        if (tipo !== undefined) {
            data.tipo = tipo;
        }

        if (requiere_receta !== undefined) {
            data.requiere_receta = requiere_receta;
        }

        if (registro_sanitario !== undefined) {
            data.registro_sanitario =
                registro_sanitario || null;
        }

        if (conservacion !== undefined) {
            data.conservacion =
                conservacion || null;
        }

        if (advertencias !== undefined) {
            data.advertencias =
                advertencias || null;
        }

        if (estado !== undefined) {
            data.estado = estado;
        }

        if (visible_web !== undefined) {
            data.visible_web = visible_web;
        }

        if (destacado !== undefined) {
            data.destacado = destacado;
        }

        if (unidad_base !== undefined) {
            data.unidad_base = unidad_base;
        }

        if (id_marca !== undefined) {
            data.id_marca =
                id_marca === null
                    ? null
                    : Number(id_marca);
        }

        if (id_laboratorio !== undefined) {
            data.id_laboratorio =
                id_laboratorio === null
                    ? null
                    : Number(id_laboratorio);
        }

        const producto = await prisma.producto.update({
            where: {
                id_producto: id,
            },

            data,

            include: includeProductoCompleto,
        });

        res.status(200).json({
            message: "Producto modificado correctamente",
            producto,
        });
    } catch (error) {
        console.error(
            "Error al modificar producto:",
            error
        );

        res.status(500).json({
            message: "Error al modificar el producto",
        });
    }
};


// ======================================================
// ADMIN - CAMBIAR ESTADO
// ======================================================

export const cambiarEstadoProducto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { estado } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de producto inválido",
            });
        }

        const estadosPermitidos = [
            "BORRADOR",
            "PUBLICADO",
            "ARCHIVADO",
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                message:
                    "El estado debe ser BORRADOR, PUBLICADO o ARCHIVADO",
            });
        }

        const productoActual =
            await prisma.producto.findUnique({
                where: {
                    id_producto: id,
                },
            });

        if (!productoActual) {
            return res.status(404).json({
                message: "Producto no encontrado",
            });
        }

        const producto = await prisma.producto.update({
            where: {
                id_producto: id,
            },

            data: {
                estado,
            },

            include: includeProductoCompleto,
        });

        res.status(200).json({
            message:
                "Estado del producto actualizado correctamente",
            producto,
        });
    } catch (error) {
        console.error(
            "Error al cambiar estado del producto:",
            error
        );

        res.status(500).json({
            message:
                "Error al cambiar el estado del producto",
        });
    }
};