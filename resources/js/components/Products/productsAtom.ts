import { atom } from "recoil";

export const productsAtom = atom({
    key: 'productsList',
    default: [],
})

export const aboutProductAtom = atom({
    key: "aboutProduct",
    default: []
})

export const openAboutProductAtom = atom({
    key: "openAboutProduct",
    default: false
})
