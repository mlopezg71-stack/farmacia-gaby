import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../config/prisma.js";
import { enviarCodigoRecuperacion } from "./emailService.js";

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

    const esCliente =
        roles.length === 1 &&
        roles[0] === "CLIENTE";

    const opcionesToken = esCliente
        ? {}
        : {
            expiresIn:
                process.env.JWT_EXPIRES_IN || "2h",
        };

    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            correo: usuario.correo,
            roles,
            version_seguridad: usuario.version_seguridad,
        },
        process.env.JWT_SECRET,
        opcionesToken
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

export const solicitarRecuperacionPassword = async (data) => {
    const { correo } = data;

    if (!correo) {
        throw new Error("El correo es obligatorio");
    }

    const correoNormalizado = correo.trim().toLowerCase();

    const usuario = await prisma.usuario.findUnique({
        where: {
            correo: correoNormalizado,
        },
    });

    if (!usuario) {
        throw new Error("No existe una cuenta registrada con ese correo");
    }

    if (usuario.estado !== "ACTIVO") {
        throw new Error("Usuario inactivo");
    }

    // Código de recuperación de 6 dígitos
    const codigo = crypto.randomInt(100000, 1000000).toString();

    // Nunca guardamos el código real en la base de datos.
    // Guardamos únicamente su hash.
    const token_hash = crypto
        .createHash("sha256")
        .update(codigo)
        .digest("hex");

    // El código vence dentro de 15 minutos
    const vence_at = new Date(
        Date.now() + 15 * 60 * 1000
    );

    await prisma.tokenAccion.create({
        data: {
            tipo: "RECUPERAR_PASSWORD",
            token_hash,
            vence_at,
            id_usuario: usuario.id_usuario,
        },
    });

    await enviarCodigoRecuperacion(
        usuario.correo,
        codigo,
        usuario.nombre_completo
    );

    return {
        message:
            "Se ha enviado un código de recuperación a tu correo electrónico",
    };
};

export const restablecerPasswordUsuario = async (data) => {
    const {
        correo,
        codigo,
        nuevaPassword,
    } = data;

    // =========================================
    // VALIDACIONES BÁSICAS
    // =========================================
    if (!correo || !codigo || !nuevaPassword) {
        throw new Error(
            "Correo, código y nueva contraseña son obligatorios"
        );
    }

    const correoNormalizado = correo
        .trim()
        .toLowerCase();

    // =========================================
    // VALIDAR SEGURIDAD DE LA CONTRASEÑA
    // =========================================
    const passwordValida =
        nuevaPassword.length >= 8 &&
        /[A-Z]/.test(nuevaPassword) &&
        /[a-z]/.test(nuevaPassword) &&
        /[0-9]/.test(nuevaPassword) &&
        /[^A-Za-z0-9]/.test(nuevaPassword);

    if (!passwordValida) {
        throw new Error(
            "La nueva contraseña no cumple con los requisitos de seguridad"
        );
    }

    // =========================================
    // BUSCAR USUARIO
    // =========================================
    const usuario = await prisma.usuario.findUnique({
        where: {
            correo: correoNormalizado,
        },
    });

    if (!usuario) {
        throw new Error(
            "No existe una cuenta registrada con ese correo"
        );
    }

    if (usuario.estado !== "ACTIVO") {
        throw new Error("Usuario inactivo");
    }

    // =========================================
    // GENERAR HASH DEL CÓDIGO RECIBIDO
    // =========================================
    const token_hash = crypto
        .createHash("sha256")
        .update(codigo.trim())
        .digest("hex");

    // =========================================
    // BUSCAR EL CÓDIGO
    // =========================================
    const tokenRecuperacion =
        await prisma.tokenAccion.findFirst({
            where: {
                id_usuario: usuario.id_usuario,
                tipo: "RECUPERAR_PASSWORD",
                token_hash,
                consumido_at: null,
            },
            orderBy: {
                created_at: "desc",
            },
        });

    if (!tokenRecuperacion) {
        throw new Error(
            "El código de recuperación es inválido"
        );
    }

    // =========================================
    // VALIDAR VENCIMIENTO
    // =========================================
    if (
        new Date(tokenRecuperacion.vence_at) <
        new Date()
    ) {
        throw new Error(
            "El código de recuperación ha vencido"
        );
    }

    // =========================================
    // GENERAR NUEVO HASH DE CONTRASEÑA
    // =========================================
    const password_hash = await bcrypt.hash(
        nuevaPassword,
        10
    );

    // =========================================
    // ACTUALIZAR CONTRASEÑA E INVALIDAR TOKEN
    // =========================================
    await prisma.$transaction(async (tx) => {
        await tx.usuario.update({
            where: {
                id_usuario: usuario.id_usuario,
            },
            data: {
                password_hash,
                password_changed_at: new Date(),
                version_seguridad: {
                    increment: 1,
                },
            },
        });

        await tx.tokenAccion.update({
            where: {
                id_token_accion:
                    tokenRecuperacion.id_token_accion,
            },
            data: {
                consumido_at: new Date(),
            },
        });
    });

    return {
        message:
            "Tu contraseña ha sido restablecida correctamente",
    };
};

export const obtenerPerfilUsuario = async (idUsuario) => {
    const usuario = await prisma.usuario.findUnique({
        where: {
            id_usuario: idUsuario,
        },
        include: incluirRoles,
    });

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    const roles = usuario.rel_usuario_rol_id_usuario.map(
        (usuarioRol) => usuarioRol.ref_id_rol.codigo
    );

    return {
        id_usuario: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo,
        telefono: usuario.telefono,
        roles,
    };
};

export const actualizarPerfilUsuario = async (
    idUsuario,
    data
) => {
    const {
        nombre_completo,
        correo,
        telefono,
    } = data;

    if (!nombre_completo || !correo) {
        throw new Error(
            "Nombre completo y correo son obligatorios"
        );
    }

    const correoNormalizado = correo
        .trim()
        .toLowerCase();

    const usuarioExistente =
        await prisma.usuario.findFirst({
            where: {
                correo: correoNormalizado,
                NOT: {
                    id_usuario: idUsuario,
                },
            },
        });

    if (usuarioExistente) {
        throw new Error(
            "El correo ya está registrado"
        );
    }

    const usuario =
        await prisma.usuario.update({
            where: {
                id_usuario: idUsuario,
            },
            data: {
                nombre_completo:
                    nombre_completo.trim(),
                correo: correoNormalizado,
                telefono:
                    telefono?.trim() || null,
            },
        });

    return {
        id_usuario: usuario.id_usuario,
        nombre_completo:
            usuario.nombre_completo,
        correo: usuario.correo,
        telefono: usuario.telefono,
    };
};

export const obtenerDireccionesCliente = async (idUsuario) => {
    const cliente = await prisma.cliente.findUnique({
        where: {
            id_usuario: idUsuario,
        },
    });

    if (!cliente) {
        throw new Error("Cliente no encontrado");
    }

    return prisma.direccionCliente.findMany({
        where: {
            id_cliente: cliente.id_cliente,
            estado: "ACTIVO",
        },
        orderBy: [
            {
                predeterminada: "desc",
            },
            {
                created_at: "desc",
            },
        ],
    });
};


export const crearDireccionCliente = async (
    idUsuario,
    data
) => {
    const cliente = await prisma.cliente.findUnique({
        where: {
            id_usuario: idUsuario,
        },
    });

    if (!cliente) {
        throw new Error("Cliente no encontrado");
    }

    const {
        alias,
        destinatario,
        telefono,
        departamento,
        municipio,
        zona,
        direccion,
        referencias,
        latitud,
        longitud,
        predeterminada,
    } = data;

    if (
        !alias ||
        !destinatario ||
        !telefono ||
        !departamento ||
        !municipio ||
        !direccion
    ) {
        throw new Error(
            "Alias, destinatario, teléfono, departamento, municipio y dirección son obligatorios"
        );
    }

    return prisma.$transaction(async (tx) => {
        if (predeterminada === true) {
            await tx.direccionCliente.updateMany({
                where: {
                    id_cliente: cliente.id_cliente,
                    estado: "ACTIVO",
                },
                data: {
                    predeterminada: false,
                },
            });
        }

        return tx.direccionCliente.create({
            data: {
                alias: alias.trim(),
                destinatario: destinatario.trim(),
                telefono: telefono.trim(),
                departamento: departamento.trim(),
                municipio: municipio.trim(),
                zona: zona?.trim() || null,
                direccion: direccion.trim(),
                referencias: referencias?.trim() || null,
                latitud:
                    latitud !== null &&
                        latitud !== undefined &&
                        latitud !== ""
                        ? latitud
                        : null,
                longitud:
                    longitud !== null &&
                        longitud !== undefined &&
                        longitud !== ""
                        ? longitud
                        : null,
                predeterminada: predeterminada === true,
                id_cliente: cliente.id_cliente,
            },
        });
    });
};


export const actualizarDireccionCliente = async (
    idUsuario,
    idDireccion,
    data
) => {
    const cliente = await prisma.cliente.findUnique({
        where: {
            id_usuario: idUsuario,
        },
    });

    if (!cliente) {
        throw new Error("Cliente no encontrado");
    }

    const direccionExistente =
        await prisma.direccionCliente.findFirst({
            where: {
                id_direccion_cliente: Number(idDireccion),
                id_cliente: cliente.id_cliente,
                estado: "ACTIVO",
            },
        });

    if (!direccionExistente) {
        throw new Error("Dirección no encontrada");
    }

    const {
        alias,
        destinatario,
        telefono,
        departamento,
        municipio,
        zona,
        direccion,
        referencias,
        latitud,
        longitud,
        predeterminada,
    } = data;

    if (
        !alias ||
        !destinatario ||
        !telefono ||
        !departamento ||
        !municipio ||
        !direccion
    ) {
        throw new Error(
            "Alias, destinatario, teléfono, departamento, municipio y dirección son obligatorios"
        );
    }

    return prisma.$transaction(async (tx) => {
        if (predeterminada === true) {
            await tx.direccionCliente.updateMany({
                where: {
                    id_cliente: cliente.id_cliente,
                    estado: "ACTIVO",
                    NOT: {
                        id_direccion_cliente:
                            Number(idDireccion),
                    },
                },
                data: {
                    predeterminada: false,
                },
            });
        }

        return tx.direccionCliente.update({
            where: {
                id_direccion_cliente: Number(idDireccion),
            },
            data: {
                alias: alias.trim(),
                destinatario: destinatario.trim(),
                telefono: telefono.trim(),
                departamento: departamento.trim(),
                municipio: municipio.trim(),
                zona: zona?.trim() || null,
                direccion: direccion.trim(),
                referencias: referencias?.trim() || null,
                latitud:
                    latitud !== null &&
                        latitud !== undefined &&
                        latitud !== ""
                        ? latitud
                        : null,
                longitud:
                    longitud !== null &&
                        longitud !== undefined &&
                        longitud !== ""
                        ? longitud
                        : null,
                predeterminada: predeterminada === true,
            },
        });
    });
};


export const eliminarDireccionCliente = async (
    idUsuario,
    idDireccion
) => {
    const cliente = await prisma.cliente.findUnique({
        where: {
            id_usuario: idUsuario,
        },
    });

    if (!cliente) {
        throw new Error("Cliente no encontrado");
    }

    const direccionExistente =
        await prisma.direccionCliente.findFirst({
            where: {
                id_direccion_cliente: Number(idDireccion),
                id_cliente: cliente.id_cliente,
                estado: "ACTIVO",
            },
        });

    if (!direccionExistente) {
        throw new Error("Dirección no encontrada");
    }

    return prisma.direccionCliente.update({
        where: {
            id_direccion_cliente: Number(idDireccion),
        },
        data: {
            estado: "INACTIVO",
            predeterminada: false,
        },
    });
};


export const establecerDireccionPredeterminada = async (
    idUsuario,
    idDireccion
) => {
    const cliente = await prisma.cliente.findUnique({
        where: {
            id_usuario: idUsuario,
        },
    });

    if (!cliente) {
        throw new Error("Cliente no encontrado");
    }

    const direccionExistente =
        await prisma.direccionCliente.findFirst({
            where: {
                id_direccion_cliente: Number(idDireccion),
                id_cliente: cliente.id_cliente,
                estado: "ACTIVO",
            },
        });

    if (!direccionExistente) {
        throw new Error("Dirección no encontrada");
    }

    return prisma.$transaction(async (tx) => {
        await tx.direccionCliente.updateMany({
            where: {
                id_cliente: cliente.id_cliente,
                estado: "ACTIVO",
            },
            data: {
                predeterminada: false,
            },
        });

        return tx.direccionCliente.update({
            where: {
                id_direccion_cliente: Number(idDireccion),
            },
            data: {
                predeterminada: true,
            },
        });
    });
};