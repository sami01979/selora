import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "./ShopContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const register = async (name, email, password) => {
    const response = await axios.post(backendUrl + "/api/user/register", {
      name,
      email,
      password,
    });
    if (response.data.success) {
      setToken(response.data.token);
      return { success: true };
    }
    return { success: false, message: response.data.message };
  };

  const login = async (email, password) => {
    const response = await axios.post(backendUrl + "/api/user/login", {
      email,
      password,
    });
    if (response.data.success) {
      setToken(response.data.token);
      return { success: true };
    }
    return { success: false, message: response.data.message };
  };

  const logout = () => setToken("");

  return (
    <AuthContext.Provider value={{ token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);