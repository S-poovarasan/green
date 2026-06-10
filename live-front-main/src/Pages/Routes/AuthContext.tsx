import type { FileData } from "@/Interfaces/CommonInterface";
import { decrypt } from "@/lib/Helper";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const RoleList = [
  { type: "admin", id: 1 },
  { type: "headtrainer", id: 2 },
  { type: "subtrainer", id: 3 },
  { type: "student", id: 4 },
] as const;

export type Role = (typeof RoleList)[number] | null;

export type UserRole = (typeof RoleList)[number]["type"];

// ✅ API Response interface
export interface UserProfile {
  refUserId: number;
  refUserName: string;
  refUserRTId: number;
  refUserProfile: string;
  profileImgFile: FileData | null;
  refUserCustId: string;
}

// ✅ Context Type
interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  loading: boolean;
  refreshToken: () => Promise<void>; // <-- Add this
}

// ✅ Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRoleState] = useState<Role>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const refreshToken = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/profile/user`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res);

      if (
        res.data.error == "Invalid token" ||
        res.data.error == "Missing token"
      ) {
        localStorage.clear();
        navigate("/");
      } else {
        const decryptData = decrypt(res.data.data, res.data.token);
        console.log(decryptData);
        const profile: UserProfile = decryptData.data;
        setUser(profile);
        localStorage.setItem("token", res.data.token);

        const matchedRole =
          RoleList.find((r) => r.id === profile.refUserRTId) || null;
        setRole(matchedRole);

        // Removed automatic redirection to allow manual login
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  // const logout = () => {
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   navigate("/");
  // };

  // useIdleLogout(refreshToken, logout);

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ role, setRole, user, setUser, loading, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to consume context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
