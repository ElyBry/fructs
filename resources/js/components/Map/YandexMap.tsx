import * as React from 'react';
import { useEffect } from 'react';

const YandexMap = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A54703ffb231a6d94c85c37a22254eb22e5cb2205453236d6681278ad1c399eb3&width=100%&height=100%&lang=ru_RU&scroll=true";
        script.async = true;
        script.type = "text/javascript";

        document.getElementById('yMap').appendChild(script);
    }, []);

    return (
        <div id="yMap" style={{width: "100%", height: "90%"}}>
            Зона доставки и точки
        </div>
    );
};

export default YandexMap;
