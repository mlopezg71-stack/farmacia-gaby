import prisma from "../config/prisma.js";


// ======================================================
// LISTAR CATEGORÍAS ASIGNADAS A UN PRODUCTO
// GET /producto-categorias/producto/:idProducto
// ======================================================

export const listarCategoriasProducto = async (req, res) => {
    try {
        const idProducto = Number(req.params.idProducto);

        if (!Number.isInteger(idProducto) || idProducto <= 0) {
            return res.status(400).json({
                message: "ID de producto inválido",
            });
        }

        const categorias = await prisma.productoCategoria.findMany({
            where: {
                id_producto: idProducto,
            },

            include: {
                ref_id_categoria: true,
            },

            orderBy: [
                {
                    principal: "desc",
                },
                {
                    id_producto_categoria: "asc",
                },
            ],
        });

        res.status(200).json(categorias);
    } catch (error) {
        console.error(
            "Error al listar categorías del producto:",
            error
        );

        res.status(500).json({
            message:
                "Error al obtener las categorías del producto",
        });
    }
};


// ======================================================
// ASIGNAR / REEMPLAZAR CATEGORÍAS DE UN PRODUCTO
// PUT /producto-categorias/producto/:idProducto
//
// BODY:
// {
//     "categorias": [
//         { "id_categoria": 1, "principal": true },
//         { "id_categoria": 2, "principal": false }
//     ]
// }
// ======================================================

export const guardarCategoriasProducto = async (req, res) => {
    try {
        const idProducto = Number(req.params.idProducto);
        const { categorias } = req.body;

        if (!Number.isInteger(idProducto) || idProducto <= 0) {
            return res.status(400).json({
                message: "ID de producto inválido",
            });
        }

        if (!Array.isArray(categorias)) {
            return res.status(400).json({
                message: "categorias debe ser un arreglo",
            });
        }

        const ids = categorias.map((categoria) =>
            Number(categoria.id_categoria)
        );

        if (
            ids.some(
                (id) =>
                    !Number.isInteger(id) ||
                    id <= 0
            )
        ) {
            return res.status(400).json({
                message:
                    "Todas las categorías deben tener un id_categoria válido",
            });
        }

        const idsUnicos = new Set(ids);

        if (idsUnicos.size !== ids.length) {
            return res.status(400).json({
                message:
                    "No se puede asignar la misma categoría más de una vez",
            });
        }

        const principales = categorias.filter(
            (categoria) => categoria.principal === true
        );

        if (
            categorias.length > 0 &&
            principales.length !== 1
        ) {
            return res.status(400).json({
                message:
                    "Debe existir exactamente una categoría principal",
            });
        }

        const producto = await prisma.producto.findUnique({
            where: {
                id_producto: idProducto,
            },

            select: {
                id_producto: true,
            },
        });

        if (!producto) {
            return res.status(404).json({
                message: "Producto no encontrado",
            });
        }

        if (ids.length > 0) {
            const categoriasExistentes =
                await prisma.categoria.findMany({
                    where: {
                        id_categoria: {
                            in: ids,
                        },
                    },

                    select: {
                        id_categoria: true,
                    },
                });

            if (categoriasExistentes.length !== ids.length) {
                return res.status(400).json({
                    message:
                        "Una o más categorías no existen",
                });
            }
        }

        await prisma.$transaction(async (tx) => {
            await tx.productoCategoria.deleteMany({
                where: {
                    id_producto: idProducto,
                },
            });

            if (categorias.length > 0) {
                await tx.productoCategoria.createMany({
                    data: categorias.map((categoria) => ({
                        id_producto: idProducto,
                        id_categoria: Number(
                            categoria.id_categoria
                        ),
                        principal:
                            categoria.principal === true,
                    })),
                });
            }
        });

        const categoriasActualizadas =
            await prisma.productoCategoria.findMany({
                where: {
                    id_producto: idProducto,
                },

                include: {
                    ref_id_categoria: true,
                },

                orderBy: [
                    {
                        principal: "desc",
                    },
                    {
                        id_producto_categoria: "asc",
                    },
                ],
            });

        res.status(200).json({
            message:
                "Categorías del producto actualizadas correctamente",

            categorias: categoriasActualizadas,
        });
    } catch (error) {
        console.error(
            "Error al guardar categorías del producto:",
            error
        );

        res.status(500).json({
            message:
                "Error al actualizar las categorías del producto",
        });
    }
};