import { registrarUsuario, loginUsuario } from "../services/authService.js";

export const registro = async (req, res) => {
  try {
    const usuario = await registrarUsuario(req.body);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      usuario
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const resultado = await loginUsuario(req.body);

    res.json({
      message: "Inicio de sesión exitoso",
      ...resultado
    });
  } catch (error) {
    console.log("ERROR LOGIN COMPLETO:", error);

    res.status(401).json({
      message: error.message
    });
  }
};