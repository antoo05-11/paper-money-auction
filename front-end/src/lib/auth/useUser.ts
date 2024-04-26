import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { sessionData } from '../constant/dataInterface';


const defaultAuthState = {
    session: null,
    login: () => {},
    logout: () => {}
};

export const SessionUser = () => {

    const SessionContext = React.createContext(defaultAuthState);

    export const useSession = () => useContext(SessionContext);
    const [session, setSession] = useState(getSessionCookie());
    useEffect(
    () => {
        const initSession = getSessionCookie();
        setSession(initSession);
    },[]);
    const login = (userData: sessionData) => {
        setSession(userData);
    }
    const logout = () => {
        setSession(null);
    }

    return {session, login, logout};
}
