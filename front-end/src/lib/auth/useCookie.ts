// import Cookies from 'js-cookie';
import { useCookies } from 'next-client-cookies';
export const useCookie = () => {
    const Cookies = useCookies();
    const setSessionCookie = (session: any): void => {
        Cookies.set('user', JSON.stringify(session), { expires: 1});
    };
    
    const getSessionCookie = (): string => {
        const sessionCookie = Cookies.get('user');
        if (sessionCookie === undefined) {
            return '';
        } else {
            return (sessionCookie);
        }
    };
    
    const removeSessionCookie: any = () => {
        Cookies.remove('user');
    };

    return {setSessionCookie, getSessionCookie, removeSessionCookie};
}