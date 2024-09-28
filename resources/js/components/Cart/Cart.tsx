import * as React from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {cartAtom, totalCostAtom, quantityAtom} from "./cartAtom";
import { addItem, removeItem, updateItemQuantity } from "./useCart"

const Cart = () => {
    const [cart, setCart] = useRecoilState(cartAtom);
    const quantity = useRecoilValue(quantityAtom);
    const totalCost = useRecoilValue(totalCostAtom);

    return (
        <div id={"cart"}>
            <div id="cart-products-wrapper">
                <table id="cart-table">
                    <thead id="cart-table-header">
                    <tr>
                        <th className="name-col">Product Name</th>
                        <th className="quantity-col">Quantity</th>
                        <th className="price-col">Price</th>
                        <th className="updated-price-col">Updated Price</th>
                        <th className="remove-col">Remove</th>
                    </tr>
                    </thead>
                    <tbody id="cart-table-body">
                    <tr id="pixel-2">
                        <td>Pixel 2</td>
                        <td id="quantity"><input name="quantity" id="quantity-value" type="number" value="1"/></td>
                        <td id="product-price" className="cart-product-price">876</td>
                        <td id="updated-product-price" className="cart-updated-product-price">876</td>
                        <td>
                            <button className="remove" onClick={removeFromCart}>X</button>
                        </td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Cart;
