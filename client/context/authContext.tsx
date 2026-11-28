"use client";
import { User, UserLoginResponse, UserSignupResponse } from "@/types/user";
import axios from "axios";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLoading } from "./loadingContext";
import { useRouter } from "next/navigation";

type AuthContext = {
  user: User | null;
  signup: (
    username: string,
    email: string,
    password: string,
  ) => Promise<UserSignupResponse>;
  login: (username: string, password: string) => Promise<UserLoginResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContext | null>(null);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const { setLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const response = await axios.get("http://localhost:3001/app/v1/user/me", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setLoading(false);
      setUser(response.data.user);
    }

    if (localStorage.getItem("token")) {
      getUser();
    } else {
      console.log("You are not logged in");
    }
  }, [setLoading]);

  async function signup(username: string, email: string, password: string) {
    const response = await axios.post(
      "http://localhost:3001/app/v1/user/signup",
      { username, email, password },
    );
    return response.data;
  }

  async function login(username: string, password: string) {
    const response = await axios.post(
      "http://localhost:3001/app/v1/user/login",
      { username, password },
    );
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    setLoading(false);
    return response.data;
  }

  function logout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within the AuthContextProvider");
  }
  return context;
}
