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
    const [selectedColors, setSelectedColors] = useState([]);
    const [sort, setSort] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const controller = new AbortController();

    const [newProduct, setNewProduct] = useState([])
    const [newCategory, setNewCategory] = useState([]);
    const [popularProduct, setPopularProduct] = useState([])
    const [loadingTop, setLoadingTop] = useState(false);

    const [allCategory, setAllCategory] = useState([]);
    const [allColors, setAllColors] = useState([]);;

    const [isOpenFilter, setIsOpenFilter ] = useState(false);
    const [isOpenSort, setIsOpenSort ] = useState(false);

    const [isOpenColors, setIsOpenColors] = useState(false);
    const [isOpenCountries, setIsOpenCountries] = useState(false);
    const [isOpenCosts, setIsOpenCosts] = useState(false);

    const [query, setQuery] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const controllerCountries = new AbortController();
    const [displayedCountries, setDisplayedCountries] = useState([]);
    const [unselectedCountries, setUnselectedCountries] = useState([]);

    const fetchCountries = async () => {
        try {
            if (query.length > 0 ) {
                const response = await axios.get(`api/countries?country=${query}`,{
                    signal: controllerCountries.signal
                });
                setCountries(response.data.data);
            } else {
                setCountries([]);
            }
            return '';
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchCountries();
    }, [query]);
    useEffect(() => {
        return () => {
            controller.abort();
        };
    }, [query]);
    const openAnyItem = (type: string) => {
        setIsOpenColors(false);
        setIsOpenCountries(false);
        setIsOpenCosts(false);
        if (type == "Colors") {
            setIsOpenColors(true)
        } else if (type == "Countries") {
            setIsOpenCountries(true);
        } else {
            setIsOpenCosts(true);
        }
    };

    const openSortOrFilter = (type:string) => {
        setIsOpenFilter(false);
        setIsOpenSort(false);
        if (type == "Sort") {
            setIsOpenSort(!isOpenSort);
        } else {
            setIsOpenFilter(!isOpenFilter);
        }
    }

    const fetchTopInfo = async () => {
        try {
            setLoadingTop(true);
            const responseNewProduct = await axios.get<any>('api/newProduct');
            const responseNewCategory = await axios.get<any>('api/newCategory');
            const responsePopularProduct = await axios.get<any>('api/popularProduct');
            const responseAllCategory = await axios.get<any>('api/typeProducts');
            const responseAllColors = await axios.get<any>('api/colors');
            setNewProduct(responseNewProduct.data);
            setNewCategory(responseNewCategory.data);
            setPopularProduct(responsePopularProduct.data);
            setAllCategory(responseAllCategory.data);
            setAllColors(responseAllColors.data);
            return true;
        } catch (e) {
            console.log('Ошибка получения данных',e);
        } finally {
            setLoadingTop(false);
        }
    };
    useEffect(() => {
        fetchTopInfo();
    }, []);
    const fetchProducts = async (pageNumber, minPrice, maxPrice, selectedTypes, searchTerm) => {
        try {
            console.log('Загрузка продуктов с учетом:', { minPrice, maxPrice, selectedTypes, searchTerm, selectedColors,selectedCountries, pageNumber, hasMore,loading });
            setLoading(true);
            const response = await axios.get<any>('/api/products', {
                signal: controller.signal,
                params: {
                    page: pageNumber,
                    name: searchTerm,
                    min_price: minPrice || undefined,
                    max_price: maxPrice || undefined,
                    color: selectedColors.length > 0 ? selectedColors : undefined,
                    countries: selectedCountries.length > 0 ? selectedCountries.map(country => country.id) : undefined,
                    types: selectedTypes.length > 0 ? selectedTypes : undefined
                }
            });
            const newData = response.data;
            setLoading(false);
            //console.log(newData.data);
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
    const handleAnyChange = (event, type:string, country = null) => {
        const value = event.target.value;
        if (type == "Category") {
            if (event.target.checked) {
                setSelectedTypes((prev) => [...prev, value]);
            } else {
                setSelectedTypes((prev) => prev.filter((type) => type !== value));
            }
        } else if (type == "Colors") {
            if (event.target.checked) {
                setSelectedColors((prev) => [...prev, value]);
            } else {
                setSelectedColors((prev) => prev.filter((type) => type !== value));
            }
        } else if (type == "Countries") {
            const newSelectedCountries = event.target.checked
                ? [...selectedCountries, country]
                : selectedCountries.filter(selected => selected.id !== country.id);

            setSelectedCountries(newSelectedCountries);

        }
    };
    useEffect(() => {
        setDisplayedCountries(selectedCountries);
        setUnselectedCountries(countries.filter(country => !selectedCountries.some(selected => selected.id === country.id)));
    }, [selectedCountries, countries]);
    const handleMinPriceChange = (event) => setMinPrice(event.target.value);
    const handleMaxPriceChange = (event) => setMaxPrice(event.target.value);
    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    useEffect(() => {
        fetchProducts(page, minPrice, maxPrice, selectedTypes, searchTerm);
    }, [page,minPrice, maxPrice, selectedTypes, selectedColors, selectedCountries, searchTerm]);
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        return () => {
            controller.abort();
        };
    }, [minPrice, maxPrice, selectedTypes, selectedColors, selectedCountries, searchTerm]);
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
                        {loadingTop ?
                            <>
                                <div className={"infoCard grey"}>
                                    <div>
                                        <h4>Самый Популярный Продукт(за месяц)</h4>
                                        <h1>Яблоко</h1>
                                        <h3>320р/ Килограмм</h3>
                                        <button>Добавить в корзину</button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                                <div className={"infoCard grey"}>
                                    <div>
                                        <h4>Новая Категория</h4>
                                        <h1>Фрукты</h1>
                                        <button>Отфильтровать</button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                                <div className={"infoCard grey"}>
                                    <div>
                                        <h4>Новый Продукт</h4>
                                        <h1>Апельсин</h1>
                                        <h3>320р/ Килограмм</h3>
                                        <button>Подробнее</button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className={"infoCard"}>
                                    <div>
                                        <h4>Самый Популярный Продукт(за месяц)</h4>
                                        <h1>{popularProduct["title"]}</h1>
                                        <h3>{popularProduct["price"] + "р/ " + popularProduct["weight"]}</h3>
                                        <button>Добавить в корзину</button>
                                    </div>
                                    <div>
                                        <img src={popularProduct["img"]}/>
                                    </div>
                                </div>
                                <div className={"infoCard"}>
                                    <div>
                                        <h4>Новая Категория</h4>
                                        <h1>{newCategory["name"]}</h1>
                                        <button>Отфильтровать</button>
                                    </div>
                                    <div>
                                        <img src={newCategory["img"]}/>
                                    </div>
                                </div>
                                <div className={"infoCard"}>
                                    <div>
                                        <h4>Новый Продукт</h4>
                                        <h1>{newProduct["title"]}</h1>
                                        <h3>{newProduct["price"] + "р/ " + newProduct["weight"]}</h3>
                                        <button>Подробнее</button>
                                    </div>
                                    <div>
                                        <img src={newProduct["img"]}/>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div id={"main"}>
                <div className={"content"}>
                    <div id={"filter"}>
                        <div className={"mainType"}>
                            {loadingTop ?
                                <>
                                    <div>
                                        <input id={"fruits"} type={"checkbox"} name={"type"}
                                               value={"fruits"}
                                               disabled={true}/>
                                        <label htmlFor={"fruits"} className={"grey"}>Фрукты</label>
                                    </div>
                                    <div>
                                        <input id={"vegetables"} type={"checkbox"}
                                               name={"type"}
                                               className={"grey"}
                                               value={"vegetables"}
                                               disabled={true}/>
                                        <label htmlFor={"vegetables"} className={"grey"}>Овощи</label>
                                    </div>
                                    <div>
                                        <input id={"berries"} type={"checkbox"} name={"type"}
                                               value={"berries"}
                                               className={"grey"}
                                               disabled={true}/>
                                        <label htmlFor={"berries"} className={"grey"}>Ягоды</label>
                                    </div>
                                </>
                                :
                                allCategory.map((value: any[]) => {
                                    return (
                                        <div key={value["id"]}>
                                            <input
                                                id={"type" + value["id"]} type={"checkbox"}
                                                name={"type"}
                                                value={value["id"]}
                                                onChange={(e) => handleAnyChange(e,"Category")}/>
                                            <label htmlFor={"type" + value["id"]}>{value["name"]}</label>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className={"tree"}>
                            <div className={"filter"}>
                                <div className={`iconTree ${isOpenFilter ? "open" : ""}`} onClick={() => openSortOrFilter("Filter")}>
                                    <span className="material-symbols-outlined">filter_alt</span>
                                    Фильтр
                                </div>
                                <div className={`contentTreeFilter ${isOpenFilter ? "active" : ""}`}>
                                    <div className={"textTree"}>Добавить фильтр</div>
                                    <div className={"blocksTree"}>
                                        <button onClick={() => openAnyItem("Colors")}><span className="material-symbols-outlined">palette</span>Цвета
                                        </button>
                                        <button onClick={() => openAnyItem("Countries")}><span className="material-symbols-outlined">globe</span>Страны
                                        </button>
                                        <button onClick={() => openAnyItem("Costs")}><span className="material-symbols-outlined">currency_ruble</span>Стоимость
                                        </button>
                                    </div>
                                    <div className={`costTree ${isOpenCosts ? "open" : ""}`}>
                                        <h2>Цена:</h2>
                                        <label>От</label>
                                        <input type={"number"} name={"minPrice"} value={minPrice}
                                               onChange={handleMinPriceChange}/>
                                        <label>До</label>
                                        <input type={"number"} name={"maxPrice"} value={maxPrice}
                                               onChange={handleMaxPriceChange}/>
                                    </div>
                                    <div className={`colorsTree ${isOpenColors ? "open" : ""}`}>
                                        <h2>Цвет:</h2>
                                        <div id={"colors"}>
                                            {
                                                allColors.map((value: any[]) => (
                                                    <div key={value["id"]}>
                                                        <input id={"check"+value["id"]} type={"checkbox"} value={value["id"]} onChange={(e) => handleAnyChange(e,"Colors")}/>
                                                        <label htmlFor={"check" + value["id"]} className={"blocks"}
                                                             >{value["name"]}</label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className={`countriesTree ${isOpenCountries ? "open" : ""}`}>
                                        <h2>Страна:</h2>
                                        <div id={"countries"}>
                                            <input type={"text"} placeholder={"Введите первую букву страны..."} value={query} onChange={(e) => setQuery(e.target.value)}/>
                                            <div>
                                                {displayedCountries.map((country) => (
                                                    <div key={country["id"]}>
                                                        <input type={"checkbox"} id={"check_country" + country["id"]} defaultChecked={true}
                                                               onChange={(e) => handleAnyChange(e, "Countries", country)}/>
                                                        <label
                                                            htmlFor={"check_country" + country["id"]}>{country["name"]} </label>
                                                    </div>
                                                ))}
                                                {unselectedCountries.map((country) => (
                                                    <div key={country["id"]}>
                                                        <input type={"checkbox"} id={"check_country" + country["id"]}
                                                               onChange={(e) => handleAnyChange(e, "Countries", country)}/>
                                                        <label htmlFor={"check_country" + country["id"]} >{country["name"]} </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"sort"}>
                                <div className={`iconTree ${isOpenSort ? "open" : ""}`} onClick={() => openSortOrFilter("Sort")}>
                                    <span className="material-symbols-outlined">filter_list</span>
                                    Сортировка
                                </div>
                                <div className={`contentTreeSort ${isOpenSort ? "active" : ""}`}>
                                    <div className={"textTree"}>Сортировать по</div>
                                    <div className={"blocksTree"}>
                                        <button><span className="material-symbols-outlined">trending_up</span>Популярным</button>
                                        <button><span className="material-symbols-outlined">update</span>Новизне</button>
                                        <button><span className="material-symbols-outlined">favorite</span>Отзывам</button>
                                        <button><span className="material-symbols-outlined">currency_ruble</span>Стоимости</button>
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
