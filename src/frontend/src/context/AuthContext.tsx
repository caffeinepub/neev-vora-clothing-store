import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  whatsappNumber: string;
  password: string;
}

interface AuthContextType {
  currentUser: User | null;
  signup: (data: Omit<User, "id">) => { success: boolean; error?: string };
  login: (
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("me_users") || "[]");
    } catch {
      return [];
    }
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("me_current_user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("me_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("me_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  const signup = (data: Omit<User, "id">) => {
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }
    const newUser: User = { ...data, id: crypto.randomUUID() };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!user) return { success: false, error: "Invalid email or password." };
    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
