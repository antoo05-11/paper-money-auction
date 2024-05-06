'use client';
import { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "../constant/dataInterface";
import { useCookie } from "./useCookie";

interface IAuthContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const { getSessionCookie } = useCookie();

  useEffect(() => {
    if (!user) {
      let existingUser = null;
      const getFromCookie = async () => (existingUser = getSessionCookie());
      getFromCookie();

      if (existingUser) {
        try {
          setUser(JSON.parse(existingUser));
        } catch (e) {
          console.log(e);
        }
      }
    }
    if (user && !getSessionCookie()) {
      setUser(null);
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};