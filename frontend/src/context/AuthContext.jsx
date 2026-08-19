import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const NAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
const EMAIL_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return {
        id: parseInt(decoded[ID_CLAIM], 10),
        nombre: decoded[NAME_CLAIM],
        email: decoded[EMAIL_CLAIM],
        rol: decoded[ROLE_CLAIM],
      };
    } catch {
      return null;
    }
  });

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser({
      id: parseInt(decoded[ID_CLAIM], 10),
      nombre: decoded[NAME_CLAIM],
      email: decoded[EMAIL_CLAIM],
      rol: decoded[ROLE_CLAIM],
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);