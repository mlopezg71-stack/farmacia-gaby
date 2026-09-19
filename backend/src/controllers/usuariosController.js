import {
    obtenerMedicos,
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    desactivarUsuario,
    reactivarUsuario,
    obtenerRoles
} from "../services/usuariosService.js";

// Lista los usuarios médicos activos
export const listarMedicos = async (req, res) => {
    try {
        const medicos = await obtenerMedicos();
        res.json(medicos);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener médicos",
            error: error.message
        });
    }
};

// Crea un nuevo usuario
export const crear = async (req, res) => {
    try {
        const usuario = await crearUsuario(req.body);

        res.status(201).json({
            message: "Usuario creado correctamente",
            usuario
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Lista todos los usuarios
export const listar = async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener usuarios",
            error: error.message
        });
    }
};

// Obtiene un usuario por ID
export const obtenerPorId = async (req, res) => {
    try {
        const usuario = await obtenerUsuarioPorId(req.params.id);
        res.json(usuario);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

// Actualiza un usuario
export const actualizar = async (req, res) => {
    try {
        const usuario = await actualizarUsuario(req.params.id, req.body);

        res.json({
            message: "Usuario actualizado correctamente",
            usuario
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Desactiva un usuario
export const desactivar = async (req, res) => {
    try {
        await desactivarUsuario(req.params.id);

        res.json({
            message: "Usuario desactivado correctamente"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Reactiva un usuario
export const reactivar = async (req, res) => {
    try {
        await reactivarUsuario(req.params.id);

        res.json({
            message: "Usuario reactivado correctamente"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Lista los roles activos
export const listarRoles = async (req, res) => {
    try {
        const roles = await obtenerRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener roles",
            error: error.message
        });
    }
};