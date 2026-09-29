import {
    registrarCliente,
    loginUsuario,
    solicitarRecuperacionPassword,
    restablecerPasswordUsuario,
    obtenerPerfilUsuario,
    actualizarPerfilUsuario,
    obtenerDireccionesCliente,
    crearDireccionCliente,
    actualizarDireccionCliente,
    eliminarDireccionCliente,
    establecerDireccionPredeterminada,
} from "../services/authService.js";

export const registroCliente = async (req, res) => {
    try {
        const resultado = await registrarCliente(req.body);

        res.status(201).json({
            message: "Cliente registrado correctamente",
            usuario: {
                id_usuario: resultado.usuario.id_usuario,
                nombre_completo: resultado.usuario.nombre_completo,
                correo: resultado.usuario.correo,
                telefono: resultado.usuario.telefono,
            },
            cliente: {
                id_cliente: resultado.cliente.id_cliente,
            },
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const resultado = await loginUsuario(req.body);

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            ...resultado,
        });
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
};

export const solicitarRecuperacion = async (req, res) => {
    try {
        const resultado = await solicitarRecuperacionPassword(req.body);

        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

export const restablecerPassword = async (req, res) => {
    try {
        const resultado =
            await restablecerPasswordUsuario(req.body);

        res.status(200).json(resultado);
    } catch (error) {
        console.error(
            "Error al restablecer contraseña:",
            error
        );

        res.status(400).json({
            message: error.message,
        });
    }
};

export const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await obtenerPerfilUsuario(
            req.usuario.id_usuario
        );

        res.status(200).json({
            usuario,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
};

export const actualizarPerfil = async (req, res) => {
    try {
        const usuario = await actualizarPerfilUsuario(
            req.usuario.id_usuario,
            req.body
        );

        res.status(200).json({
            message: "Información actualizada correctamente",
            usuario,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

export const obtenerDirecciones = async (req, res) => {
    try {
        const direcciones = await obtenerDireccionesCliente(
            req.usuario.id_usuario
        );

        res.status(200).json({
            direcciones,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


export const crearDireccion = async (req, res) => {
    try {
        const direccion = await crearDireccionCliente(
            req.usuario.id_usuario,
            req.body
        );

        res.status(201).json({
            message: "Dirección creada correctamente",
            direccion,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


export const actualizarDireccion = async (req, res) => {
    try {
        const direccion =
            await actualizarDireccionCliente(
                req.usuario.id_usuario,
                req.params.id,
                req.body
            );

        res.status(200).json({
            message: "Dirección actualizada correctamente",
            direccion,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


export const eliminarDireccion = async (req, res) => {
    try {
        await eliminarDireccionCliente(
            req.usuario.id_usuario,
            req.params.id
        );

        res.status(200).json({
            message: "Dirección eliminada correctamente",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


export const establecerPredeterminada =
    async (req, res) => {
        try {
            const direccion =
                await establecerDireccionPredeterminada(
                    req.usuario.id_usuario,
                    req.params.id
                );

            res.status(200).json({
                message:
                    "Dirección predeterminada actualizada correctamente",
                direccion,
            });
        } catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    };