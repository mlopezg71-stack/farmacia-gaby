import prisma from "../config/prisma.js";

// Registra una acción dentro de la bitácora del sistema
export const registrarBitacora = async ({
    id_usuario,
    accion,
    descripcion,
    modulo,
    tipo_evento = "GENERAL",
    resultado = "EXITOSO",
    ip_origen,
    user_agent
}) => {
    try {
        await prisma.bitacoraActividad.create({
            data: {
                id_usuario,
                accion,
                descripcion,
                modulo,
                tipo_evento,
                resultado,
                ip_origen,
                user_agent
            }
        });
    } catch (error) {
        console.error("Error al registrar bitácora:", error.message);
    }
};