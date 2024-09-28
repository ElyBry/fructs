import { atom } from "recoil";

export const searchTermState = atom<string>({
    key: 'searchTerm',
    default: ''
})

export const isSearchState = atom<boolean>({
    key: 'isSearch',
    default: true,
})
