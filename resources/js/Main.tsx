import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import Footer from "./components/_footer.js";
import Header from "./components/_header.js";
const Main: React.FC = () => {

    let index = 0;
    const arrowAction = (side : string) => {
        const guarantee:HTMLCollection = document.getElementsByClassName("guaranteeText");
        const countGuarantee:number = guarantee.length;
        const dots = document.getElementsByClassName("dot");
        if (side == "right") {
            guarantee[index].className = "guaranteeText";
            dots[index].className = "dot";
            index += 1;
            if (index == countGuarantee) index = 0;
            guarantee[index].className += " active";
            dots[index].className += " active";
        } else {
            guarantee[index].className = "guaranteeText";
            dots[index].className = "dot";
            index -= 1;
            if (index < 0) index = countGuarantee - 1;
            guarantee[index].className += " active";
            dots[index].className += " active";
        }
    }
    return (
        <>
            <div className={"parallax"} id={"target"}>
                <div className={"parallaxGroup"}>
                    <div className={"parallaxLayer parallaxImage parallaxLayer-deep"} id={"bgTarget"}>
                    </div>
                    <div className={"parallaxLayer parallaxImage parallaxLayer-base"} id={"bgTargetS"}>
                    </div>
                    <div className={"parallaxLayer content parallaxLayer-fore"}>
                        <Header/>
                        <div className={"block"} id={"targetBlock"}>
                            <h1>Сочные овощи и фрукты - прямо от природы к вашему столу!</h1>
                            <h2>Свежесть, качество и удобство доставки по <span
                                className={"highlight"}>Екатеринбургу</span></h2>
                        </div>
                    </div>
                </div>

            </div>
            <div className={"background"} id={"stats"}>
                <div className={"content"}>
                    <div className={"block"} id={"statsBlock"}>
                        <div className={"statsText"}>
                            <img src={"../image/icons/elements/basket.svg"} alt={"Заказы"}/>
                            <h3>Совершено более</h3>
                            <h2>1000 доставок</h2>
                        </div>
                        <div className={"statsText"}>
                            <img src={"../image/icons/elements/clients.svg"} alt={"Клиенты"}/>
                            <h3>Около </h3>
                            <h2>30 постоянных клиентов</h2>
                        </div>
                        <div className={"statsText"}>
                            <img src={"../image/icons/elements/clock.svg"} alt={"Лет"}/>
                            <h3>Работаем для вас</h3>
                        <h2>Более 8 лет</h2>
                        </div>
                    </div>
                </div>
            </div>
        <div className={"block"} id={"guaranteeBlock"}>
            <div className={"content"}>
                <h1>Гарантии:</h1>
                <div className={"guarantees"}>
                    <div className={"sliderLayout"}>
                        <div className={"dotsLayout"}>
                            <span className={"dot active"}></span>
                            <span className={"dot"}></span>
                            <span className={"dot"}></span>
                            <span className={"dot"}></span>
                        </div>
                        <div className={"arrows"}>
                            <button className={"icons"} id={"leftArrow"} onClick={(e) => arrowAction("left")}><span
                                className="material-symbols-outlined">arrow_back_ios</span></button>
                            <button className={"icons"} id={"rightArrow"}
                                    onClick={(e) => arrowAction("right")}><span
                                className="material-symbols-outlined">arrow_forward_ios</span></button>
                        </div>
                    </div>
                    <div className={"slider"}>
                        <div className={"guaranteeText active"}>
                            <div className={"imgGuarantee"}>
                                <img src={"image/background-images/woman.jpg"}/>
                            </div>
                            <div>
                                <h2>Качество</h2>
                                <h3>Мы гарантируем, что все овощи и фрукты, которые вы покупаете у нас, являются
                                    свежими
                                    и
                                    высокого качества. Мы работаем только с проверенными поставщиками и
                                    фермерами.</h3>
                            </div>
                        </div>
                        <div className={"guaranteeText"}>
                            <h2>Возврат</h2>
                            <h3> Если вы получили поврежденный или недоброкачественный продукт, сообщите нам в
                                течение
                                24 часов, и мы без проблем организуем возврат или обмен.</h3>
                        </div>
                        <div className={"guaranteeText"}>
                            <h2>Доставка</h2>
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
            </div>
        </div>
            <div className={"block"} id={"superiorityBlock"}>
                <div className={"content"}>
                    <h1>Отличия от конкурентов</h1>
                    <div className={"superiorityText"}>
                        <h2>Удобный интерфейс для доставки</h2>
                        <h2>Быстрая доставка</h2>
                        <h2>Выбираем удобное для вас время</h2>
                        <h2>Доступные цены и прозрачность</h2>
                        <h2>Возможность выбрать продукт самостоятельно</h2>
                    </div>
                </div>

            </div>
            <div className={"block"} id={"bestBlock"}>
                <div className={"content"}>
                    <h1>Только у нас <span className={"highlight"}>сладкие </span>и <span
                        className={"highlight"}>насыщенные</span> фрукты и овощи в нелетнее время</h1>
                </div>
            </div>
            <div className={"block"} id={"workBlock"}>
                <div className={"content"}>
                    <h1>Как мы работаем</h1>
                    <div className={"workText"}>
                        <div className={"workImg"}>
                            <img src={"../image/icons/elements"}/>
                        </div>
                        <div>
                            Вы совершаете заказ на сайте
                        </div>
                    </div>
                    <div className={"workText"}>
                        <div className={"workImg"}>
                            <img src={"../image/icons/elements"}/>
                        </div>
                        <div>
                            Курьер связывается с вами
                        </div>
                    </div>
                    <div className={"workText"}>
                        <div className={"workImg"}>
                            <img src={"../image/icons/elements"}/>
                        </div>
                        <div>
                            Вы назначаете удобное <span className={"highlight"}>для вас</span> время
                        </div>
                    </div>
                    <div className={"workText"}>
                        <div className={"workImg"}>
                            <img src={"../image/icons/elements"}/>
                        </div>
                        <div>
                            Вы получаете заказ в <span className={"highlight"}>указанный срок</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"block"} id={"faqBlock"}>
                <div className={"content"}>
                    <h1>FAQ</h1>
                    <div className={"questAnswerFaq"}>
                        <div className={"questFaq"}>
                            Как сделать заказ?
                        </div>
                        <div className={"answerFaq"}>
                            Чтобы сделать заказ, просто выберите необходимые фрукты и овощи на нашем сайте, добавьте их
                            в корзину и следуйте инструкциям на экране для оформления заказа
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"questFaq"}>
                            Какой минимальный размер заказа?
                        </div>
                        <div className={"answerFaq"}>
                            Минимальный размер заказа составляет <span className={"highlight"}> 500 рублей</span>. Это
                            позволяет нам обеспечить хорошую стоимость доставки и свежесть продуктов.
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"questFaq"}>
                            Как быстро доставляется заказ?
                        </div>
                        <div className={"answerFaq"}>
                            Мы доставляем заказы от <span className={"highlight"}> 10 минут</span> после их оформления,
                            в зависимости от загруженности и вашего местоположения.
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"questFaq"}>
                            Могу ли я изменить время доставки?
                        </div>
                        <div className={"answerFaq"}>
                            Да, вы можете изменить время доставки до момента, пока ваш заказ <span className={"highlight"}> не будет обработан</span>. Просто свяжитесь с нашим курьером.
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"questFaq"}>
                            Какие способы оплаты вы принимаете?
                        </div>
                        <div className={"answerFaq"}>
                            Мы принимаем <span className={"highlight"}> различные</span> способы оплаты
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"questFaq"}>
                            Что делать, если что-то не так с заказом?
                        </div>
                        <div className={"answerFaq"}>
                            Если с вашим заказом возникли проблемы, пожалуйста, свяжитесь с нашей службой поддержки, и мы постараемся решить вашу проблему как можно скорее.
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"questFaq"}>
                            Как я могу отменить заказ?
                        </div>
                        <div className={"answerFaq"}>
                            Вы можете отменить заказ, если <span className={"highlight"}>доставка еще не началась</span>. В противном случае мы удержим стоимость услуг курьера.
                        </div>
                    </div>
                </div>
            </div>
            <div className={"block"} id={"feedbackBlock"}>
                <div className={"content"}>

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
