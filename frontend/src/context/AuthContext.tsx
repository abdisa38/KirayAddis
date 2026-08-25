import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../api/client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "tenant" | "landlord" | "admin";
  avatar?: string;
  isEmailVerified: boolean;
  verificationTier: "unverified" | "phone_verified" | "id_verified" | "property_verified";
  preferences?: {
    workplace?: string;
    budgetMax?: number;
    maxCommuteMin?: number;
    mustHaveAmenities?: string[];
  };
  savedProperties?: any[];
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (name: string, email: string, password: string, role: string, phone?: string) => Promise<UserProfile>;
  logout: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("addis_kiray_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("addis_kiray_token");
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await apiRequest("/auth/me");
        if (data.success && data.user) {
          const profile: UserProfile = {
            id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role,
            avatar: data.user.avatar,
            isEmailVerified: data.user.isEmailVerified,
            verificationTier: data.user.verificationTier,
            preferences: data.user.preferences,
            savedProperties: data.user.savedProperties,
          };
          setUser(profile);
          localStorage.setItem("addis_kiray_user", JSON.stringify(profile));
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.success && data.token) {
      setToken(data.token);
      localStorage.setItem("addis_kiray_token", data.token);

      const profile: UserProfile = {
        id: data.user.id || data.user._id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role,
        avatar: data.user.avatar,
        isEmailVerified: data.user.isEmailVerified,
        verificationTier: data.user.verificationTier,
        preferences: data.user.preferences,
        savedProperties: data.user.savedProperties,
      };

      setUser(profile);
      localStorage.setItem("addis_kiray_user", JSON.stringify(profile));
      return profile;
    }
    throw new Error(data.message || "Login failed");
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
    phone?: string
  ): Promise<UserProfile> => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role, phone }),
    });

    if (data.success && data.token) {
      setToken(data.token);
      localStorage.setItem("addis_kiray_token", data.token);

      const profile: UserProfile = {
        id: data.user.id || data.user._id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role,
        isEmailVerified: data.user.isEmailVerified,
        verificationTier: data.user.verificationTier,
        preferences: data.user.preferences,
      };

      setUser(profile);
      localStorage.setItem("addis_kiray_user", JSON.stringify(profile));
      return profile;
    }
    throw new Error(data.message || "Registration failed");
  };


  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("addis_kiray_token");
    localStorage.removeItem("addis_kiray_user");
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated };
    setUser(newProfile);
    localStorage.setItem("addis_kiray_user", JSON.stringify(newProfile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
