import Cookies from 'js-cookie';
import React from 'react';

export const setSessionCookie = (session: any): void => {
    Cookies.set('access_token', session.token);
    Cookies.set('user', JSON.stringify(session.user), { expires: 1});
};

export const getSessionCookie: any = () => {
    const sessionCookie = Cookies.get('user');
    if (sessionCookie === undefined) {
        return {};
    } else {
        return (sessionCookie);
    }
};

export const removeSessionCookie: any = () => {
    Cookies.remove('access_token');
    Cookies.remove('user');
};


export const SessionContext = React.createContext(getSessionCookie());
