import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { server_url } from "../../config.json";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

// User type
interface User {
  id: string;
  email: string;
  role: string;
}

// Context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  signUp: (email: string, password: string, role: string) => void;
  logout: () => void;
  refresh: () => void;
}

// Props type for provider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider: Wraps the app with auth state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken", "refreshToken", "user"]);
  const navigate = useNavigate();

  // Check cookies and restore session on load
  useEffect(() => {
    const storedUser = cookies.user;
    const storedAccessToken = cookies.accessToken;

    if (storedUser && storedAccessToken) {
      try {
        const parsedUser = typeof storedUser === "string" ? JSON.parse(storedUser) : storedUser;
        setUser(parsedUser); // Successfully set user after cookie parsing
      } catch (e) {
        console.error("Error parsing user from cookies:", e);
        setUser(null); // Clear user if parsing fails
      }
    }
    setIsLoading(false); // Set isLoading false after cookie processing is complete
  }, [cookies]); // Triggered whenever cookies change


  // login(): Authenticates and stores tokens
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${server_url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data.message);
        toast.error(data.message || "Login failed");
        return;
      }

      const { access_token, refresh_token, user } = data;

      setCookie("accessToken", access_token, { path: "/" });
      setCookie("refreshToken", refresh_token, { path: "/" });
      setCookie("user", JSON.stringify(user), { path: "/" });

      setUser(user);
      navigate("/response");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
    }
  };

  // logout(): Logs out and clears cookies
  const logout = async () => {
    try {
      const res = await fetch(`${server_url}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Logout successful");
      } else {
        console.error("Backend logout failed");
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

  // refresh(): Gets a new access token using refresh token
  const refresh = async () => {
    try {
      const response = await fetch(`${server_url}/auth/token/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",  // Ensures cookies are sent with the request
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Token refresh failed:", data.message);
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

  // signUp(): Registers a new user and logs them in
  const signUp = async (email: string, password: string, role: string) => {
    try {
      const response = await fetch(`${server_url}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup failed:", data.message);
        toast.error(data.message || "Signup failed");
        return;
      }

      const { access_token, refresh_token, user } = data;

      setCookie("accessToken", access_token, { path: "/" });
      setCookie("refreshToken", refresh_token, { path: "/" });
      setCookie("user", JSON.stringify(user), { path: "/" });

      setUser(user);
      toast.success("Signup successful");
      navigate("/response");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Signup failed");
    }
  };

  // Provide auth context value
  return (
    <AuthContext.Provider value={{ user, login, logout, refresh, signUp, isLoading }}>
      {!isLoading ? children : <Loader />}
    </AuthContext.Provider>
  );
};

// useAuth(): Custom hook to access auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
