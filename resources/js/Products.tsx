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
    const url = "http://localhost:8000/api/products";
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json();
        })
        .then(data => {
            const productsContainer = document.querySelector("#tableProducts");

            productsContainer.innerHTML = '';

            data.forEach((product) => {
                const div = document.createElement('div');
                div.className = 'products';

                const divImg = document.createElement('div');
                divImg.className = 'imgProducts';

                const img = document.createElement('img');
                //img.src = product.image;
                img.src = "image/fruits/apple.png";
                divImg.appendChild(img);

                const divText = document.createElement('div');
                divText.className = 'textProducts';
                divText.textContent = product.title;

                const divPrice = document.createElement('div');
                divPrice.className = 'priceProducts';
                divPrice.textContent = product.price + "р / " + product.weight;

                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'buttonsProducts';
                const addCartButton = document.createElement('button');
                addCartButton.className = 'addCart';
                addCartButton.textContent = 'Добавить в корзину';
                const aboutButton = document.createElement('button');
                aboutButton.className = 'aboutProducts';
                aboutButton.textContent = 'Подробнее';

                buttonsDiv.appendChild(addCartButton);
                buttonsDiv.appendChild(aboutButton)

                div.appendChild(divImg);
                div.appendChild(divText);
                div.appendChild(divPrice);
                div.appendChild(buttonsDiv);

                productsContainer.appendChild(div);
            })
        })
        .catch(error => {
            console.log(error);
        })
    return (
        <>
            <Header/>
            <div id={"search"}>
                <div id={"inputSearch"}>
                    <input placeholder={"Поиск"} type={"search"} autoComplete={"off"}/>
                    <button type={"submit"} className={"searchIcon"}><span className="material-symbols-outlined">search</span></button>
                </div>
            </div>
            <div id={"filter"}>
                <h1>Фильтрация по:</h1>

            </div>
            <div id={"tableProducts"}>

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
