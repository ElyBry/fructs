import {atom, selector} from "recoil";

export const cartAtom = atom({
    key: 'cartList',
    default: [],
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
