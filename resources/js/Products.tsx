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
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const controller = new AbortController();
    const fetchProducts = async (pageNumber, minPrice, maxPrice, selectedTypes, searchTerm) => {
        try {
            //console.log('Загрузка продуктов с учетом:', { minPrice, maxPrice, selectedTypes,searchTerm,pageNumber,hasMore,loading });
            setLoading(true);
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
            setLoading(false);
            setProducts((prev) => [...prev, ...newData.data]);
            setHasMore(newData.current_page < newData.last_page);
            return response;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log(error.message);
            } else {
                console.error("Ошибка получения данных: ", error);
            }
        }
    };
    const handleTypeChange = (event) => {
        const value = event.target.value;
        if (event.target.checked) {
            setSelectedTypes((prev) => [...prev, value]);

        } else {
            setSelectedTypes((prev) => prev.filter((type) => type !== value));
        }
        console.log(selectedTypes);
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
    useEffect(() => {
        const tableProducts:HTMLElement = document.querySelector('#root');
        const handleScroll = () => {
            const scrollTop = tableProducts.scrollTop;
            const tableHeight = tableProducts.scrollHeight - tableProducts.clientHeight;

            if ((scrollTop >= tableHeight * 0.75) && hasMore && !loading) {
                setPage(prev => prev + 1);
            }

            // Для отладки
            //console.log(scrollTop, tableHeight,window.innerHeight,document.documentElement.scrollTop);
        };
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
            <div id={"infoProducts"}>
                <div className={"content"}>
                    <div>
                        <div className={"infoCard"}>
                            <div>
                                <h4>Самый Популярный Продукт(за месяц)</h4>
                                <h1>Яблоко</h1>
                                <h3>320р/ Килограмм</h3>
                                <button>Добавить в корзину</button>
                            </div>
                            <div>
                                <img src={"image/fruits/apple.png"}/>
                            </div>
                        </div>
                        <div className={"infoCard"}>
                            <div>
                                <h4>Новая Категория</h4>
                                <h1>Фрукты</h1>
                                <button>Отфильтровать</button>
                            </div>
                            <div>
                                <img src={"image/background-images/fruits-realistic-set.png"}/>
                            </div>
                        </div>
                        <div className={"infoCard"}>
                            <div>
                                <h4>Новый Продукт</h4>
                                <h1>Апельсин</h1>
                                <h3>320р/ Килограмм</h3>
                                <button>Подробнее</button>
                            </div>
                            <div>
                                <img src={"image/fruits/orange.png"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id={"main"}>
                <div className={"content"}>
                    <div id={"filter"}>
                        <div className={"mainType"}>
                            <label htmlFor={"all"}><input id={"all"} type={"checkbox"} name={"type"} value={"all"} onChange={handleTypeChange}/>Все</label>
                            <label htmlFor={"fruits"}><input id={"fruits"} type={"checkbox"} name={"type"} value={"fruits"} onChange={handleTypeChange}/>Фрукты</label>
                            <label htmlFor={"vegetables"}><input id={"vegetables"} type={"checkbox"} name={"type"} value={"vegetables"} onChange={handleTypeChange}/>Овощи</label>
                            <label htmlFor={"berries"}><input id={"berries"} type={"checkbox"} name={"type"} value={"berries"} onChange={handleTypeChange}/>Ягоды</label>
                        </div>
                        <div className={"tree"}>
                            <div className={"filter"}>
                                <div className={"iconTree"}>
                                    <span className="material-symbols-outlined">filter_alt</span>
                                    Фильтр
                                </div>
                                <div className={"contentTreeFilter active"}>
                                    <div className={"textTree"}>Добавить фильтр</div>
                                    <div className={"blocksTree"}>
                                        <h2>Цена:</h2>
                                        <label>От</label>
                                        <input type={"number"} name={"minPrice"} value={minPrice}
                                               onChange={handleMinPriceChange}/>
                                        <label>До</label>
                                        <input type={"number"} name={"maxPrice"} value={maxPrice}
                                               onChange={handleMaxPriceChange}/>
                                        <h2>Страна:</h2>
                                        <div id={"countries"}></div>
                                        <h2>Цвет:</h2>
                                        <div id={"colors"}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={"sort"}>
                                <div className={"iconTree"}>
                                    <span className="material-symbols-outlined">filter_list</span>
                                    Сортировка
                                </div>
                                <div className={"contentTreeSort "}>
                                    <div className={"textTree"}>Отсортировать по</div>
                                    <div className={"blocksTree"}>
                                        <button><span className="material-symbols-outlined">trending_up</span>
                                            Популярным
                                        </button>
                                        <button><span className="material-symbols-outlined">update</span>Новизне</button>
                                        <button><span className="material-symbols-outlined">favorite</span>Отзывам
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                <div className={"textProducts grey"}>Продукт</div>
                                <div className={"priceProducts grey"}>...р / 1 Килограмм</div>
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
