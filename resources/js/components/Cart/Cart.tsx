import * as React from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {cartAtom, totalCostAtom, quantityAtom} from "./cartAtom";
import useCart from "./useCart"
import {useEffect} from "react";

const Cart = () => {
    const cart = useRecoilValue(cartAtom);
    const quantity = useRecoilValue(quantityAtom);
    const totalCost = useRecoilValue(totalCostAtom);
    const { addItem, removeItem, updateItemQuantity } = useCart();

    return (
        <div id={"cart"}>
            <div id="cart-products-wrapper">
                <table id="cart-table">
                    <thead id="cart-table-header">
                    <tr>
                        <th className={"name-col"}>Название</th>
                        <th className={"quantity-col"}>Количество</th>
                        <th className={"price-col"}>Цена</th>
                        <th className={"updated-price-col"}>Итого:</th>
                        <th className={"remove-col"}>Удалить</th>
                    </tr>
                    </thead>
                    <tbody id={"cart-table-body"}>
                        {cart.map((item) =>
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                <td className={"quantity"}>
                                    <input name={"quantity"}
                                           type={"number"}
                                           value={item.quantity}
                                           onChange={(e) => updateItemQuantity(item.id,e.target.value )}
                                    />
                                </td>
                                <td className={"cart-product-price"}>{item.price}р</td>
                                <td className={"cart-updated-product-price"}>{totalCost}р</td>
                                <td>
                                    <button className={"remove"} onClick={() => removeItem(item.id)}>X</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Cart;
