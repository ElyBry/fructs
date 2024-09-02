import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import Footer from "./components/_footer.js";
import Header from "./components/_header.js";
const Main: React.FC = () => {
    return (
        <>
            <div id={"bg"}>
                <div className={"content"}>
                    <Header/>
                    <div className={"block"} id={"targetBlock"}>
                        <h1>Сочные овощи и фрукты - прямо от природы к вашему столу!</h1>
                        <h2>Свежесть, качество и удобство доставки по <span
                            className={"highlight"}>Екатеринбургу</span></h2>
                    </div>
                </div>
            </div>
            <div className={"block"} id={"infoBlock"}>
                <div className={"content"}>
                    <div className={"infoText"}>
                        <h3>Совершено более</h3>
                        <h2>100 заказов</h2>
                    </div>
                    <div className={"infoText"}>
                        <h3>Около </h3>
                        <h2>30 постоянных клиентов</h2>
                    </div>
                    <div className={"infoText"}>
                        <h3>Работаем для вас</h3>
                        <h2>Более 8 лет</h2>
                    </div>
                </div>
            </div>
            <div className={"block"} id={"guaranteeBlock"}>
                <div className={"content"}>
                    <h1>Гарантии:</h1>
                    <div className={"guaranteeText"}>
                        <h2>Гарантия качества</h2>
                        <h3>Мы гарантируем, что все овощи и фрукты, которые вы покупаете у нас, являются свежими
                            и
                            высокого качества. Мы работаем только с проверенными поставщиками и фермерами.</h3>
                    </div>
                    <div className={"guaranteeText"}>
                        <h2>Гарантия возврата</h2>
                        <h3> Если вы получили поврежденный или недоброкачественный продукт, сообщите нам в
                            течение
                            24 часов, и мы без проблем организуем возврат или обмен.</h3>
                    </div>
                    <div className={"guaranteeText"}>
                        <h2>Гарантия доставки</h2>
                        <h3>Мы стремимся доставлять ваш заказ в оговоренные сроки. Если по какой-то причине ваш
                            заказ не был доставлен в срок, сообщите нам, и мы предложим вам компенсацию или
                            сюрприз
                            в следующем заказе!</h3>
                    </div>
                    <div className={"guaranteeText"}>
                        <h2>Прозрачность</h2>
                        <h3>Мы предоставляем полную информацию о каждом продукте, включая его происхождение и
                            состав, чтобы вы могли делать осознанный выбор.</h3>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
};


const rootElement: HTMLElement = document.getElementById('root');
if (rootElement) {
    const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);
    root.render(<Main/>);
}
