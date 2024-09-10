// @ts-ignore
import React, {useEffect, useRef} from 'react';
import * as ReactDOM from 'react-dom/client';
import Footer from "./components/_footer.js";
import Header from "./components/_header.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const random = gsap.utils.random;

gsap.registerPlugin(ScrollTrigger);

const Products: React.FC = () => {


    return (
        <>
            <Header/>
            <div id={"search"}>
                <div id={"inputSearch"}>
                    <input placeholder={"Поиск"}/>
                </div>
                <div id={"buttonSearch"}>
                    <button>Найти</button>
                </div>
            </div>
            <div id={"tableProducts"}>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
                <div className={"products"}>
                    <div className={"imgProducts"}>
                        <img src={"image/fruits/apple.png"}/>
                    </div>
                    <div className={"textProducts"}>
                        Яблоко
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}>Добавить в корзину</button>
                        <button className={"aboutProducts"}>Подробнее</button>
                    </div>
                </div>
            </div>
            <div className={"block"}>
                <Footer/>
            </div>
        </>
    )
};


const rootElement: HTMLElement = document.getElementById('root');
if (rootElement) {
    const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);
    root.render(<Products/>);
}
