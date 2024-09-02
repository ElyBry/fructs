import * as React from 'react';

export default () => {
    const year = new Date().getFullYear();
    const numberPhone: String = '+7 (999) 999-99-99';
    const email: String = 'email@top.ru';
    return  (
        <footer>
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
            <p>&copy; Фруктовый мир {year}. Все права защищены</p>
        </footer>
    );
}
