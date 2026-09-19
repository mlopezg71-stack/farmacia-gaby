import {
    registrarCliente,
    loginUsuario,
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