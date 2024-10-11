import * as React from 'react';
import {HashRouter as Router, Route, Link, useLocation} from "react-router-dom";

import styles from "../../sass/_layoutHeader.module.scss"
import {useEffect, useRef} from "react";

export default ({className}) => {
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

    return  (
        <header className={`${styles.header} ${className}`}>
            <Link to={"/"}>
                <div id={"logo"} className={styles.logo}>
                    <img src={"../../image/logos/logo.png"} alt={"Доставка фруктов"}/>
                    Фруктовый мир
                </div>
            </Link>
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
        </header>
    );
}

