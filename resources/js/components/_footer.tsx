import * as React from 'react';

import styles from "../../sass/_layoutFooter.module.scss"
import axios from "axios";
import {useEffect, useState} from "react";

export default () => {
    const year = new Date().getFullYear();
    const numberPhone: String = '+7 902 400-07-06';
    const [tradingPoint, setTradingPoint] = useState([]);
    const [loadingTradingPoints , setLoadingTradingPoints] = useState(false);
    const fetchTradingPoints = async () => {
        if (tradingPoint.length > 0) return;
        try {
            setLoadingTradingPoints(true);
            const response = await axios.get('api/tradingPoints');
            const data = response.data.data;
            if (data) {
                setTradingPoint(data);
            } else {
                setTradingPoint([]);
            }

            setLoadingTradingPoints(false);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchTradingPoints()
    }, []);

    return (
        <div id={"bgFooter"} className={styles.bgFooter}>
            <div className={styles.content}>
                <footer>
                    <div>
                        <h2>Контакты</h2>
                        <a href={"tel:" + numberPhone}>{numberPhone}</a>
                    </div>
                    <div>
                        <h2>Адреса наших точек</h2>
                        {loadingTradingPoints ?
                            <a>Загрука</a>
                            :
                            tradingPoint.length == 0 ?
                                <a>Не найдено</a>
                                :
                                tradingPoint.map(point => (
                                    <a href="https://yandex.ru/maps/54/yekaterinburg/?from=mapframe&l=sat&ll=60.629335%2C56.823529&mode=usermaps&source=mapframe&um=constructor%3A54703ffb231a6d94c85c37a22254eb22e5cb2205453236d6681278ad1c399eb3&utm_source=mapframe&z=12" key={point.name}>
                                        {point.address}
                                    </a>
                                ))
                        }
                    </div>
                    <p>&copy; Фруктовый мир {year}. Все права защищены<br/>by ElyBry</p>
                </footer>
            </div>
        </div>
    );
}
