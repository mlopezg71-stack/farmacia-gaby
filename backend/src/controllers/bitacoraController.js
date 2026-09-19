import prisma from "../config/prisma.js";

// Lista los registros de bitácora con filtros opcionales
export const listarBitacora = async (req, res) => {
    try {
        const {
            busqueda,
            modulo,
            tipo_evento,
            resultado,
            fecha_inicio,
            fecha_fin
        } = req.query;

        const filtros = {};

        if (modulo && modulo !== "TODOS") {
            filtros.modulo = modulo;
        }

        if (tipo_evento && tipo_evento !== "TODOS") {
            filtros.tipo_evento = tipo_evento;
        }

        if (resultado && resultado !== "TODOS") {
            filtros.resultado = resultado;
        }

        if (fecha_inicio || fecha_fin) {
            filtros.fecha_hora = {};

            if (fecha_inicio) {
                filtros.fecha_hora.gte = new Date(fecha_inicio);
            }

            if (fecha_fin) {
                const fechaFin = new Date(fecha_fin);
                fechaFin.setHours(23, 59, 59, 999);
                filtros.fecha_hora.lte = fechaFin;
            }
        }

        if (busqueda) {
            filtros.OR = [
                {
                    accion: {
                        contains: busqueda,
                        mode: "insensitive"
                    }
                },
                {
                    descripcion: {
                        contains: busqueda,
                        mode: "insensitive"
                    }
                },
                {
                    modulo: {
                        contains: busqueda,
                        mode: "insensitive"
                    }
                },
                {
                    usuario: {
                        nombre_completo: {
                            contains: busqueda,
                            mode: "insensitive"
                        }
                    }
                },
                {
                    usuario: {
                        correo: {
                            contains: busqueda,
                            mode: "insensitive"
                        }
                    }
                }
            ];
        }

        const bitacora = await prisma.bitacoraActividad.findMany({
            where: filtros,
            include: {
                usuario: {
                    select: {
                        id_usuario: true,
                        nombre_completo: true,
                        correo: true,
                        rol: {
                            select: {
                                nombre: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                fecha_hora: "desc"
            }
        });

        res.json(bitacora);
    } catch (error) {
        console.error("ERROR BITÁCORA:", error);

        res.status(500).json({
            message: "Error al listar bitácora",
            error: error.message
        });
    }
};