import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import * as ReactDOM from 'react-dom/client';
import Footer from "./components/_footer.js";
import Header from "./components/_header.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const random = gsap.utils.random;

gsap.registerPlugin(ScrollTrigger);

const Products: React.FC = () => {
    const [isSearch, setIsSearch] = useState(true);
    const urlProducts = "http://localhost:8000/api/products";
    const inputRef = useRef(null);
    let minPrice = 0;
    let maxPrice = 0;

    fetch(urlProducts)
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
                if (product.availability == 0) {

                }
                const div = document.createElement('div');
                div.className = 'products';

                const divImg = document.createElement('div');
                divImg.className = 'imgProducts';

                const img = document.createElement('img');
                img.src = product.img;
                //img.src = "image/fruits/apple.png";
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
    const toggleSearch = () => {
        setIsSearch(!isSearch);
        if (!isSearch) {
            inputRef.current.focus();
        }
    }
    return (
        <>
            <Header/>
            <div id={"search"}>
                <div id={"inputSearch"} className={isSearch ? "searching" : ""}>
                    <input placeholder={"Поиск"} type={"search"} autoComplete={"off"} ref={inputRef}/>
                    <button type={"submit"} className={"searchIcon"} onClick={toggleSearch}><span className="material-symbols-outlined">search</span></button>
                </div>
            </div>
            <div id={"main"}>
                <div className={"content"}>
                    <div id={"filter"}>
                        <h2>Цена:</h2>
                        <label>От</label>
                        <input type={"number"} name={"minPrice"} value={minPrice}/>
                        <label>До</label>
                        <input type={"number"} name={"maxPrice"} value={maxPrice}/>
                        <h2>Страна:</h2>
                        <div id={"countries"}></div>
                        <h2>Тип:</h2>
                        <label><input type={"checkbox"} name={"type"} value={"fruits"}/>Фрукты</label>
                        <label><input type={"checkbox"} name={"type"} value={"vegetables"}/>Овощи</label>
                        <label><input type={"checkbox"} name={"type"} value={"fruits"}/>Фрукты</label>
                        <h2>Цвет:</h2>
                        <div id={"colors"}></div>
                    </div>
                    <div id={"tableProducts"}>
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
