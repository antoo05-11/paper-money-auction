'use client';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '../constant/dataInterface';
import { AuthContext } from './AuthContext';
import { useCookie } from './useCookie';

export const useSessionUser = () => {
    const {user, setUser } = useContext(AuthContext);
    const {setSessionCookie, getSessionCookie, removeSessionCookie} = useCookie();
    const addUser = (userData: User) => {
        setSessionCookie(userData);
        setUser((userData));        
    }
    const removeUser = () => {
        setUser(null);
        removeSessionCookie();
    }

    return {user, addUser, removeUser, setUser};
}
