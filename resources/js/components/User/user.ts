import { useRecoilState } from 'recoil';
import {userIsAuth, userRole, User} from "./userAtom";
import {useEffect} from "react";

const useR = () => {
    const [isAuth, setIsAuth] = useRecoilState( userIsAuth );
    const [role, setRole] = useRecoilState(userRole);
    const [user, setUser] = useRecoilState(User)
    const checkRole = (requiredRoles: string[]) => {
        return isAuth && requiredRoles.includes(role);
    }
    const checkAuthAndGetRole = () => {
        const cookies = document.cookie.split('; ');
        const isAuthenticated = cookies.some(cookie => cookie.startsWith('is_authenticated='));
        if (isAuthenticated) setIsAuth(true);
        else return false;
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUser(user);
            if (user.roles[0]){
                const role = user.roles[0].name;
                setRole(role);
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    return {checkRole, checkAuthAndGetRole}
}

export default useR;
