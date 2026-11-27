"use client";
import { User, UserLoginResponse, UserSignupResponse } from "@/types/user";
import axios from "axios";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLoading } from "./loadingContext";

type AuthContext = {
  user: User | null;
  signup: (
    username: string,
    email: string,
    password: string,
  ) => Promise<UserSignupResponse>;
  login: (username: string, password: string) => Promise<UserLoginResponse>;
};

const AuthContext = createContext<AuthContext | null>(null);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const { setLoading } = useLoading();

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
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, signup, login }}>
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
