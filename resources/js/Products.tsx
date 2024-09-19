import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import * as ReactDOM from 'react-dom/client';
import Footer from "./components/_footer.js";
import Header from "./components/_header.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { debounce } from 'lodash';
const random = gsap.utils.random;

gsap.registerPlugin(ScrollTrigger);
const Products: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [isSearch, setIsSearch] = useState(true);
    const inputRef = useRef(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const controller = new AbortController();
    const fetchProducts = async (pageNumber, minPrice, maxPrice, selectedTypes, searchTerm) => {
        try {
            setLoading(true);
            console.log('Загрузка продуктов с учетом:', { minPrice, maxPrice, selectedTypes,searchTerm,pageNumber,hasMore,loading });
            const response = await axios.get<any>('/api/products', {
                signal: controller.signal,
                params: {
                    page: pageNumber,
                    name: searchTerm,
                    min_price: minPrice || undefined,
                    max_price: maxPrice || undefined,
                    types: selectedTypes.length > 0 ? selectedTypes : undefined
                }
            });
            const newData = response.data;

            setProducts((prev) => [...prev, ...newData.data]);
            setHasMore(newData.current_page < newData.last_page);
            return response;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log(error.message);
            } else {
                console.error("Ошибка получения данных: ", error);
            }
        } finally {
            setLoading(false);
        }
    };
    const handleTypeChange = (event) => {
        const value = event.target.value;
        if (event.target.checked) {
            setSelectedTypes((prev) => [...prev, value]);
        } else {
            setSelectedTypes((prev) => prev.filter((type) => type !== value));
        }
    };
    const handleMinPriceChange = (event) => setMinPrice(event.target.value);
    const handleMaxPriceChange = (event) => setMaxPrice(event.target.value);
    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    useEffect(() => {
        fetchProducts(page, minPrice, maxPrice, selectedTypes, searchTerm);
    }, [page,minPrice, maxPrice, selectedTypes, searchTerm]);
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        return () => {
            controller.abort();
        };
    }, [minPrice, maxPrice, selectedTypes, searchTerm]);
    const tableProducts:HTMLElement = document.querySelector('#root');
    const handleScroll = () => {
        const scrollTop = tableProducts.scrollTop;
        const tableHeight = tableProducts.offsetHeight;

        if ((scrollTop >= tableHeight * 0.75) && hasMore && !loading) {
            setPage(prev => prev + 1);
        }

        // Для отладки
        //console.log(scrollTop, tableHeight);
    };
    useEffect(() => {
        tableProducts.addEventListener('scroll', handleScroll);

        return () => {
            tableProducts.removeEventListener('scroll', handleScroll);
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
                    <input placeholder={"Поиск"} type={"search"} autoComplete={"off"} ref={inputRef} onChange={handleSearchChange}/>
                    <button type={"submit"} className={"searchIcon"} onClick={toggleSearch}><span className="material-symbols-outlined">search</span></button>
                </div>
            </div>
            <div id={"main"}>
                <div className={"content"}>
                    <div id={"filter"}>
                        <h2>Цена:</h2>
                        <label>От</label>
                        <input type={"number"} name={"minPrice"} value={minPrice} onChange={handleMinPriceChange}/>
                        <label>До</label>
                        <input type={"number"} name={"maxPrice"} value={maxPrice} onChange={handleMaxPriceChange}/>
                        <h2>Страна:</h2>
                        <div id={"countries"}></div>
                        <h2>Тип:</h2>
                        <label><input type={"checkbox"} name={"type"} value={"fruits"} onChange={handleTypeChange}/>Фрукты</label>
                        <label><input type={"checkbox"} name={"type"} value={"vegetables"} onChange={handleTypeChange}/>Овощи</label>
                        <label><input type={"checkbox"} name={"type"} value={"fruits"} onChange={handleTypeChange}/>Фрукты</label>
                        <h2>Цвет:</h2>
                        <div id={"colors"}></div>
                    </div>
                    <div id={"tableProducts"}>
                        {products.map((product) => (
                            <div key={product.id} className={"products"}>
                                <div className={"imgProducts"}>
                                    <img src={product.img}/>
                                    {product.id}
                                </div>
                                <div className={"textProducts"}>
                                    {product.title}
                                </div>
                                <div className={"priceProducts"}>
                                    {product.price}р /{product.weight}
                                </div>
                                <div className={"buttonsProducts"}>
                                    <button className={"addCart"}>Добавить в корзину</button>
                                    <button className={"aboutProducts"}>Подробнее</button>
                                </div>
                            </div>
                        ))}
                        {loading && [...Array(12)].map((_, index) => (
                            <div key={index} className={"products grey_card"}>
                                <div className={"imgProducts grey"}></div>
                                <div className={"textProducts grey"}></div>
                                <div className={"priceProducts grey"}></div>
                                <div className={"buttonsProducts"}>
                                    <button className={"addCart grey"} disabled>Добавить в корзину</button>
                                    <button className={"aboutProducts grey"} disabled>Подробнее</button>
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
