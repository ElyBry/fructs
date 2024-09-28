import * as React from "react";

const Product = ({ product }) => {
    return (
        <div className={"products"}>
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
                {product.price}р <br/> {product.weight}
            </div>
            <div className={"buttonsProducts"}>
                <button className={"addCart"}>Добавить в корзину</button>
                <button className={"aboutProducts"}>Подробнее</button>
            </div>
        </div>
    )
}
export default Product;
