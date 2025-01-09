import {useRecoilValue} from "recoil";
import {userIsAuth, userRole} from "./userAtom";
import {useEffect} from "react";
import User from "./user";
import {useNavigate} from "react-router-dom";

const useAuthCheck = (requiredRoles: string[]) => {
    const isAuth = useRecoilValue( userIsAuth );
    const roles = useRecoilValue(userRole);
    const {checkRole} = User();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth && !checkRole(requiredRoles)) {
            navigate('/login');
        }
    }, [roles, isAuth]);
}

export default useAuthCheck;
