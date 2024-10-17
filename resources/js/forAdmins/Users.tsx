import * as React from "react";

import styles from '../../sass/_componentsForAdminUsers.module.scss'

import Header from "../components/_header";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userIsAuth, userRole} from "../components/User/userAtom";
import User from "../components/User/user";

const Users = () => {
    const [isAuth, setIsAuth] = useRecoilState( userIsAuth );
    const [roles, setRoles] = useState(userRole);
    const {checkRole, checkAuthAndGetRole} = User();

    const navigate = useNavigate();
    useEffect(() => {
        if (!checkRole) {
            navigate('/login');
        }
    }, []);


    return (
        <>
            <Header className={styles.header}/>
            <div className={styles.users}>

            </div>
        </>
    )
}

export default Users
