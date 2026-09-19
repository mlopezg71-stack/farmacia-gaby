import prisma from "../config/prisma.js";

// Crea una nueva notificación para un usuario
export const crearNotificacion = async ({
    id_usuario,
    titulo,
    mensaje,
    tipo,
    url = null
}) => {
    if (!id_usuario) return null;

    const notificacion = await prisma.notificacion.create({
        data: {
            id_usuario: Number(id_usuario),
            titulo,
            mensaje,
            tipo,
            url
        }
    });

    return notificacion;
};

// Crea varias notificaciones al mismo tiempo
export const crearNotificacionesMultiples = async (notificaciones = []) => {
    const datosValidos = notificaciones
        .filter((item) => item.id_usuario)
        .map((item) => ({
            id_usuario: Number(item.id_usuario),
            titulo: item.titulo,
            mensaje: item.mensaje,
            tipo: item.tipo,
            url: item.url || null
        }));

    if (datosValidos.length === 0) return null;

    return await prisma.notificacion.createMany({
        data: datosValidos
    });
};

// Lista las notificaciones del usuario autenticado
export const obtenerNotificaciones = async (usuario) => {
    return await prisma.notificacion.findMany({
        where: {
            id_usuario: Number(usuario.id_usuario)
        },
        orderBy: {
            created_at: "desc"
        }
    });
};

// Cuenta notificaciones no leídas
export const contarNoLeidas = async (usuario) => {
    return await prisma.notificacion.count({
        where: {
            id_usuario: Number(usuario.id_usuario),
            leida: false
        }
    });
};

// Marca una notificación como leída
export const marcarComoLeida = async (id_notificacion, usuario) => {
    return await prisma.notificacion.updateMany({
        where: {
            id_notificacion: Number(id_notificacion),
            id_usuario: Number(usuario.id_usuario)
        },
        data: {
            leida: true
        }
    });
};

// Marca todas las notificaciones del usuario como leídas
export const marcarTodasComoLeidas = async (usuario) => {
    return await prisma.notificacion.updateMany({
        where: {
            id_usuario: Number(usuario.id_usuario),
            leida: false
        },
        data: {
            leida: true
        }
    });
};