import * as React from 'react';
import {HashRouter as Router, Route, Link, useLocation} from "react-router-dom";

import styles from "../../../sass/_layoutHeader.module.scss"
import {useEffect, useRef, useState} from "react";

import {userIsAuth, userRole} from "../User/userAtom";
import User from "../User/user";

import {useRecoilState} from "recoil";

import axios from "axios";
import {isOpenBurgerMenu} from "./HeaderAtom";

export default ({className}) => {
    const [isAuth, setIsAuth] = useRecoilState( userIsAuth );
    const [roles, setRoles] = useState(userRole);
    const {checkRole, checkAuthAndGetRole} = User();
    const [loadingLogout, setLoadingLogout] = useState(false);

    useEffect(() => {
        checkAuthAndGetRole();
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
        axios.post(`${window.location.origin}/api/auth/logout`)
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

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [openBurgerMenu, setOpenBurgerMenu] = useRecoilState( isOpenBurgerMenu );

    useEffect(() => {
        if (openBurgerMenu) {
            document.body.classList.add(styles.noScroll);
        } else {
            document.body.classList.remove(styles.noScroll);
        }
    }, [openBurgerMenu]);

    useEffect(() => {
        setTimeout(() => {
            setOpenBurgerMenu(false);
        }, 100)
    }, []);

    return  (
        <>
            <div className={`${styles.burgerMenu} ${openBurgerMenu ? styles.visible : ""}`}>
                <nav>
                    <ul>
                        {isAuth ?
                            <>
                                {checkRole(['Super Admin', 'Admin', 'Manager']) && (
                                    <>
                                        <li className={styles.hSection} onClick={toggleMenu}>
                                            Админ Панель
                                        </li>
                                        {isOpen && (
                                            <ul>
                                                <li>
                                                    <Link to={"/admin/orders"}>
                                                        <div className={styles.hSection}>Заказы</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={"/admin/tradePoints"}>
                                                        <div className={styles.hSection}>Точки</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={"/admin/typeProducts"}>
                                                        <div className={styles.hSection}>Типы продуктов</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={"/admin/users"}>
                                                        <div className={styles.hSection}>Пользователи</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={"/admin/products"}>
                                                        <div className={styles.hSection}>Продукты</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={"/admin/feedbacksProducts"}>
                                                        <div className={styles.hSection}>Отзывы о продуктах</div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={"/admin/feedbacks"}>
                                                        <div className={styles.hSection}>Отзывы о приложении</div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        )}
                                    </>
                                )}
                                <li>
                                    <Link to={"/products"}>
                                        <div className={styles.hSection}>Заказать продукты</div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/orders"}>
                                        <div className={styles.hSection}>Заказы</div>
                                    </Link>
                                </li>
                                <li>
                                    <div onClick={() => logout()} className={styles.hSection}>Выйти</div>
                                </li>
                            </>
                            :
                            <>
                            <li>
                                    <Link to={"/products"}>
                                        <div className={styles.hSection}>Заказать продукты</div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/#guaranteeBlock"}>
                                        <div className={styles.hSection}>Гарантия</div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/#faqBlock"}>
                                        <div className={styles.hSection}>FAQ</div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/login"}>
                                        <div className={styles.hSection}>Войти</div>
                                    </Link>
                                </li>
                            </>
                        }
                    </ul>
                </nav>
            </div>
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
                            {checkRole(['Super Admin', 'Admin', 'Manager']) && (
                                <div className={styles.dropdown}>
                                    <div className={styles.hSection} onClick={toggleMenu}>
                                        Админ Панель
                                    </div>
                                    {isOpen && (
                                        <div className={styles.dropdownContent}>
                                            <Link to={"/admin/orders"}>
                                                <div className={styles.hSection}>Заказы</div>
                                            </Link>
                                            <Link to={"/admin/users"}>
                                                <div className={styles.hSection}>Пользователи</div>
                                            </Link>
                                            <Link to={"/admin/products"}>
                                                <div className={styles.hSection}>Продукты</div>
                                            </Link>
                                            <Link to={"/admin/feedbacksProducts"}>
                                                <div className={styles.hSection}>Отзывы о продуктах</div>
                                            </Link>
                                            <Link to={"/admin/feedbacks"}>
                                                <div className={styles.hSection}>Отзывы о приложении</div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                            <Link to={"/products"}>
                                <div className={styles.hSection}>Заказать продукты</div>
                            </Link>
                            <Link to={"/orders"}>
                                <div className={styles.hSection}>Заказы</div>
                            </Link>
                            <div onClick={() => logout()} className={styles.hSection}>Выйти</div>
                        </div>
                        <div id={"burger"} className={styles.burger}>
                            <div className={`${styles.burgerImg} ${openBurgerMenu ? styles.visible : ""}`}
                                 onClick={() => setOpenBurgerMenu(!openBurgerMenu)}
                            >
                                <img src={"../../image/icons/elements/burger-menu-right.svg"}/>
                            </div>
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
                            <div className={`${styles.burgerImg} ${openBurgerMenu ? styles.visible : ""}`}
                                 onClick={() => setOpenBurgerMenu(!openBurgerMenu)}
                            >
                                <img src={"../../image/icons/elements/burger-menu-right.svg"}/>
                            </div>
                        </div>
                    </>

                }
            </header>
        </>

    );
}

