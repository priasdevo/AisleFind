"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { IUserContext } from "./types";

const UserContext = createContext<IUserContext>({} as IUserContext);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const validateToken = async () => {
      try {
        const res = await fetch(
          process.env["NEXT_PUBLIC_GATEWAY_URL"] + "/user/auth/user",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setEmail(data.username);
          setRole(data.role);
          setIsLogin(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (token) validateToken();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setEmail("");
    setIsLogin(false);
  };

  return (
    <UserContext.Provider
      value={{ email, setEmail, isLogin, setIsLogin, logout, role, setRole }}
    >
      {children}
    </UserContext.Provider>
  );
};
