import * as React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Products from './Products'
import Main from './Main'
import SignInUp from "./SignInUp";

import {RecoilRoot} from "recoil";
import * as ReactDOM from "react-dom/client";
import Orders from "./Orders";
import AdminOrders from './forAdmins/Orders';
import Users from './forAdmins/Users';
import AdminProducts from './forAdmins/Products'
import TradePoints from "./forAdmins/TradePoints";
import Feedbacks from "./forAdmins/Feedbacks";
import FeedbacksProducts from "./forAdmins/FeedbacksProducts";
import TypeProducts from "./forAdmins/TypeProducts";

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
                    <Route path="/admin/users" element={checkRole(['Super Admin', 'Admin']) ? <Users/> : <Navigate to={"/login"}/>}/>
                    <Route path="/admin/products" element={checkRole(['Super Admin', 'Admin', 'Manager']) ? <AdminProducts/> : <Navigate to={"/login"}/>}/>
                    <Route path="/admin/feedbacks" element={checkRole(['Super Admin', 'Admin', 'Manager']) ? <Feedbacks/> : <Navigate to={"/login"}/>}/>
                    <Route path="/admin/feedbacksProducts" element={checkRole(['Super Admin', 'Admin', 'Manager']) ? <FeedbacksProducts/> : <Navigate to={"/login"}/>}/>
                    <Route path="/admin/tradePoints" element={checkRole(['Super Admin', 'Admin', 'Manager']) ? <TradePoints/> : <Navigate to={"/login"}/>}/>
                    <Route path="/admin/typeProducts" element={checkRole(['Super Admin', 'Admin', 'Manager']) ? <TypeProducts/> : <Navigate to={"/login"}/>}/>
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
