import {
    obtenerNotificaciones,
    contarNoLeidas,
    marcarComoLeida,
    marcarTodasComoLeidas
} from "../services/notificacionesService.js";

// Lista las notificaciones del usuario autenticado
export const listar = async (req, res) => {
    try {
        const notificaciones = await obtenerNotificaciones(req.usuario);

        res.json(notificaciones);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Cuenta las notificaciones no leídas del usuario autenticado
export const contar = async (req, res) => {
    try {
        const total = await contarNoLeidas(req.usuario);

        res.json({
            total
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Marca una notificación como leída
export const marcarLeida = async (req, res) => {
    try {
        await marcarComoLeida(req.params.id, req.usuario);

        res.json({
            message: "Notificación marcada como leída"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Marca todas las notificaciones como leídas
export const marcarTodas = async (req, res) => {
    try {
        await marcarTodasComoLeidas(req.usuario);

        res.json({
            message: "Todas las notificaciones fueron marcadas como leídas"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};