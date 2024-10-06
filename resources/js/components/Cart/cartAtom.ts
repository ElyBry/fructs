import {atom, selector} from "recoil";
import {json} from "react-router-dom";

export const cartAtom = atom({
    key: 'cartList',
    default: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
})
export const totalCostAtom = selector<number>({
    key: 'totalCost',
    get: ({ get }) => {
        const cartItems = get(cartAtom);
        return cartItems.reduce((total, item) => total + item.price * parseInt(item.quantity), 0);
    }
})
export const quantityAtom = selector({
    key: 'quantity',
    get: ({ get }) => {
        const cartItems = get(cartAtom);
        return cartItems.reduce((quantity, item) => quantity + parseInt(item.quantity), 0);
    }
})
