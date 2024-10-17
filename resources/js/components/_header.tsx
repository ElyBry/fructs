import * as React from 'react';
import {HashRouter as Router, Route, Link, useLocation} from "react-router-dom";

import styles from "../../sass/_layoutHeader.module.scss"
import {useEffect, useRef, useState} from "react";
import {userAuth} from "./User/userAtom";
import {useRecoilState} from "recoil";
import axios from "axios";

export default ({className}) => {
    const [isAuth, setIsAuth] = useRecoilState( userAuth );
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [roles, setRoles] = useState<string[]>([])

    const checkRole = (requiredRoles: string[]) => {
        return Array.isArray(roles) && requiredRoles.some((role) => roles.includes(role));
    }

    useEffect(() => {
        const cookies = document.cookie.split('; ');
        const isAuthenticated = cookies.some(cookie => cookie.startsWith('is_authenticated='));
        if (isAuthenticated) setIsAuth(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const roles = user.roles.map(role => role.name);
        setRoles(roles);
    }, []);

    const location = useLocation();
    const lastHash = useRef('');

    useEffect(() => {
        if (location.hash) {
            lastHash.current = location.hash.slice(1);
        }

        if (lastHash.current && document.getElementById(lastHash.current)) {
            setTimeout(() => {
                document
                    .getElementById(lastHash.current)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                lastHash.current = '';
            }, 100);
        }
    }, [location]);

    const logout = () => {
        setLoadingLogout(true);
        axios.post('api/auth/logout')
            .then(response => {
                document.cookie = "is_authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                setIsAuth(false);
                setLoadingLogout(false);
            })
            .catch(e => {
                console.error(e);
                setLoadingLogout(false);
            })
    }

    return  (
        <header className={`${styles.header} ${className}`}>
            <Link to={"/"}>
                <div id={"logo"} className={styles.logo}>
                    <img src={"../../image/logos/logo.png"} alt={"Доставка фруктов"}/>
                    Фруктовый мир
                </div>
            </Link>
            {isAuth ?
                <>
                    <div id={"hHead"} className={styles.hHead}>
                        {checkRole(['Super Admin', 'Admin', 'Manager'])
                            ?
                            <>
                                <Link to={"/admin/orders"}>
                                    <div className={styles.hSection}>Заказы</div>
                                </Link>
                            </>
                            : ""}
                        <Link to={"/products"}>
                            <div className={styles.hSection}>Заказать продукты</div>
                        </Link>
                        <Link to={"/orders"}>
                            <div className={styles.hSection}>Заказы</div>
                        </Link>
                        <div onClick={() => logout()} className={styles.hSection}>Выйти</div>
                    </div>
                    <div id={"burger"} className={styles.burger}>
                        <img src={"../../image/icons/elements/burger-menu-right.svg"}/>
                    </div>
                </>
                :
                <>
                    <div id={"hHead"} className={styles.hHead}>
                        <Link to={"/products"}>
                            <div className={styles.hSection}>Заказать продукты</div>
                        </Link>
                        <Link to={"/#guaranteeBlock"}>
                            <div className={styles.hSection}>Гарантия</div>
                        </Link>
                        <Link to={"/#faqBlock"}>
                            <div className={styles.hSection}>FAQ</div>
                        </Link>
                        <Link to={"/login"}>
                            <div className={styles.hSection}>Войти</div>
                        </Link>
                    </div>
                    <div id={"burger"} className={styles.burger}>
                        <img src={"../../image/icons/elements/burger-menu-right.svg"}/>
                    </div>
                </>

            }

        </header>
    );
}

