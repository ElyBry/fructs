import * as React from "react";
import {useInView} from "react-intersection-observer";
import {cartAtom} from "../Cart/cartAtom";
import {useRecoilValue} from "recoil";

import styles from "../../../sass/_product.module.scss"
import {useEffect} from "react";

const Product = ({ product, openAboutProduct = null, addItem = null, refLast = null, isAdmin = null}) => {
    const cart = useRecoilValue(cartAtom);
    const {ref, inView} = useInView({
        threshold: 0,
    })

    const mergeRefs = (...inputRefs) => {
        return (ref) => {
            inputRefs.forEach((inputRef) => {
                if (!inputRef) {
                    return;
                }

                if (typeof inputRef === 'function') {
                    inputRef(ref);
                } else {
                    inputRef.current = ref;
                }
            })
        }
    };
    return (
        <div className={styles.products} ref={mergeRefs(refLast, ref)}>
            {inView
                ?
                <>
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
                        <img src={`${window.location.origin}/${product.img}`}/>
                    </div>
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
                </>
                :
                <>
                    <div className={styles.imgProducts}></div>
                    <div className={styles.textProducts}>Продукт</div>
                    <div className={styles.priceProducts}>...р <br/> 1 Килограмм</div>
                    <div className={styles.buttonsProduct}>
                        <button className={styles.addCart} disabled>Добавить в корзину</button>
                        <button className={styles.aboutProducts} disabled>Подробнее</button>
                    </div>
                </>
            }
        </div>
    )
}
export default Product;
