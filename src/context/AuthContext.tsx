import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { server_url } from "../../config.json";
import Loader from "../components/Loader";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean; 
  login: (email: string, password: string) => void;
  signUp: (email: string, password: string, role: string) => void; 
  logout: () => void;
  refresh: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const storedRefreshToken = cookies.refreshToken;

    if (storedUser && storedAccessToken && storedRefreshToken) {
      try {
        // Check if the user cookie is a stringified JSON
        if (typeof storedUser === "string") {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          setUser(storedUser); // In case the cookie is already an object
        }
      } catch (e) {
        console.error("Error parsing user data from cookies:", e);
        setUser(null);
      }
    }
    setIsLoading(false); 
  }, [cookies]);

  // LOGIN
  const login = async (email: string, password: string) => {
    const response = await fetch(`${server_url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Login failed", data.message);
      return;
    }

    const data = await response.json();
    const { access_token, refresh_token, user } = data;

    // Set tokens and user info in cookies
    setCookie("accessToken", access_token, { path: "/" });
    setCookie("refreshToken", refresh_token, { path: "/" });
    setCookie("user", JSON.stringify(user), { path: "/" });

    setUser(user);
    navigate("/response");
  };

  // LOGOUT
  const logout = () => {
    removeCookie("accessToken");
    removeCookie("refreshToken");
    removeCookie("user");

    setUser(null);

    navigate("/login");
  };

  // REFRESH TOKEN
  const refresh = async () => {
    const response = await fetch(`${server_url}/auth/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.refreshToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Token refresh Failed:", data.message);
      logout();
      return;
    }

    const data = await response.json();
    const { access_token } = data;

    // Update the access token in cookies
    setCookie("accessToken", access_token, { path: "/" });
  };

  // SIGNUP
  const signUp = async (email: string, password: string, role: string) => {
    const response = await fetch(`${server_url}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Signup failed", data.message);
      return;
    }

    const data = await response.json();
    const { access_token, refresh_token, user } = data;

    setCookie("accessToken", access_token, { path: "/" });
    setCookie("refreshToken", refresh_token, { path: "/" });
    setCookie("user", JSON.stringify(user), { path: "/" });

    setUser(user);
    navigate("/response");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refresh, signUp, isLoading }}>
      {!isLoading ? children : <Loader />} 
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
