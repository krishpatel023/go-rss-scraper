"use client";

import { deleteCookie, getCookie } from "@/app/actions/cookies";
import { AUTH_TOKEN_NAME } from "@/lib/axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";

// Define User Type
interface User {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
}

// Define Auth Context Type
interface AuthContextType {
  userData: User | null;
  isAuthenticated: boolean;
  signin: (user: User) => void;
  signout: () => void;
  isLoading: boolean;
}

// Create Context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      const token = await getCookie(AUTH_TOKEN_NAME);
      const storedUser = localStorage.getItem("userData");
      if (token && storedUser) {
        setUserData(JSON.parse(storedUser));
        setIsAuthenticated(true);
        return;
      }

      if (token) {
        deleteCookie(AUTH_TOKEN_NAME);
        setIsAuthenticated(false);
        return;
      }
      if (storedUser) {
        localStorage.removeItem("userData");
        return;
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  // Sign-in function
  const signin = (user: User) => {
    setUserData(user);
    setIsAuthenticated(true);
    localStorage.setItem("userData", JSON.stringify(user)); // Persist session
  };

  // Sign-out function
  const signout = () => {
    deleteCookie(AUTH_TOKEN_NAME);
    setIsAuthenticated(false);
    toast.success("Signed out successfully");
  };

  return (
    <AuthContext.Provider
      value={{ userData, isAuthenticated, signin, signout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
