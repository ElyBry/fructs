import * as React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Products from './Products'
import Main from './Main'
import SignInUp from "./SignInUp";

import {RecoilRoot} from "recoil";
import * as ReactDOM from "react-dom/client";
import Orders from "./Orders";


const App = () => {
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
