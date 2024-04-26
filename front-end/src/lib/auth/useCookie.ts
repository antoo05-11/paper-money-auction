import Cookies from 'js-cookie';
export const useCookie = () => {
    const setSessionCookie = (session: any): void => {
        Cookies.set('access_token', session.token);
        Cookies.set('user', JSON.stringify(session.user), { expires: 1});
    };
    
    const getSessionCookie: any = () => {
        const sessionCookie = Cookies.get('user');
        if (sessionCookie === undefined) {
            return {};
        } else {
            return (sessionCookie);
        }
    };
    
    const removeSessionCookie: any = () => {
        Cookies.remove('access_token');
        Cookies.remove('user');
    };

    return {setSessionCookie, getSessionCookie, removeSessionCookie};
}