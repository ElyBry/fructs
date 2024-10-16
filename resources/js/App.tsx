import * as React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Products from './Products'
import Main from './Main'
import SignInUp from "./SignInUp";

import {RecoilRoot} from "recoil";
import * as ReactDOM from "react-dom/client";
import Orders from "./Orders";
import AdminOrders from './forAdmins/Orders';

const App = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const roles = user.roles.map(role => role.name);
    const checkRole = (requiredRoles) => {
        return requiredRoles.some(role => roles.includes(role));
    }
    return (
        <RecoilRoot>
            <Router>
                <Routes>
                    <Route path={"/"} element={<Main />} />
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/login" element={<SignInUp />}/>
                    <Route path="/profile"/>
                    <Route path="/logout" />
                    <Route path="/orders" element={<Orders />}/>
                    <Route path="/admin/orders" element={checkRole(['Super Admin', 'Admin', 'Manager']) ? <AdminOrders/> : <Navigate to={"/login"}/>}/>
                </Routes>
            </Router>
        </RecoilRoot>
    );
};


const rootElement: HTMLElement = document.getElementById('root');
if (rootElement) {
    const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);
    root.render(
        <App/>
    );
}
