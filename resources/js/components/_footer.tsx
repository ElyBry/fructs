import * as React from 'react';

import styles from "../../sass/_layoutFooter.module.scss"

export default () => {
    const year = new Date().getFullYear();
    const numberPhone: String = '+7 (999) 999-99-99';
    const email: String = 'email@top.ru';
    return (
        <div id={"bgFooter"} className={styles.bgFooter}>
            <div className={styles.content}>
                <footer>
                    <div>
                        <h2>Ссылки</h2>
                        <a>Заказать фрукты</a>
                        <a>Гарантия</a>
                        <a>О нас</a>
                        <a>Отзывы</a>
                        <a>Статистика</a>
                        <a>Наши плюсы</a>
                    </div>
                    <div>
                        <h2>Контакты</h2>
                        <a href={"tel:" + numberPhone}>{numberPhone}</a>
                        <a href={"email:" + email}>{email}</a>
                    </div>
                    <div>
                        <h2>Адреса наших точек</h2>
                        <a>г.Екатеринбург, Улица 16</a>
                    </div>
                    <div>
                        <h2>Юридическая информация</h2>
                        <a>Условия пользования</a>
                        <a>Права потребителей</a>
                    </div>
                    <p>&copy; Фруктовый мир {year}. Все права защищены<br/>by ElyBry</p>
                </footer>
            </div>

        </div>
    );
}
