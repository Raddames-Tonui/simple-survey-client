import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { server_url } from "../../config.json";

// Define User type
interface User {
  id: string;
  email: string;
  role: string;
}

// Define Context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

// Props type for Provider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "refreshToken",
    "user",
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = cookies.user;
    const storedAccessToken = cookies.accessToken;
    // console.log("Stored access token:", storedAccessToken); 

    if (storedUser && storedAccessToken) {
      try {
        const parsedUser =
          typeof storedUser === "string" ? JSON.parse(storedUser) : storedUser;
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
        setUser(null);
      }
    }

    setIsLoading(false);
  }, [cookies]);

  // Login
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${server_url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { access_token, refresh_token, user } = await res.json();

      setCookie("accessToken", access_token, {
        path: "/",
        secure: true,
        sameSite: "None",
      });
      setCookie("refreshToken", refresh_token, {
        path: "/",
        secure: true,
        sameSite: "None",
      });
      setCookie("user", JSON.stringify(user), {
        path: "/",
        secure: true,
        sameSite: "None",
      });

      setUser(user);
      navigate("/survey/create");
    } catch (error: any) {
      toast.error(error.message || "Login error");
      console.error("Login error:", error);
    }
  };

  // Sign Up
  const signUp = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${server_url}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      const { access_token, refresh_token, user } = data;

      // Set cookies
      setCookie("accessToken", access_token, { path: "/" });
      setCookie("refreshToken", refresh_token, { path: "/" });
      setCookie("user", JSON.stringify(user), { path: "/" });

      setUser(user);
      toast.success("Signup successful");

      // Trigger auto-login
      await login(email, password);
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Signup failed");
    }
  };

  // Logout
  const logout = async () => {
    try {
      const res = await fetch(`${server_url}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Logged out");
      } else {
        console.warn("Backend logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeCookie("accessToken", { path: "/" });
      removeCookie("refreshToken", { path: "/" });
      removeCookie("user", { path: "/" });
      setUser(null);
      navigate("/");
    }
  };

  // Refresh Token
  const refresh = async () => {
    try {
      const res = await fetch(`${server_url}/auth/token/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Refresh failed:", data.message);
        logout();
        return;
      }

      const { access_token } = data;
      setCookie("accessToken", access_token, { path: "/" });
    } catch (error) {
      console.error("Refresh error:", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signUp, logout, refresh }}
    >
      {!isLoading ? children : <Loader />}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
