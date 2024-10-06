import * as React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Products from './Products'
import Main from './Main'
import SignInUp from "./SignInUp";

import {RecoilRoot} from "recoil";
import * as ReactDOM from "react-dom/client";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path={"/"} element={<Main />}/>
                <Route path="/products" element={<RecoilRoot><Products/></RecoilRoot>}/>
                <Route path="/login" element={<SignInUp />}/>
            </Routes>
        </Router>
    );
};


const rootElement: HTMLElement = document.getElementById('root');
if (rootElement) {
    const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);
    root.render(
        <App/>
    );
}
