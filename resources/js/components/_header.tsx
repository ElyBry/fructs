import * as React from 'react';
import {Link} from "react-router-dom";

import styles from "../../sass/_layoutHeader.module.scss"

export default () => {
    return  (
        <header className={styles.header}>
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
                <div className={styles.hSection}>Гарантия</div>
                <div className={styles.hSection}>О нас</div>
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

