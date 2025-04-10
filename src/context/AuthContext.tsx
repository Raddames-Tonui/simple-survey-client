import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { server_url } from "../../config.json";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  refresh: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;  // defines that 'children' will be passed to this component
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "refreshToken",
    "user",
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    
    // Load user info from cookies when app starts
    const storedUser = cookies.user;
    const storedAccessToken = cookies.accessToken;
    const storedRefreshToken = cookies.refreshToken;

    // Ensure that storedUser is a valid string and parse it safely
    if (storedUser && storedAccessToken && storedRefreshToken) {
      try {
        // Check if cookies.user is a valid JSON string before parsing
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data from cookies:", e);
        setUser(null); 
      }
    }
  }, [cookies]);

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
    setCookie("accessToken", access_token, { path: "/", httpOnly: true });
    setCookie("refreshToken", refresh_token, { path: "/", httpOnly: true });
    setCookie("user", JSON.stringify(user), { path: "/", httpOnly: false });

    setUser(user);
    navigate("/response");
  };

  // Logout User
  const logout = () => {
    removeCookie("accessToken");
    removeCookie("refreshToken");
    removeCookie("user");

    setUser(null);

    navigate("/login");
  };

  // Refresh Token
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
    setCookie("accessToken", access_token, { path: "/", httpOnly: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refresh }}>
      {children} 
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
