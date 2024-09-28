import { atom } from "recoil";

export const productsAtom = atom({
    key: 'productsList',
    default: [],
})
