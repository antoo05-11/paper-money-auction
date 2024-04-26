import { useEffect } from "react";
import { useSessionUser } from "./useUser";
import { useCookie } from "./useCookie";
import { User } from "../constant/dataInterface";

export const useAuth = () => {
  // we can re export the user methods or object from this hook
  const { user, addUser, removeUser, setUser } = useSessionUser();
  const {setSessionCookie, getSessionCookie, removeSessionCookie} = useCookie();

  useEffect(() => {
    const user = getSessionCookie();
    if (user) {
      addUser(JSON.parse(user));
    }
  }, [addUser, getSessionCookie]);

  const login = (user: User) => {
    addUser(user);
  };

  const logout = () => {
    removeUser();
  };

  return { user, login, logout, setUser };
};