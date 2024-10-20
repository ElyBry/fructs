import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import * as ReactDOM from 'react-dom/client';

import styles from "../../sass/_componentsForProducts.module.scss";

import {RecoilRoot, useRecoilState, useRecoilValue} from "recoil";
import axios from "axios";

import Footer from "../components/_footer";
import Header from "../components/_header.js";

import Search from "../components/Search/Search";

import Countries from "../components/CountriesSearch/CountriesSearch";
import { countriesList } from "../components/CountriesSearch/countriesAtom";

import ProductsList from "../components/Products/ProductsList";

import Cart from "../components/Cart/Cart";
import {cartAtom, totalCostAtom, quantityAtom} from "../components/Cart/cartAtom";
import useCart from "../components/Cart/useCart";
import {userIsAuth, userRole} from "../components/User/userAtom";
import {useNavigate} from "react-router-dom";
import User from "../components/User/user";

const Products: React.FC = () => {
    const [isAuth, setIsAuth] = useRecoilState( userIsAuth );
    const [roles, setRoles] = useState(userRole);
    const {checkRole, checkAuthAndGetRole} = User();

    const navigate = useNavigate();
    useEffect(() => {
        if (!checkRole(['Super Admin', 'Admin', 'Manager'])) {
            navigate('/login');
        }
    }, []);


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
            setLoadingCategories(true);
            setLoadingColors(true);

            const responseAllCategory = await axios.get<any>('../api/typeProducts');
            setAllCategory(responseAllCategory.data);
            setLoadingCategories(false);

            const responseAllColors = await axios.get<any>('../api/colors');
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
    const [aboutProduct, setAboutProduct] = useState(null);
    const [isOpenAboutProduct, setIsOpenAboutProduct] = useState(false);

    const [feedbacksProduct, setFeedbacksProduct] = useState([]);
    const [loadingFeedbacksProduct, setLoadingFeedbacksProduct] = useState(false);
    const [pageFeedbacksProduct, setPageFeedbacksProduct] = useState(null);
    const [hasMoreFeedbacks, setHasMoreFeedbacks] = useState(false);

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

    const [product,setProduct] = useState(null);
    const addNewProduct = async () => {
        const response = await axios.post('../api/admin/products/', {
            title: product.title,
            description: product.description,
            price: product.price,
            type_weight: product.type_weight,
            img: product.img,
            type_products_id: product.type_products_id,
            color_id: product.color_id,
            country_id: product.country_id,
            count: product.count
        });
    };
    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setProduct((prevUser) => ({
            ...prevUser,
            [field]: value
        }));
    };
    return (
        <div className={styles.root}>
            <div id={"aboutProductModule"} className={`${styles.aboutProductModule} ${isOpenAboutProduct ? styles.visible : ""}`}>
                <div id={"aboutProduct"} className={styles.aboutProduct}>
                    {
                        aboutProduct &&
                        <>
                            <img src={aboutProduct["img"]}/>
                            <h2 className={styles.productName}>{aboutProduct["title"]}</h2>
                            <p className={styles.description}>{aboutProduct["description"]}</p>
                            <div className={styles.detailds}>
                                <p>Страна: {aboutProduct["country"]}</p>
                            </div>
                            <div className={styles.price}>
                                <p>Цена: {aboutProduct["price"]}р / {aboutProduct["weight"]} {aboutProduct["type_weight"]}</p>
                            </div>
                            <div className={styles.feedbacksProducts}>
                                <h2>К-во отзывов: {aboutProduct["count_feeds"]}</h2>
                                <h2>Рейтинг: {aboutProduct["average_rating"]}</h2>
                                <h1>Отзывы</h1>
                                <div id={"feedbacks"} className={styles.feedbacks}>
                                    {feedbacksProduct && feedbacksProduct.map((feedback, index) => (
                                        <div key={feedback.id}
                                             ref={index + 1 == feedbacksProduct.length ? lastElementRef : null}
                                             className={styles.feedback}
                                        >
                                            <div className={styles.star}>
                                                <span className={"material-symbols-outlined"}>star_rate</span>
                                                <div>
                                                    {feedback["rating"]}
                                                </div>
                                            </div>
                                            <div className={styles.username}>
                                                {feedback.user_name}
                                            </div>
                                            <div className={styles.message}>
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
            <Header className={styles.header}/>
            <div id={"main"} className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.change}
                         onClick={addNewProduct}
                    >Добавить новый продукт</div>
                    <div id={"filter"} className={styles.filterBlock}>
                        <div className={styles.mainType}>
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
                        <div className={styles.tree}>
                            <div className={styles.filter}>
                                <div
                                    className={`${styles.iconTree} ${isOpenFilter ? styles.open : ""} ${(selectedCountries.length + selectedColors.length != 0) || maxPrice != '' || minPrice != '' ? styles.enabled : ""}`}
                                    onClick={() => openSortOrFilter("Filter")}>
                                    <span className="material-symbols-outlined">filter_alt</span>
                                    Фильтр
                                </div>
                                <div className={`${styles.contentTreeFilter} ${isOpenFilter ? styles.active : ""}`}>
                                    <div className={styles.textTree}>Добавить фильтр</div>
                                    <div className={styles.blocksTree}>
                                        <button onClick={() => openAnyItem("Colors")}
                                                className={`${isOpenColors ? styles.open : ""} ${selectedColors.length > 0 ? styles.enabled : ""}`}>
                                            <span className="material-symbols-outlined">palette</span>Цвета
                                        </button>
                                        <button onClick={() => openAnyItem("Countries")}
                                                className={`${isOpenCountries ? styles.open : ""} ${selectedCountries.length > 0 ? styles.enabled : ""}`}>
                                            <span className="material-symbols-outlined">globe</span>Страны
                                        </button>
                                        <button onClick={() => openAnyItem("Costs")}
                                                className={`${isOpenCosts ? styles.open : ""} ${maxPrice != '' || minPrice != '' ? styles.enabled : ""}`}>
                                            <span className="material-symbols-outlined">currency_ruble</span>Стоимость
                                        </button>
                                        <button onClick={() => openAnyItem("Rate")}
                                                className={`${isOpenRate ? styles.open : ""} ${minRate != '' || maxRate != '' ? styles.enabled : ""}`}>
                                            <span className="material-symbols-outlined">thumb_up</span>Рейтинг
                                        </button>
                                    </div>
                                    <div className={`${styles.costTree} ${isOpenCosts ? styles.open : ""}`}>
                                        <h2>Цена:</h2>
                                        <label>От</label>
                                        <input type={"number"} name={"minPrice"} value={minPrice}
                                               onChange={handleMinPriceChange}/>
                                        <label>До</label>
                                        <input type={"number"} name={"maxPrice"} value={maxPrice}
                                               onChange={handleMaxPriceChange}/>
                                    </div>
                                    <div className={`${styles.rateTree} ${isOpenRate ? styles.open : ""}`}>
                                        <h2>Рейтинг:</h2>
                                        <label>От</label>
                                        <input type={"number"} name={"minRate"} value={minRate} min="0" max="5"
                                               onChange={handleMinRateChange}/>
                                        <label>До</label>
                                        <input type={"number"} name={"maxRate"} value={maxRate} min="0" max="5"
                                               onChange={handleMaxRateChange}/>
                                    </div>
                                    <div className={`${styles.colorsTree} ${isOpenColors ? styles.open : ""}`}>
                                        <h2>Цвет:</h2>
                                        <div id={"colors"} className={styles.colors}>
                                            {!loadingColors ?
                                                allColors.map((value: any[]) => (
                                                    <div key={value["id"]}>
                                                        <input id={"check" + value["id"]} type={"checkbox"}
                                                               value={value["id"]}
                                                               onChange={(e) => handleAnyChange(e, "Colors")}/>
                                                        <label htmlFor={"check" + value["id"]} className={styles.blocks}
                                                        >{value["name"]}</label>
                                                    </div>
                                                ))
                                                : <p>Загрузка...</p>
                                            }
                                        </div>
                                    </div>
                                    <div className={`${styles.countriesTree} ${isOpenCountries ? styles.open : ""}`}>
                                        <h2>Страна:</h2>
                                        <Countries/>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.sort}>
                                <div className={`${styles.iconTree} ${isOpenSort ? styles.open : ""} ${styles.enabled}`}
                                     onClick={() => openSortOrFilter("Sort")}>
                                    <span className="material-symbols-outlined">filter_list</span>
                                    Сортировка
                                </div>
                                <div className={`${styles.contentTreeSort} ${isOpenSort ? styles.active : ""} `}>
                                    <div className={styles.textTree}>Сортировать по</div>
                                    <h4>Направлению:</h4>
                                    <div className={styles.blocksTree}>
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
                                    <div className={styles.blocksTree}>
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
                    <Search/>
                    <ProductsList maxPrice={maxPrice} minPrice={minPrice} ascendingSort={ascendingSort}
                                  howSort={howSort} selectedColors={selectedColors} selectedTypes={selectedTypes}
                                  openAboutProduct={openAboutProduct}
                                  minRate={minRate} maxRate={maxRate}
                    />
                </div>
            </div>

            <div className={styles.block}>
                <Footer/>
            </div>
        </div>
    )
};

export default Products;

