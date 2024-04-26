import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '../constant/dataInterface';
import { AuthContext } from './AuthContext';
import { useCookie } from './useCookie';

export const useSessionUser = () => {
    const {user, setUser } = useContext(AuthContext);
    const {setSessionCookie, getSessionCookie, removeSessionCookie} = useCookie();
    const addUser = (userData: User) => {
        // console.log(userData);
        setSessionCookie(userData);
        setUser((userData));
    }
    const removeUser = () => {
        setUser(null);
        removeSessionCookie();
    }

    useEffect(() => {
        console.log(user); // This will log the updated user after setUser
    }, [user]);

    return {user, addUser, removeUser, setUser};
}
