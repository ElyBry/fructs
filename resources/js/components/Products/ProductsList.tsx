import * as React from "react";


import Product from './Product';
import {useRecoilState, useRecoilValue} from "recoil";
import {productsAtom} from "./productsAtom";
import {useEffect, useState} from "react";
import axios from "axios";
import {searchTermState} from "../Search/searchAtom";
import {countriesList} from "../CountriesSearch/countriesAtom";

const ProductsList = ({ minPrice, maxPrice, selectedTypes, selectedColors, howSort, ascendingSort}) => {
    const [products, setProducts] = useRecoilState(productsAtom)
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const searchTerm = useRecoilValue(searchTermState);
    const selectedCountries = useRecoilValue(countriesList);
    const fetchProducts = async (pageNumber, minPrice, maxPrice, selectedTypes, searchTerm, controller: AbortController) => {
        try {
            //console.log('Загрузка продуктов с учетом:', { minPrice, maxPrice, selectedTypes, searchTerm, selectedColors, selectedCountries, ascendingSort, howSort,  pageNumber, hasMore,loading });
            const response = await axios.get<any>('/api/products', {
                signal: controller.signal,
                params: {
                    page: pageNumber,
                    name: searchTerm,
                    min_price: minPrice || undefined,
                    max_price: maxPrice || undefined,
                    color: selectedColors.length > 0 ? selectedColors : undefined,
                    countries: selectedCountries.length > 0 ? selectedCountries.map(country => country.id) : undefined,
                    ascendingSort: ascendingSort || undefined,
                    howSort: howSort || undefined,
                    types: selectedTypes.length > 0 ? selectedTypes : undefined
                }
            });
            const newData = response.data;
            //console.log(newData);
            setLoading(false);
            setProducts((prev) => [...prev, ...newData.data]);
            setHasMore(newData.current_page < newData.last_page);
            return true;
        } catch (error) {
            if (error.name != "CanceledError") {
                console.error("Ошибка получения данных: ", error);
            }
        }
    };


    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
    }, [minPrice, maxPrice, selectedTypes, selectedColors, selectedCountries, searchTerm, ascendingSort, howSort]);
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        const fetchData = async () => {
            try {
                await fetchProducts(page, minPrice, maxPrice, selectedTypes, searchTerm, controller)
            } catch (error) {
                console.log(error);
            }
            return true;
        };

        if (page == 1 || !loading) {
            fetchData();
        }

        return () => {
            controller.abort();
        }
    }, [page, minPrice, maxPrice, selectedTypes, selectedColors, selectedCountries, searchTerm, ascendingSort, howSort]);

    useEffect(() => {
        const tableProducts:HTMLElement = document.querySelector('#root');

        const handleScroll = () => {
            const scrollTop = tableProducts.scrollTop;
            const tableHeight = tableProducts.scrollHeight - tableProducts.clientHeight;

            if ((scrollTop >= tableHeight - window.innerHeight) && hasMore) {
                setPage(prev => prev + 1);
            }

            // Для отладки
            //console.log(scrollTop, tableHeight - window.innerHeight, tableHeight,window.innerHeight,document.documentElement.scrollTop);
        };
        tableProducts.addEventListener('scroll', handleScroll);
        return () => {
            tableProducts.removeEventListener('scroll', handleScroll);
        };
    }, [hasMore, loading])

    return (
        <div id={"tableProducts"}>
            {products.length != 0 && products.map((product) => (
                <Product product={product} key={product.id}/>
            ))}
            {loading && [...Array(12)].map((_, index) => (
                <div key={index} className={"products grey_card"}>
                    <div className={"imgProducts grey"}></div>
                    <div className={"textProducts grey"}>Продукт</div>
                    <div className={"priceProducts grey"}>...р <br/> 1 Килограмм</div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart grey"} disabled>Добавить в корзину</button>
                        <button className={"aboutProducts grey"} disabled>Подробнее</button>
                    </div>
                </div>
            ))}
            {!loading && products.length == 0 && <h1>Нетю</h1>}
        </div>
    )
}
export default ProductsList;
