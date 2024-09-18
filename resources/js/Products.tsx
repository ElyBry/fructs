import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import * as ReactDOM from 'react-dom/client';
import Footer from "./components/_footer.js";
import Header from "./components/_header.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
const random = gsap.utils.random;

gsap.registerPlugin(ScrollTrigger);
const Products: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [isSearch, setIsSearch] = useState(true);
    const inputRef = useRef(null);
    let minPrice = 0;
    let maxPrice = 0;

    const fetchProducts = async (pageNumber: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/products?page=${pageNumber}`);
            const newData = response.data;

            setProducts((prev) => [...prev, ...newData.data]);
            setHasMore(newData.current_page < newData.last_page);
        } catch (error) {
            console.error("Ошибка получения данных: ", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() =>{
        fetchProducts(page);
    }, [page]);
    useEffect(() => {
        const tableProducts:HTMLElement = document.querySelector('#root');

        const handleScroll = () => {
            const scrollTop = tableProducts.scrollTop;
            const tableHeight = tableProducts.offsetHeight;

            if ((scrollTop >= tableHeight * 0.75) && hasMore && !loading) {
                setPage((prev) => prev + 1);
            }

            // Для отладки
            //console.log(scrollTop, tableHeight);
        };

        if (tableProducts) {
            tableProducts.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (tableProducts) {
                tableProducts.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore, loading])

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
                        <input type={"number"} name={"minPrice"} defaultValue={minPrice}/>
                        <label>До</label>
                        <input type={"number"} name={"maxPrice"} defaultValue={maxPrice}/>
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
                        {products.map((product) => (
                            <div key={product.id} className={"products"}>
                                <div className={"imgProducts"}>
                                    <img src={product.img}/>
                                </div>
                                <div className={"textProducts"}>
                                    {product.title}
                                </div>
                                <div className={"priceProducts"}>
                                    {product.price} р / {product.weight};
                                </div>
                                <div className={"buttonsProducts"}>
                                    <button className={"addCart"}>Добавить в корзину</button>
                                    <button className={"aboutProducts"}>Подробнее</button>
                                </div>
                            </div>
                        ))}
                        {loading && [...Array(12)].map((_, index) => (
                            <div key={index} className={"products"}>
                                <div className={"imgProducts gray"}></div>
                                <div className={"textProducts gray"}></div>
                                <div className={"priceProducts gray"}></div>
                                <div className={"buttonsProducts"}>
                                    <button className={"addCart gray"} disabled>Добавить в корзину</button>
                                    <button className={"aboutProducts gray"} disabled>Подробнее</button>
                                </div>
                            </div>
                        ))}
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
