import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Footer } from "./components/_footer.jsx";
import { Header } from "./components/_header.jsx";
const Main = () => {
    return  (
        <div>
            <Header />
            <Footer />
        </div>
    );
};


const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<Main/>);
}
