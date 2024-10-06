import * as React from "react";
import {useInView} from "react-intersection-observer";
import {cartAtom} from "../Cart/cartAtom";
import {useRecoilValue} from "recoil";

const Product = ({ product, openAboutProduct, addItem, refLast }) => {
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
        <div className={"products"} ref={mergeRefs(refLast, ref)}>
            {inView
                ?
                <>
                    <div className={"imgProducts"}>
                        <div className={"star"}>
                            <span className={"material-symbols-outlined"}>star_rate</span>
                            <div>
                                {product.average_rating}
                                {product.average_rating ? <hr/> : ""}
                                {product.count_feeds}
                            </div>
                        </div>
                        <img src={product.img}/>
                        {product.id}
                    </div>
                    <div className={"textProducts"}>
                        {product.title}
                    </div>
                    <div className={"priceProducts"}>
                        {product.price}р <br/> {`${product.weight} ${product.type_weight}`}
                    </div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart"}
                                onClick={() => addItem(product)}>
                            {cart.findIndex(item => item.id == product.id) < 0 ? "Добавить в корзину" : "Удалить из корзины"}

                        </button>
                        <button className={"aboutProducts"} onClick={() => openAboutProduct(product)}>Подробнее</button>
                    </div>
                </>
                :
                <>
                    <div className={"imgProducts "}></div>
                    <div className={"textProducts "}>Продукт</div>
                    <div className={"priceProducts "}>...р <br/> 1 Килограмм</div>
                    <div className={"buttonsProducts"}>
                        <button className={"addCart "} disabled>Добавить в корзину</button>
                        <button className={"aboutProducts "} disabled>Подробнее</button>
                    </div>
                </>
            }
        </div>
    )
}
export default Product;
