import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import * as ReactDOM from 'react-dom/client';

import {RecoilRoot, useRecoilValue} from "recoil";
import axios from "axios";

import Footer from "./components/_footer.js";
import Header from "./components/_header.js";

import Search from "./components/Search/Search";

import Countries from "./components/CountriesSearch/CountriesSearch";
import { countriesList } from "./components/CountriesSearch/countriesAtom";

import ProductsList from "./components/Products/ProductsList";

import Cart from "./components/Cart/Cart";
import {cartAtom, totalCostAtom, quantityAtom} from "./components/Cart/cartAtom";
import useCart from "./components/Cart/useCart";

const Products: React.FC = () => {

    const selectedCountries = useRecoilValue(countriesList);

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRate , setMinRate] = useState('');
    const [maxRate, setMaxRate]  = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [howSort, setHowSort] = useState('New');
    const [ascendingSort, setAscendingSort] = useState('asc');

    const [newProduct, setNewProduct] = useState([])
    const [newCategory, setNewCategory] = useState([]);
    const [popularProduct, setPopularProduct] = useState([])

    const [loadingTop, setLoadingTop] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingColors, setLoadingColors] = useState(false);

    const [allCategory, setAllCategory] = useState([]);
    const [allColors, setAllColors] = useState([]);

    const [isOpenFilter, setIsOpenFilter ] = useState(false);
    const [isOpenSort, setIsOpenSort ] = useState(false);

    const [isOpenColors, setIsOpenColors] = useState(false);
    const [isOpenCountries, setIsOpenCountries] = useState(false);
    const [isOpenCosts, setIsOpenCosts] = useState(false);
    const [isOpenRate, setIsOpenRate] = useState(false);

    const handleMinPriceChange = (event) => setMinPrice(event.target.value);
    const handleMaxPriceChange = (event) => setMaxPrice(event.target.value);

    const handleMinRateChange = (event) => setMinRate(event.target.value);
    const handleMaxRateChange = (event) => setMaxRate(event.target.value);

    const openAnyItem = (type: string) => {
        setIsOpenColors(false);
        setIsOpenCountries(false);
        setIsOpenCosts(false);
        setIsOpenRate(false);
        if (type == "Colors") {
            setIsOpenColors(true)
        } else if (type == "Countries") {
            setIsOpenCountries(true);
        } else if (type == 'Costs') {
            setIsOpenCosts(true);
        } else if (type == 'Rate') {
            setIsOpenRate(true);
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
            setLoadingCategories(true);
            setLoadingColors(true);

            const responseNewProduct = await axios.get<any>('api/newProduct');
            setNewProduct(responseNewProduct.data);
            const responsePopularProduct = await axios.get<any>('api/popularProduct');
            setPopularProduct(responsePopularProduct.data);
            const responseNewCategory = await axios.get<any>('api/newCategory');
            setNewCategory(responseNewCategory.data);
            setLoadingTop(false);

            const responseAllCategory = await axios.get<any>('api/typeProducts');
            setAllCategory(responseAllCategory.data);
            setLoadingCategories(false);

            const responseAllColors = await axios.get<any>('api/colors');
            setAllColors(responseAllColors.data);
            setLoadingColors(false);

            return true;
        } catch (e) {
            console.log('Ошибка получения данных',e);
        }
    };
    useEffect(() => {
        fetchTopInfo();
    }, []);
    const handleAnyChange = (event, type:string) => {
        const value = event.target.value;
        if (type == "Category") {
            if (event.target.checked) {
                if (selectedTypes.indexOf(value) != -1) {
                    return;
                }
                console.log(selectedTypes)
                setSelectedTypes((prev) => [...prev, value]);
            } else {
                setSelectedTypes((prev) => prev.filter((type) => type != value));
            }
        } else if (type == "Colors") {
            if (event.target.checked) {
                setSelectedColors((prev) => [...prev, value]);
            } else {
                setSelectedColors((prev) => prev.filter((type) => type != value));
            }
        }
    };

    const handleTopPick = (id) => {
        const allCategories = document.querySelectorAll("input[name=type]");
        allCategories.forEach((categories:HTMLInputElement) => categories.checked = false);
        setSelectedTypes([]);
        const category:HTMLInputElement = document.querySelector("#type" + id);
        category.checked = !category.defaultChecked;
        category.defaultChecked = category.checked;
        handleAnyChange({target: {value: id, checked: category.checked}},"Category")
    };

    const totalCost = useRecoilValue(totalCostAtom);
    const quantity = useRecoilValue(quantityAtom);
    const { addItem, removeItem, updateItemQuantity } = useCart();
    const cart = useRecoilValue(cartAtom);

    const [aboutProduct, setAboutProduct] = useState(null);
    const [isOpenAboutProduct, setIsOpenAboutProduct] = useState(false);
    const [isOpenCart, setIsOpenCart] = useState(false);

    const [feedbacksProduct, setFeedbacksProduct] = useState([]);
    const [loadingFeedbacksProduct, setLoadingFeedbacksProduct] = useState(false);
    const [pageFeedbacksProduct, setPageFeedbacksProduct] = useState(null);
    const [hasMoreFeedbacks, setHasMoreFeedbacks] = useState(false);

    useEffect(() => {
        if (cart.length == 0) {
            setIsOpenCart(false);
        }
    }, [cart]);

    const fetchFeedbacksProduct = async (page, product, controller) => {
        try {
            const { signal } = controller;
            const response = await axios.get(`/api/feedBackProducts?product_id=${product.id}&page=${page}`, { signal });
            const newData = response.data;
            setFeedbacksProduct((prev) => [...prev, ...newData.data]);
            setHasMoreFeedbacks(newData.current_page < newData.last_page);
            setLoadingFeedbacksProduct(false)
        } catch (e) {
            if (e.name != "CanceledError") {
                console.error("Ошибка получения данных: ", e);
            }
        }
    }
    const openAboutProduct = (product) => {
        if (aboutProduct && product.id == aboutProduct["id"]) {
            setIsOpenAboutProduct(true);
            return;
        }
        setFeedbacksProduct([])
        setPageFeedbacksProduct(1);
        setHasMoreFeedbacks(true);
        setAboutProduct(product);
        setIsOpenAboutProduct(true);

    };
    useEffect(() => {
        const controller = new AbortController();
        setLoadingFeedbacksProduct(true);
        const fetchData = async () => {
            await fetchFeedbacksProduct(pageFeedbacksProduct, aboutProduct, controller);
        };

        if ((pageFeedbacksProduct == 1 || !loadingFeedbacksProduct) && aboutProduct) {
            fetchData();
        }

        return () => {
            controller.abort();
        }
    }, [pageFeedbacksProduct, aboutProduct]);

    const observerFeedbacks = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node) => {
            if (loadingFeedbacksProduct) return;
            if (observerFeedbacks.current) observerFeedbacks.current.disconnect();

            observerFeedbacks.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreFeedbacks) {
                    setPageFeedbacksProduct((prevPage) => prevPage + 1);
                }
            });
            if (node) observerFeedbacks.current.observe(node);
        },
        [loadingFeedbacksProduct, hasMoreFeedbacks]
    );
    return (
        <>
            <div id={"usableItems"}>
                <button id={"openCart"} className={quantity > 0 && !isOpenCart ? "visible" : ""}
                        onClick={() => {
                            setIsOpenCart(true);
                            setIsOpenAboutProduct(false);
                        }}
                >
                    <span className="material-symbols-outlined">shopping_cart</span><br/>
                    {totalCost} р<br/>
                    Кол-во: {quantity}
                </button>
                <button id={"close"} className={isOpenAboutProduct || isOpenCart ? "visible" : ""}
                        onClick={() => {
                            setIsOpenAboutProduct(false);
                            setIsOpenCart(false);
                        }}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>
            <div id={"aboutProductModule"} className={isOpenAboutProduct ? "visible" : ""}>
                <div id={"aboutProduct"}>
                    {
                        aboutProduct &&
                        <>
                            <img src={aboutProduct["img"]}/>
                            <h2 className="product-name">{aboutProduct["title"]}</h2>
                            <p className="description">{aboutProduct["description"]}</p>
                            <div className="details">
                                <p>Страна: {aboutProduct["country"]}</p>
                            </div>
                            <div className="price">
                                <p>Цена: {aboutProduct["price"]}р / {aboutProduct["weight"]} {aboutProduct["type_weight"]}</p>
                                <button className="buy-button"
                                        onClick={() => {
                                            addItem(aboutProduct)
                                            setIsOpenAboutProduct(false);
                                        }}
                                >
                                    {cart.findIndex(item => item.id == aboutProduct.id) < 0 ? "Добавить в корзину" : "Удалить из коризны"}
                                </button>
                            </div>
                            <div className={"feedbacksProducts"}>
                                <h2>К-во отзывов: {aboutProduct["count_feeds"]}</h2>
                                <h2>Рейтинг: {aboutProduct["average_rating"]}</h2>
                                <h1>Отзывы</h1>
                                <div id={"feedbacks"}>
                                    {feedbacksProduct && feedbacksProduct.map((feedback, index) => (
                                        <div key={feedback.id}
                                             ref={index + 1 == feedbacksProduct.length ? lastElementRef : null}
                                             className={"feedback"}
                                        >
                                            <div className={"star"}>
                                                <span className={"material-symbols-outlined"}>star_rate</span>
                                                <div>
                                                    {feedback["rating"]}
                                                </div>
                                            </div>
                                            <div className={"username"}>
                                                {feedback.id}<br/>
                                                {feedback.user_name}
                                            </div>
                                            <div className={"message"}>
                                                {feedback.message}
                                            </div>
                                        </div>
                                    ))}
                                    {loadingFeedbacksProduct && <p>Загрузка....</p>}
                                    {!loadingFeedbacksProduct && feedbacksProduct.length == 0 &&
                                        <p>Отзывов не найдено</p>}
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
            <Cart isOpenCart={isOpenCart}/>
            <Header/>
            <Search/>
            <div id={"infoProducts"}>
                <div className={"content"}>
                    <div className={"cards"}>
                        {loadingTop ?
                            <>
                                <div className={"infoCard grey"}>
                                    <div className={"leftSide"}>
                                        <h4>Хит Продаж(за месяц)</h4>
                                        <h1>Яблоко</h1>
                                        <h3>320р/ Килограмм</h3>
                                        <button disabled={true}>Подробнее</button>
                                    </div>
                                    <div className={"rightSide"}>
                                    </div>
                                </div>
                                <div className={"infoCard grey"}>
                                    <div className={"leftSide"}>
                                        <h4>Новая Категория</h4>
                                        <h1>Фрукты</h1>
                                        <button disabled={true}>Отфильтровать</button>
                                    </div>
                                    <div className={"rightSide"}>
                                    </div>
                                </div>
                                <div className={"infoCard grey"}>
                                    <div className={"leftSide"}>
                                        <h4>Новый Продукт</h4>
                                        <h1>Апельсин</h1>
                                        <h3>320р/ Килограмм</h3>
                                        <button disabled={true}>Подробнее</button>
                                    </div>
                                    <div className={"rightSide"}>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className={"infoCard"}>
                                    <div className={"star"}>
                                        <span className={"material-symbols-outlined"}>star_rate</span>
                                        <div>
                                            {popularProduct["average_rating"]}
                                            {popularProduct["average_rating"] ? <hr/> : ""}
                                            {popularProduct["count_feeds"]}
                                        </div>
                                    </div>
                                    <div className={"leftSide"}>
                                        <h4>Хит Продаж(за месяц)</h4>
                                        <h1>{popularProduct["title"]}</h1>
                                        <h3>{popularProduct["price"] + "р/ "} {`${popularProduct["weight"]} ${popularProduct["type_weight"]}`}</h3>
                                        <button onClick={() => openAboutProduct(popularProduct)}>Подробнее</button>
                                    </div>
                                    <div className={"rightSide"}>
                                        <img src={popularProduct["img"]}/>
                                    </div>
                                </div>
                                <div className={"infoCard"}>
                                    <div className={"leftSide"}>
                                        <h4>Новая Категория</h4>
                                        <h1>{newCategory["name"]}</h1>
                                        <button onClick={() => handleTopPick(newCategory["id"])}>Отфильтровать</button>
                                    </div>
                                    <div className={"rightSide"}>
                                        <img src={newCategory["img"]}/>
                                    </div>
                                </div>
                                <div className={"infoCard"}>
                                    <div className={"star"}>
                                        <span className={"material-symbols-outlined"}>star_rate</span>
                                        <div>
                                            {newProduct["average_rating"]}
                                            {newProduct["average_rating"] ? <hr/> : ""}
                                            {newProduct["count_feeds"]}
                                        </div>
                                    </div>
                                    <div className={"leftSide"}>
                                        <h4>Новый Продукт</h4>
                                        <h1>{newProduct["title"]}</h1>
                                        <h3>{newProduct["price"] + "р/ "} {`${newProduct["weight"]} ${newProduct["type_weight"]}`}</h3>
                                        <button onClick={() => openAboutProduct(newProduct)}>Подробнее</button>
                                    </div>
                                    <div className={"rightSide"}>
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
                            {loadingCategories ?
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
                                                onChange={(e) => handleAnyChange(e, "Category")}/>
                                            <label htmlFor={"type" + value["id"]}>{value["name"]}</label>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className={"tree"}>
                            <div className={"filter"}>
                                <div
                                    className={`iconTree ${isOpenFilter ? "open" : ""} ${(selectedCountries.length + selectedColors.length != 0) || maxPrice != '' || minPrice != '' ? "enabled" : ""}`}
                                    onClick={() => openSortOrFilter("Filter")}>
                                    <span className="material-symbols-outlined">filter_alt</span>
                                    Фильтр
                                </div>
                                <div className={`contentTreeFilter ${isOpenFilter ? "active" : ""}`}>
                                    <div className={"textTree"}>Добавить фильтр</div>
                                    <div className={"blocksTree"}>
                                        <button onClick={() => openAnyItem("Colors")}
                                                className={(isOpenColors ? "open" : "") + (selectedColors.length > 0 ? " enabled" : "")}>
                                            <span className="material-symbols-outlined">palette</span>Цвета
                                        </button>
                                        <button onClick={() => openAnyItem("Countries")}
                                                className={(isOpenCountries ? "open" : "") + (selectedCountries.length > 0 ? " enabled" : "")}>
                                            <span className="material-symbols-outlined">globe</span>Страны
                                        </button>
                                        <button onClick={() => openAnyItem("Costs")}
                                                className={(isOpenCosts ? "open" : "") + (maxPrice != '' || minPrice != '' ? " enabled" : "")}>
                                            <span className="material-symbols-outlined">currency_ruble</span>Стоимость
                                        </button>
                                        <button onClick={() => openAnyItem("Rate")}
                                                className={(isOpenRate ? "open" : "") + (minRate != '' || maxRate != '' ? " enabled" : "")}>
                                            <span className="material-symbols-outlined">thumb_up</span>Рейтинг
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
                                    <div className={`rateTree ${isOpenRate ? "open" : ""}`}>
                                        <h2>Рейтинг:</h2>
                                        <label>От</label>
                                        <input type={"number"} name={"minRate"} value={minRate} min="0" max="5"
                                               onChange={handleMinRateChange}/>
                                        <label>До</label>
                                        <input type={"number"} name={"maxRate"} value={maxRate} min="0" max="5"
                                               onChange={handleMaxRateChange}/>
                                    </div>
                                    <div className={`colorsTree ${isOpenColors ? "open" : ""}`}>
                                        <h2>Цвет:</h2>
                                        <div id={"colors"}>
                                            {!loadingColors ?
                                                allColors.map((value: any[]) => (
                                                    <div key={value["id"]}>
                                                        <input id={"check" + value["id"]} type={"checkbox"}
                                                               value={value["id"]}
                                                               onChange={(e) => handleAnyChange(e, "Colors")}/>
                                                        <label htmlFor={"check" + value["id"]} className={"blocks"}
                                                        >{value["name"]}</label>
                                                    </div>
                                                ))
                                                : <p>Загрузка...</p>
                                            }
                                        </div>
                                    </div>
                                    <div className={`countriesTree ${isOpenCountries ? "open" : ""}`}>
                                        <h2>Страна:</h2>
                                        <Countries/>
                                    </div>
                                </div>
                            </div>
                            <div className={"sort"}>
                                <div className={`iconTree ${isOpenSort ? "open" : ""} enabled`}
                                     onClick={() => openSortOrFilter("Sort")}>
                                    <span className="material-symbols-outlined">filter_list</span>
                                    Сортировка
                                </div>
                                <div className={`contentTreeSort ${isOpenSort ? "active" : ""} `}>
                                    <div className={"textTree"}>Сортировать по</div>
                                    <h4>Направлению:</h4>
                                    <div className={"blocksTree"}>
                                        <div>
                                            <input type={"radio"} defaultChecked={true} name={"direction"}
                                                   id={"increaseCheck"} onChange={() => setAscendingSort('asc')}/>
                                            <label htmlFor={"increaseCheck"}>
                                                <span className={"material-symbols-outlined"}>arrow_upward</span>Возрастанию
                                            </label>
                                        </div>
                                        <div>
                                            <input type={"radio"} name={"direction"} id={"decreaseCheck"}
                                                   onChange={() => setAscendingSort('desc')}/>
                                            <label htmlFor={"decreaseCheck"}>
                                                <span className={"material-symbols-outlined"}>arrow_downward</span>Убыванию
                                            </label>
                                        </div>
                                    </div>
                                    <h4>По:</h4>
                                    <div className={"blocksTree"}>
                                        <div>
                                            <input type={"radio"} name={"sort"} id={"sortPopular"}
                                                   onChange={() => setHowSort("Popular")}/>
                                            <label htmlFor={"sortPopular"}>
                                                <span className={"material-symbols-outlined"}>trending_up</span>Популярным
                                            </label>
                                        </div>
                                        <div>
                                            <input type={"radio"} name={"sort"} id={"sortNew"} defaultChecked={true}
                                                   onChange={() => setHowSort("New")}/>
                                            <label htmlFor={"sortNew"}>
                                                <span className={"material-symbols-outlined"}>update</span>Новизне
                                            </label>
                                        </div>
                                        <div>
                                            <input type={"radio"} name={"sort"} id={"sortFeed"}
                                                   onChange={() => setHowSort("Feedback")}/>
                                            <label htmlFor={"sortFeed"}>
                                                <span className={"material-symbols-outlined"}>favorite</span>Отзывам
                                            </label>
                                        </div>
                                        <div>
                                            <input type={"radio"} name={"sort"} id={"sortCost"}
                                                   onChange={() => setHowSort("Costs")}/>
                                            <label htmlFor={"sortCost"}>
                                                <span className={"material-symbols-outlined"}>trending_up</span>Стоимости
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProductsList maxPrice={maxPrice} minPrice={minPrice} ascendingSort={ascendingSort}
                                  howSort={howSort} selectedColors={selectedColors} selectedTypes={selectedTypes}
                                  openAboutProduct={openAboutProduct}
                                  minRate={minRate} maxRate={maxRate}
                    />
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
    root.render(
        <RecoilRoot>
            <Products/>
        </RecoilRoot>
    );
}
