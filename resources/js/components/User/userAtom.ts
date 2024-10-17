import {atom} from "recoil";

export const userIsAuth = atom({
    key: 'userIsAuth',
    default: false,
})

export const userRole = atom({
    key: 'userRole',
    default: ""
})

export const User = atom({
    key: 'User',
    default: []
})
