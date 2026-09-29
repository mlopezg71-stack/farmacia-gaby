import prisma from "../config/prisma.js";


// ======================================================
// MARCAS
// ======================================================

export const listarMarcas = async (req, res) => {
    try {
        const marcas = await prisma.marca.findMany({
            orderBy: {
                nombre: "asc",
            },
        });

        res.status(200).json(marcas);
    } catch (error) {
        console.error("Error al listar marcas:", error);

        res.status(500).json({
            message: "Error al obtener las marcas",
        });
    }
};


export const crearMarca = async (req, res) => {
    try {
        const {
            nombre,
            slug,
            descripcion,
            imagen_clave,
            estado,
        } = req.body;

        if (!nombre || !slug) {
            return res.status(400).json({
                message: "nombre y slug son obligatorios",
            });
        }

        const marca = await prisma.marca.create({
            data: {
                nombre: nombre.trim(),
                slug: slug.trim(),
                descripcion: descripcion?.trim() || null,
                imagen_clave: imagen_clave?.trim() || null,
                estado: estado || "ACTIVO",
            },
        });

        res.status(201).json({
            message: "Marca creada correctamente",
            marca,
        });
    } catch (error) {
        console.error("Error al crear marca:", error);

        res.status(500).json({
            message: "Error al crear la marca",
        });
    }
};


export const modificarMarca = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de marca inválido",
            });
        }

        const {
            nombre,
            slug,
            descripcion,
            imagen_clave,
            estado,
        } = req.body;

        const marca = await prisma.marca.update({
            where: {
                id_marca: id,
            },
            data: {
                ...(nombre !== undefined && {
                    nombre: nombre.trim(),
                }),
                ...(slug !== undefined && {
                    slug: slug.trim(),
                }),
                ...(descripcion !== undefined && {
                    descripcion: descripcion?.trim() || null,
                }),
                ...(imagen_clave !== undefined && {
                    imagen_clave:
                        imagen_clave?.trim() || null,
                }),
                ...(estado !== undefined && {
                    estado,
                }),
            },
        });

        res.status(200).json({
            message: "Marca modificada correctamente",
            marca,
        });
    } catch (error) {
        console.error("Error al modificar marca:", error);

        res.status(500).json({
            message: "Error al modificar la marca",
        });
    }
};


// ======================================================
// LABORATORIOS
// ======================================================

export const listarLaboratorios = async (req, res) => {
    try {
        const laboratorios =
            await prisma.laboratorio.findMany({
                orderBy: {
                    nombre: "asc",
                },
            });

        res.status(200).json(laboratorios);
    } catch (error) {
        console.error(
            "Error al listar laboratorios:",
            error
        );

        res.status(500).json({
            message: "Error al obtener los laboratorios",
        });
    }
};


export const crearLaboratorio = async (req, res) => {
    try {
        const {
            nombre,
            slug,
            descripcion,
            estado,
        } = req.body;

        if (!nombre || !slug) {
            return res.status(400).json({
                message: "nombre y slug son obligatorios",
            });
        }

        const laboratorio =
            await prisma.laboratorio.create({
                data: {
                    nombre: nombre.trim(),
                    slug: slug.trim(),
                    descripcion:
                        descripcion?.trim() || null,
                    estado: estado || "ACTIVO",
                },
            });

        res.status(201).json({
            message: "Laboratorio creado correctamente",
            laboratorio,
        });
    } catch (error) {
        console.error(
            "Error al crear laboratorio:",
            error
        );

        res.status(500).json({
            message: "Error al crear el laboratorio",
        });
    }
};


export const modificarLaboratorio = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de laboratorio inválido",
            });
        }

        const {
            nombre,
            slug,
            descripcion,
            estado,
        } = req.body;

        const laboratorio =
            await prisma.laboratorio.update({
                where: {
                    id_laboratorio: id,
                },
                data: {
                    ...(nombre !== undefined && {
                        nombre: nombre.trim(),
                    }),
                    ...(slug !== undefined && {
                        slug: slug.trim(),
                    }),
                    ...(descripcion !== undefined && {
                        descripcion:
                            descripcion?.trim() || null,
                    }),
                    ...(estado !== undefined && {
                        estado,
                    }),
                },
            });

        res.status(200).json({
            message:
                "Laboratorio modificado correctamente",
            laboratorio,
        });
    } catch (error) {
        console.error(
            "Error al modificar laboratorio:",
            error
        );

        res.status(500).json({
            message: "Error al modificar el laboratorio",
        });
    }
};


// ======================================================
// CATEGORÍAS
// ======================================================

export const listarCategorias = async (req, res) => {
    try {
        const categorias =
            await prisma.categoria.findMany({
                include: {
                    ref_id_padre: true,
                },
                orderBy: [
                    {
                        orden: "asc",
                    },
                    {
                        nombre: "asc",
                    },
                ],
            });

        res.status(200).json(categorias);
    } catch (error) {
        console.error(
            "Error al listar categorías:",
            error
        );

        res.status(500).json({
            message: "Error al obtener las categorías",
        });
    }
};


export const crearCategoria = async (req, res) => {
    try {
        const {
            nombre,
            slug,
            descripcion,
            imagen_clave,
            orden,
            estado,
            id_padre,
        } = req.body;

        if (!nombre || !slug) {
            return res.status(400).json({
                message: "nombre y slug son obligatorios",
            });
        }

        const categoria =
            await prisma.categoria.create({
                data: {
                    nombre: nombre.trim(),
                    slug: slug.trim(),
                    descripcion:
                        descripcion?.trim() || null,
                    imagen_clave:
                        imagen_clave?.trim() || null,
                    orden: Number(orden) || 0,
                    estado: estado || "ACTIVO",
                    id_padre:
                        id_padre !== undefined &&
                            id_padre !== null &&
                            id_padre !== ""
                            ? Number(id_padre)
                            : null,
                },
            });

        res.status(201).json({
            message: "Categoría creada correctamente",
            categoria,
        });
    } catch (error) {
        console.error(
            "Error al crear categoría:",
            error
        );

        res.status(500).json({
            message: "Error al crear la categoría",
        });
    }
};


export const modificarCategoria = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID de categoría inválido",
            });
        }

        const {
            nombre,
            slug,
            descripcion,
            imagen_clave,
            orden,
            estado,
            id_padre,
        } = req.body;

        const categoria =
            await prisma.categoria.update({
                where: {
                    id_categoria: id,
                },
                data: {
                    ...(nombre !== undefined && {
                        nombre: nombre.trim(),
                    }),
                    ...(slug !== undefined && {
                        slug: slug.trim(),
                    }),
                    ...(descripcion !== undefined && {
                        descripcion:
                            descripcion?.trim() || null,
                    }),
                    ...(imagen_clave !== undefined && {
                        imagen_clave:
                            imagen_clave?.trim() || null,
                    }),
                    ...(orden !== undefined && {
                        orden: Number(orden),
                    }),
                    ...(estado !== undefined && {
                        estado,
                    }),
                    ...(id_padre !== undefined && {
                        id_padre:
                            id_padre !== null &&
                                id_padre !== ""
                                ? Number(id_padre)
                                : null,
                    }),
                },
            });

        res.status(200).json({
            message:
                "Categoría modificada correctamente",
            categoria,
        });
    } catch (error) {
        console.error(
            "Error al modificar categoría:",
            error
        );

        res.status(500).json({
            message: "Error al modificar la categoría",
        });
    }
};


// ======================================================
// LISTAS DE PRECIOS
// ======================================================

export const listarListasPrecio = async (req, res) => {
    try {
        const listas =
            await prisma.listaPrecio.findMany({
                orderBy: {
                    nombre: "asc",
                },
            });

        res.status(200).json(listas);
    } catch (error) {
        console.error(
            "Error al listar listas de precios:",
            error
        );

        res.status(500).json({
            message:
                "Error al obtener las listas de precios",
        });
    }
};


export const crearListaPrecio = async (req, res) => {
    try {
        const {
            nombre,
            codigo,
            moneda,
            estado,
        } = req.body;

        if (!nombre || !codigo) {
            return res.status(400).json({
                message: "nombre y codigo son obligatorios",
            });
        }

        const lista = await prisma.listaPrecio.create({
            data: {
                nombre: nombre.trim(),
                codigo: codigo.trim(),
                moneda: moneda?.trim() || "GTQ",
                estado: estado || "ACTIVO",
            },
        });

        res.status(201).json({
            message:
                "Lista de precios creada correctamente",
            lista,
        });
    } catch (error) {
        console.error(
            "Error al crear lista de precios:",
            error
        );

        res.status(500).json({
            message:
                "Error al crear la lista de precios",
        });
    }
};


export const modificarListaPrecio = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message:
                    "ID de lista de precios inválido",
            });
        }

        const {
            nombre,
            codigo,
            moneda,
            estado,
        } = req.body;

        const lista = await prisma.listaPrecio.update({
            where: {
                id_lista_precio: id,
            },
            data: {
                ...(nombre !== undefined && {
                    nombre: nombre.trim(),
                }),
                ...(codigo !== undefined && {
                    codigo: codigo.trim(),
                }),
                ...(moneda !== undefined && {
                    moneda: moneda.trim(),
                }),
                ...(estado !== undefined && {
                    estado,
                }),
            },
        });

        res.status(200).json({
            message:
                "Lista de precios modificada correctamente",
            lista,
        });
    } catch (error) {
        console.error(
            "Error al modificar lista de precios:",
            error
        );

        res.status(500).json({
            message:
                "Error al modificar la lista de precios",
        });
    }
};