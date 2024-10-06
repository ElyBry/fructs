import * as React from 'react';
import {Link} from "react-router-dom";

export default () => {
    return  (
        <header>
            <Link to={"/"}>
                <div id={"logo"}>
                    <img src={"../../image/logos/logo.png"} alt={"Доставка фруктов"}/>
                    Фруктовый мир
                </div>
            </Link>

            <div id={"hHead"}>
                <Link to={"/products"}>
                    <div className={"hSection"}>Заказать продукты</div>
                </Link>
                <div className={"hSection"}>Гарантия</div>
                <div className={"hSection"}>О нас</div>
                <Link to={"/login"}>
                    <div className={"hSection"}>Войти</div>
                </Link>
            </div>
            <div id={"burger"}>
                <img src={"../../image/icons/elements/burger-menu-right.svg"}/>
            </div>
        </header>
    );
}

