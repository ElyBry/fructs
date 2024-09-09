import * as React from 'react';

export default () => {
    return  (
        <header>
            <div id={"logo"}>
                <img src={"../../image/logos/logo.png"} alt={"Доставка фруктов"}/>
                Фруктовый мир
            </div>
            <div id={"hHead"}>
                <div className={"hSection"}>Заказать продукты</div>
                <div className={"hSection"}>Гарантия</div>
                <div className={"hSection"}>О нас</div>
                <div className={"hSection"}>Войти</div>
            </div>
            <div id={"burger"}>
                <img src={"../../image/icons/elements/burger-menu-right.svg"}/>
            </div>
        </header>
    );
}

