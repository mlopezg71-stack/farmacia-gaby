export const verifyRole = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({
        message: "Usuario no autenticado"
      });
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({
        message: "No tienes permisos para realizar esta acción"
      });
    }

    next();
  };
};