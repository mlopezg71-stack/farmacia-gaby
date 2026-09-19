import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

// Obtiene médicos activos
export const obtenerMedicos = async () => {
    return await prisma.usuario.findMany({
        where: {
            rol: {
                nombre: "MEDICO"
            },
            estado: "ACTIVO"
        },
        select: {
            id_usuario: true,
            nombre_completo: true,
            correo: true
        },
        orderBy: {
            nombre_completo: "asc"
        }
    });
};

// Crear usuario
export const crearUsuario = async (data) => {

    const {
        nombre_completo,
        correo,
        password,
        id_rol,
        id_paciente
    } = data;

    const correoExiste = await prisma.usuario.findUnique({
        where: {
            correo
        }
    });

    if (correoExiste) {
        throw new Error("El correo ya está registrado");
    }

    const rolExiste = await prisma.rol.findUnique({
        where: {
            id_rol: Number(id_rol)
        }
    });

    if (!rolExiste) {
        throw new Error("El rol seleccionado no existe");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
        data: {
            nombre_completo,
            correo,
            password_hash,
            id_rol: Number(id_rol),
            id_paciente: id_paciente
                ? Number(id_paciente)
                : null
        },
        include: {
            rol: true,
            paciente: true
        }
    });

    return usuario;
};

// Listar usuarios
export const obtenerUsuarios = async () => {

    return await prisma.usuario.findMany({
        include: {
            rol: true,
            paciente: true
        },
        orderBy: {
            id_usuario: "desc"
        }
    });

};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (id) => {

    const usuario = await prisma.usuario.findUnique({
        where: {
            id_usuario: Number(id)
        },
        include: {
            rol: true,
            paciente: true
        }
    });

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    return usuario;
};

// Actualizar usuario
export const actualizarUsuario = async (id, data) => {

    const usuarioExiste = await prisma.usuario.findUnique({
        where: {
            id_usuario: Number(id)
        }
    });

    if (!usuarioExiste) {
        throw new Error("Usuario no encontrado");
    }

    if (
        data.correo &&
        data.correo !== usuarioExiste.correo
    ) {

        const correoExiste = await prisma.usuario.findUnique({
            where: {
                correo: data.correo
            }
        });

        if (correoExiste) {
            throw new Error("El correo ya está registrado");
        }
    }

    const datosActualizar = {
        nombre_completo: data.nombre_completo,
        correo: data.correo,
        id_rol: data.id_rol
            ? Number(data.id_rol)
            : undefined,
        id_paciente: data.id_paciente
            ? Number(data.id_paciente)
            : null
    };

    if (
        data.password &&
        data.password.trim() !== ""
    ) {
        datosActualizar.password_hash =
            await bcrypt.hash(data.password, 10);
    }

    return await prisma.usuario.update({
        where: {
            id_usuario: Number(id)
        },
        data: datosActualizar,
        include: {
            rol: true,
            paciente: true
        }
    });

};

// Desactivar usuario
export const desactivarUsuario = async (id) => {

    return await prisma.usuario.update({
        where: {
            id_usuario: Number(id)
        },
        data: {
            estado: "INACTIVO"
        }
    });

};

// Reactivar usuario
export const reactivarUsuario = async (id) => {

    return await prisma.usuario.update({
        where: {
            id_usuario: Number(id)
        },
        data: {
            estado: "ACTIVO"
        }
    });

};

// Obtener roles
export const obtenerRoles = async () => {

    return await prisma.rol.findMany({
        where: {
            estado: "ACTIVO"
        },
        orderBy: {
            nombre: "asc"
        }
    });

};