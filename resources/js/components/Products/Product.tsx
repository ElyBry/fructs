import * as React from "react";
import {useInView} from "react-intersection-observer";
import {cartAtom} from "../Cart/cartAtom";
import {useRecoilValue} from "recoil";

import styles from "../../../sass/_product.module.scss"
import {useEffect} from "react";

const Product = ({ product, openAboutProduct = null, addItem = null, refLast = null, isAdmin = null}) => {
    const cart = useRecoilValue(cartAtom);
    return (
        <div className={styles.products} ref={refLast}>
            <div className={styles.imgProducts}>
                {product.average_rating && product.count_feeds &&
                    <div className={styles.star}>
                        <span className={"material-symbols-outlined"}>star_rate</span>
                        <div>
                            {product.average_rating}
                            {product.average_rating ? <hr/> : ""}
                            {product.count_feeds}
                        </div>
                    </div>
                }
                <img src={`${window.location.origin}/${product.img}`} loading={"lazy"}/>
            </div>
            {isAdmin &&
                <div className={styles.error}>
                    Количество: {product.count}
                </div>
            }
            <div className={styles.textProducts}>
                {product.title}
            </div>
            <div className={styles.priceProducts}>
                {product.price}р <br/> {`${product.weight} ${product.type_weight}`}
            </div>
            <div className={styles.buttonsProducts}>
                {isAdmin ? <button className={styles.addCart}>Добавить в корзину</button> :
                    <button className={styles.addCart}
                            onClick={() => addItem(product)}>
                        {cart.findIndex(item => item.id == product.id) < 0 ? "Добавить в корзину" : "Удалить из корзины"}
                    </button>
                }
                <button className={styles.aboutProducts} onClick={() => openAboutProduct(product)}>{isAdmin ? "Изменить" : "Подробнее"}</button>
            </div>
        </div>
    )
}
export default Product;
