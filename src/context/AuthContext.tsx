import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { server_url } from "../../config.json";
import Loader from "../components/Loader";

// Defining the User type
interface User {
  id: string;
  email: string;
  role: string;
}

// Defining the AuthContextType to type the context value
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  signUp: (email: string, password: string, role: string) => void;
  logout: () => void;
  refresh: () => void;
}

// Defining the AuthProviderProps to type the children of the provider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Creating the context for auth functionality
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // States to manage user info, loading status, and cookies
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Managing cookies
  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "refreshToken",
    "user",
  ]);

  // Navigation hook to navigate to different routes
  const navigate = useNavigate();

  // useEffect to check if there is a stored user and token in cookies
  useEffect(() => {
    const storedUser = cookies.user;
    const storedAccessToken = cookies.accessToken;
    const storedRefreshToken = cookies.refreshToken;

    // If user and tokens exist in cookies, set the user state
    if (storedUser && storedAccessToken && storedRefreshToken) {
      try {
        if (typeof storedUser === "string") {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser); // Set user info from cookie
        } else {
          setUser(storedUser); // In case the cookie is already an object
        }
      } catch (e) {
        console.error("Error parsing user data from cookies:", e);
        setUser(null); // If there is an error, set user to null
      }
    }
    setIsLoading(false); // Set loading state to false after checking cookies
  }, [cookies]);

  // LOGIN function to authenticate user and store tokens in cookies
  const login = async (email: string, password: string) => {
    // Making a POST request to the server to authenticate the user
    const response = await fetch(`${server_url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // If login fails, log the error
    if (!response.ok) {
      const data = await response.json();
      console.error("Login failed", data.message);
      return;
    }

    // Extracting tokens and user data from the response
    const data = await response.json();
    const { access_token, refresh_token, user } = data;

    // Storing tokens and user info in cookies
    setCookie("accessToken", access_token, { path: "/" });
    setCookie("refreshToken", refresh_token, { path: "/" });
    setCookie("user", JSON.stringify(user), { path: "/" });

    // Setting user in the state and redirecting to the response page
    setUser(user);
    navigate("/response");
  };

  // LOGOUT function to remove tokens and user from cookies
  const logout = () => {
    // Removing cookies to log the user out
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    removeCookie("user", { path: "/" });

    // Setting user state to null to log the user out
    setUser(null);

    // Redirecting to the home page after logout
    navigate("/");
  };

  // REFRESH function to refresh the access token using the refresh token
  const refresh = async () => {
    // Making a request to the server to refresh the access token
    const response = await fetch(`${server_url}/auth/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.refreshToken}`, // Using the refresh token for authorization
      },
    });

    // If refresh fails, log out the user
    if (!response.ok) {
      const data = await response.json();
      console.error("Token refresh failed:", data.message);
      logout();
      return;
    }

    // If refresh is successful, get the new access token and update the cookie
    const data = await response.json();
    const { access_token } = data;

    // Update the access token in cookies
    setCookie("accessToken", access_token, { path: "/" });
  };

  // SIGNUP function to register a new user
  const signUp = async (email: string, password: string, role: string) => {
    // Making a POST request to the server to register the user
    const response = await fetch(`${server_url}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    // If signup fails, log the error
    if (!response.ok) {
      const data = await response.json();
      console.error("Signup failed", data.message);
      return;
    }

    // Extracting tokens and user data from the response
    const data = await response.json();
    const { access_token, refresh_token, user } = data;

    // Storing tokens and user info in cookies
    setCookie("accessToken", access_token, { path: "/" });
    setCookie("refreshToken", refresh_token, { path: "/" });
    setCookie("user", JSON.stringify(user), { path: "/" });

    // Setting user in the state and redirecting to the response page
    setUser(user);
    navigate("/response");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refresh, signUp, isLoading }}
    >
      {/* If still loading, show the loader, else render the children */}
      {!isLoading ? children : <Loader />}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
