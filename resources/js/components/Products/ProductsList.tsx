import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";

import Product from './Product';
import {useRecoilState, useRecoilValue} from "recoil";
import {aboutProductAtom, openAboutProductAtom, productsAtom} from "./productsAtom";
import axios from "axios";
import {searchTermState} from "../Search/searchAtom";
import {countriesList} from "../CountriesSearch/countriesAtom";
import useCart from "../Cart/useCart"

import stylesProducts from "../../../sass/_products.module.scss";
import stylesProduct from "../../../sass/_product.module.scss";

const ProductsList = ({ minPrice, maxPrice, selectedTypes, selectedColors, howSort, ascendingSort, openAboutProduct, minRate, maxRate}) => {
    const [aboutProduct, setAboutProduct] = useRecoilState(aboutProductAtom)
    const [isOpenAboutProduct, setIsOpenAboutProduct] = useRecoilState(openAboutProductAtom)

    const { addItem } = useCart();

    const [products, setProducts] = useRecoilState(productsAtom)
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const searchTerm = useRecoilValue(searchTermState);
    const selectedCountries = useRecoilValue(countriesList);
    const fetchProducts = async (pageNumber, minPrice, maxPrice, selectedTypes, searchTerm, controller: AbortController, minRate, maxRate) => {
        try {
            //console.log('Загрузка продуктов с учетом:', { minPrice, maxPrice, selectedTypes, searchTerm, selectedColors, selectedCountries, ascendingSort, howSort, pageNumber, hasMore,loading , minRate, maxRate });
            const response = await axios.get<any>('/api/products', {
                signal: controller.signal,
                params: {
                    page: pageNumber,
                    name: searchTerm,
                    min_price: minPrice || undefined,
                    max_price: maxPrice || undefined,
                    min_rate: minRate || undefined,
                    max_rate: maxRate || undefined,
                    color: selectedColors.length > 0 ? selectedColors : undefined,
                    countries: selectedCountries.length > 0 ? selectedCountries.map(country => country.id) : undefined,
                    ascendingSort: ascendingSort || undefined,
                    howSort: howSort || undefined,
                    types: selectedTypes.length > 0 ? selectedTypes : undefined
                }
            });
            const newData = response.data;
            //console.log(newData);
            setProducts((prev) => [...prev, ...newData.data]);
            setHasMore(newData.current_page < newData.last_page);
            setLoading(false);
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
    }, [minPrice, maxPrice, selectedTypes, selectedColors, selectedCountries, searchTerm, ascendingSort, howSort, minRate, maxRate]);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        const fetchData = async () => {
            await fetchProducts(page, minPrice, maxPrice, selectedTypes, searchTerm, controller, minRate, maxRate);
        };

        if (page == 1 || !loading) {
            fetchData();
        }

        return () => {
            controller.abort();
        }
    }, [page, minPrice, maxPrice, selectedTypes, selectedColors, selectedCountries, searchTerm, ascendingSort, howSort, minRate, maxRate]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );



    return (
        <div id={"tableProducts"} className={stylesProducts.tableProducts}>
            {products.length != 0 && products.map((product, index) => (
                <Product product={product} key={product.id} openAboutProduct={openAboutProduct} addItem={addItem} refLast={products.length == index + 1 ? lastElementRef : null}/>
            ))}
            {loading && [...Array(12)].map((_, index) => (
                <div key={index} className={`${stylesProduct.products} ${stylesProducts.grey_card}`}>
                    <div className={`${stylesProduct.imgProducts} ${stylesProducts.grey}`}></div>
                    <div className={`${stylesProduct.textProducts} ${stylesProducts.grey}`}>Продукт</div>
                    <div className={`${stylesProduct.priceProducts} ${stylesProducts.grey}`}>...р <br/> 1 Килограмм</div>
                    <div className={stylesProduct.buttonsProducts}>
                        <button className={`${stylesProduct.addCart} ${stylesProducts.grey}`} disabled>Добавить в корзину</button>
                        <button className={`${stylesProduct.aboutProducts} ${stylesProducts.grey}`} disabled>Подробнее</button>
                    </div>
                </div>
            ))}
            {!loading && products.length == 0 && <h1>Ничего не найдено</h1>}
        </div>
    )
}
export default ProductsList;
