import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(
    JSON.parse(sessionStorage.getItem("usuario")) || null
  );

  const [token, setToken] = useState(sessionStorage.getItem("token") || null);

  const login = (usuarioData, tokenData) => {
    sessionStorage.setItem("token", tokenData);
    sessionStorage.setItem("usuario", JSON.stringify(usuarioData));

    setUsuario(usuarioData);
    setToken(tokenData);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    setUsuario(null);
    setToken(null);
  };

  const estaAutenticado = !!token && !!usuario;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        estaAutenticado,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);