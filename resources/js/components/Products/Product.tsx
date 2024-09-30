import * as React from "react";

const Product = ({ product, openAboutProduct, addItem, refLast }) => {
    return (
        <div className={"products"} ref={refLast}>
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
                <button className={"addCart"}  onClick={(e) => addItem(e, product)}>Добавить в корзину</button>
                <button className={"aboutProducts"} onClick={() => openAboutProduct(product)}>Подробнее</button>
            </div>
        </div>
    )
}
export default Product;
