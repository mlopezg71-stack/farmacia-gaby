import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const incluirRoles = {
    rel_usuario_rol_id_usuario: {
        include: {
            ref_id_rol: true,
        },
    },
};

export const buscarUsuarioPorCorreo = async (correo) => {
    const correoNormalizado = correo.trim().toLowerCase();

    return prisma.usuario.findUnique({
        where: {
            correo: correoNormalizado,
        },
        include: incluirRoles,
    });
};

export const registrarCliente = async (data) => {
    const { nombre_completo, correo, password, telefono } = data;

    const correoNormalizado = correo.trim().toLowerCase();

    const usuarioExistente = await prisma.usuario.findUnique({
        where: {
            correo: correoNormalizado,
        },
    });

    if (usuarioExistente) {
        throw new Error("El correo ya está registrado");
    }

    const rolCliente = await prisma.rol.findUnique({
        where: {
            codigo: "CLIENTE",
        },
    });

    if (!rolCliente) {
        throw new Error("El rol CLIENTE no está configurado");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const resultado = await prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.create({
            data: {
                nombre_completo,
                correo: correoNormalizado,
                password_hash,
                telefono: telefono || null,
            },
        });

        await tx.usuarioRol.create({
            data: {
                id_usuario: usuario.id_usuario,
                id_rol: rolCliente.id_rol,
            },
        });

        const cliente = await tx.cliente.create({
            data: {
                id_usuario: usuario.id_usuario,
            },
        });

        return {
            usuario,
            cliente,
        };
    });

    return resultado;
};

export const loginUsuario = async (data) => {
    const { correo, password } = data;

    const usuario = await buscarUsuarioPorCorreo(correo);

    if (!usuario) {
        throw new Error("Credenciales incorrectas");
    }

    const passwordValida = await bcrypt.compare(
        password,
        usuario.password_hash
    );

    if (!passwordValida) {
        throw new Error("Credenciales incorrectas");
    }

    if (usuario.estado !== "ACTIVO") {
        throw new Error("Usuario inactivo");
    }

    const roles = usuario.rel_usuario_rol_id_usuario.map(
        (usuarioRol) => usuarioRol.ref_id_rol.codigo
    );

    await prisma.usuario.update({
        where: {
            id_usuario: usuario.id_usuario,
        },
        data: {
            ultimo_acceso: new Date(),
        },
    });

    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            correo: usuario.correo,
            roles,
            version_seguridad: usuario.version_seguridad,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "2h",
        }
    );

    return {
        usuario: {
            id_usuario: usuario.id_usuario,
            nombre_completo: usuario.nombre_completo,
            correo: usuario.correo,
            telefono: usuario.telefono,
            roles,
        },
        token,
    };
};