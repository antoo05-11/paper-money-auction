'use client';
import { useEffect } from "react";
import { useSessionUser } from "./useUser";
import { useCookie } from "./useCookie";
import { User } from "../constant/dataInterface";

export const useAuth = () => {
  const { user, addUser, removeUser, setUser } = useSessionUser();
  const {setSessionCookie, getSessionCookie, removeSessionCookie} = useCookie();

  const refresh = () => {
    let existingUser = null;
    const getFromCookie = async () => (existingUser = getSessionCookie());
    getFromCookie();

    if (existingUser) {
      try {
        addUser((existingUser));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const login = (user: User) => {
    addUser(user);
  };

  const logout = () => {
    removeUser();
  };

  return { user, login, logout, setUser, refresh };
};