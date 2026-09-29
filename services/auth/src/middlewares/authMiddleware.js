import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
    try {
        const encabezado = req.headers.authorization;

        if (
            !encabezado ||
            !encabezado.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Token de autenticación requerido",
            });
        }

        const token = encabezado.split(" ")[1];

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = payload;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o expirado",
        });
    }
};