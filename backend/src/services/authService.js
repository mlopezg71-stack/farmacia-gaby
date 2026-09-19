import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const registrarUsuario = async (data) => {
  const { nombre_completo, correo, password, id_rol } = data;

  const usuarioExiste = await prisma.usuario.findFirst({
    where: { correo: correo }
  });

  if (usuarioExiste) {
    throw new Error("El correo ya está registrado");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nombre_completo,
      correo,
      password_hash,
      id_rol
    },
    include: {
      rol: true
    }
  });

  return usuario;
};

export const loginUsuario = async (data) => {
  const { correo, password } = data;

  console.log("CORREO RECIBIDO:", correo);

  const usuario = await prisma.usuario.findFirst({
    where: { correo },
    include: { rol: true },
  });

  console.log("USUARIO ENCONTRADO:", usuario);

  if (!usuario) {
    throw new Error("Credenciales incorrectas");
  }

  const passwordValida = await bcrypt.compare(password, usuario.password_hash);

  console.log("PASSWORD VALIDA:", passwordValida);

  if (!passwordValida) {
    throw new Error("Credenciales incorrectas");
  }

  if (usuario.estado !== "ACTIVO") {
    throw new Error("Usuario inactivo");
  }

  await prisma.usuario.update({
    where: {
      id_usuario: usuario.id_usuario
    },
    data: {
      ultimo_acceso: new Date()
    }
  });

  const token = jwt.sign(

    {
      id_usuario: usuario.id_usuario,
      id_paciente: usuario.id_paciente,
      correo: usuario.correo,
      rol: usuario.rol.nombre,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return {
    usuario: {
      id_usuario: usuario.id_usuario,
      id_paciente: usuario.id_paciente,
      nombre_completo: usuario.nombre_completo,
      correo: usuario.correo,
      rol: usuario.rol.nombre,
    },
    token,
  };
};