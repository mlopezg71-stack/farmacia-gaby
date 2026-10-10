import jwt from "jsonwebtoken";


// ======================================================
// IDENTIFICAR QUIÉN HACE LA PETICIÓN
// Deja el resultado en req.identidad con una de estas formas:
//   { tipo: "CLIENTE",  id_cliente, id_usuario, roles }  -> JWT de un cliente
//   { tipo: "PERSONAL", id_usuario, roles }              -> JWT de admin, cajero, etc.
//   { tipo: "INVITADO", token_invitado }                 -> header x-token-invitado
// El JWT lo firma el servicio de auth con el mismo JWT_SECRET.
// ======================================================

export const identificar = (req, res, next) => {
    const encabezado = req.headers.authorization;

    if (encabezado) {
        if (!encabezado.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token de autenticación inválido",
            });
        }

        let payload;

        try {
            payload = jwt.verify(
                encabezado.split(" ")[1],
                process.env.JWT_SECRET
            );
        } catch (error) {
            return res.status(401).json({
                message: "Token inválido o expirado",
            });
        }

        const roles = Array.isArray(payload.roles) ? payload.roles : [];

        if (payload.id_cliente) {
            req.identidad = {
                tipo: "CLIENTE",
                id_cliente: Number(payload.id_cliente),
                id_usuario: payload.id_usuario,
                roles,
            };

            return next();
        }

        // Los tokens de clientes no vencen, así que pueden existir sesiones
        // anteriores que no traen id_cliente. Deben iniciar sesión otra vez.
        if (roles.includes("CLIENTE")) {
            return res.status(401).json({
                message: "Tu sesión es anterior a esta versión. Vuelve a iniciar sesión",
            });
        }

        req.identidad = {
            tipo: "PERSONAL",
            id_usuario: payload.id_usuario,
            roles,
        };

        return next();
    }

    const tokenInvitado = req.headers["x-token-invitado"];

    if (tokenInvitado) {
        req.identidad = {
            tipo: "INVITADO",
            token_invitado: tokenInvitado,
        };

        return next();
    }

    return res.status(401).json({
        message: "Debes iniciar sesión o enviar el header x-token-invitado",
    });
};


// ======================================================
// RESTRICCIONES POR TIPO DE IDENTIDAD
// Se usan después de identificar.
// ======================================================

export const esAdministrador = (identidad) =>
    identidad.tipo === "PERSONAL" &&
    identidad.roles.includes("ADMINISTRADOR");

export const soloAdministrador = (req, res, next) => {
    if (!esAdministrador(req.identidad)) {
        return res.status(403).json({
            message: "No tienes permisos para realizar esta acción",
        });
    }

    next();
};

export const soloCliente = (req, res, next) => {
    if (req.identidad.tipo !== "CLIENTE") {
        return res.status(403).json({
            message: "Esta acción es solo para clientes con sesión iniciada",
        });
    }

    next();
};