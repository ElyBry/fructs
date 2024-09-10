// @ts-ignore
import React, {useEffect, useRef} from 'react';
import * as ReactDOM from 'react-dom/client';
import Footer from "./components/_footer.js";
import Header from "./components/_header.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const random = gsap.utils.random;

gsap.registerPlugin(ScrollTrigger);

const Main: React.FC = () => {
    useEffect(() => {
        gsap.from(".statsText:nth-child(odd)", {
            scrollTrigger: {
                trigger: "#stats",
                start: "top 80%",
                end: "top 20%",
                scrub: 3,
            },
            yPercent: 150
        })
        gsap.to("#bgTargetS", {
            yPercent: -150,
            ease: "sine",
            scrollTrigger: {
                trigger: "#bgTargetS",
                scrub: 3
            }
        });
        const scrollContainer = document.querySelector('.slider');
        const horizontalScroll = document.querySelector('.slider-content');

        const totalWidth = horizontalScroll.scrollWidth;
        const containerHeight = scrollContainer.clientHeight;

        gsap.to(horizontalScroll, {
            scrollTrigger: {
                trigger: scrollContainer,
                start: "top 10%",
                end: () => `+=${totalWidth}`,
                scrub: 5,
                pin: true,
            },
            x: () => -totalWidth + containerHeight,
        });
        document.querySelectorAll(".superiorityText h2").forEach((element) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "top center",
                    scrub: 3,
                },
                x: -1200
            })
        });
        gsap.fromTo("#bestBlock h1",
            {
                opacity: 0,
                x: 1000
            },
            {
                opacity: 1,
                duration: 1,
                x: 0,
                scrollTrigger: {
                    trigger: "#bestBlock",
                    start: "top center",
                    end: "top top",
                    scrub: 5,
                }
            })
        document.querySelectorAll("#cartBlock .fruit").forEach((el,index) => {
            const offsetX = index * 250
            gsap.fromTo(el, {
                    x: offsetX,
                },
                {
                    scrollTrigger: {
                        trigger: "#cartBlock",
                        start: "top center",
                        markers: true,
                        end: "top 30%",
                        scrub: 5,
                    },
                    x: random(250,500),
                    rotate: random(-180,180),
                    y: window.innerHeight * 0.2
                })
        })
        gsap.to("#cartBlock",{
            scrollTrigger: {
                trigger: "#cartBlock",
                start: "top top",
                markers: true,
                scrub: 5,
            },
            x: 1500,
        })
        document.querySelectorAll(".questAnswerFaq").forEach((element) => {
            element.addEventListener('click', () => openFaq(element))
        });
    })
    const openFaq = (element: Element) => {
        const classListElement = element.classList;
        if (classListElement.contains("open")) {
            classListElement.remove("open")
        } else {
            classListElement.add("open")
        }
    }
    return (
        <>
            <Header/>
            <div id={"target"}>
                <div id={"bgTarget"}></div>
                <div id={"bgTargetS"}></div>
                <div className={"content"}>
                    <div className={"block"} id={"targetBlock"}>
                        <h1>Сочные овощи и фрукты - прямо от природы к вашему столу!</h1>
                        <h2>Свежесть, качество и удобство доставки по <span
                            className={"highlight"}>Екатеринбургу</span></h2>
                    </div>
                </div>
            </div>
            <div className={"background"} id={"stats"}>
                <div className={"content"}>
                    <div id={"statsBlock"}>
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
                <h1>Гарантии:</h1>
                <div className={"guarantees"}>
                    <div className={"slider"}>
                        <div className={"slider-content"}>
                            <div className={"guaranteeText"}>
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
                                <div className={"imgGuarantee"}>
                                    <img src={"image/background-images/woman_refund.jpg"}/>
                                </div>
                                <div>
                                    <h2>Возврат</h2>
                                    <h3> Если вы получили поврежденный или недоброкачественный продукт, сообщите нам в
                                        течение
                                        24 часов, и мы без проблем организуем возврат или обмен.</h3>
                                </div>
                            </div>
                            <div className={"guaranteeText"}>
                                <div className={"imgGuarantee"}>
                                    <img src={"image/background-images/courier-delivering.jpg"}/>
                                </div>
                                <div>
                                    <h2>Доставка</h2>
                                    <h3>Мы стремимся доставлять ваш заказ в оговоренные сроки. Если по какой-то причине
                                        ваш
                                        заказ не был доставлен в срок, сообщите нам, и мы предложим вам компенсацию или
                                        сюрприз
                                        в следующем заказе!</h3>
                                </div>

                            </div>
                            <div className={"guaranteeText"}>
                                <div className={"imgGuarantee"}>
                                    <img src={"image/background-images/meal_with_transparency.jpg"}/>
                                </div>
                                <div>
                                    <h2>Прозрачность</h2>
                                    <h3>Мы предоставляем полную информацию о каждом продукте, включая его происхождение
                                        и
                                        состав, чтобы вы могли делать осознанный выбор.</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"block"} id={"superiorityBlock"}>
                <div className={"content"}>
                    <h1>Отличия от конкурентов</h1>
                    <div className={"superiorityText"}>
                        <h2><span>1.</span> Удобный интерфейс для доставки</h2>
                        <h2><span>2.</span> Быстрая доставка</h2>
                        <h2><span>3.</span> Выбираем удобное для вас время</h2>
                        <h2><span>4.</span> Доступные цены и прозрачность</h2>
                        <h2><span>5.</span> Возможность выбрать продукт самостоятельно</h2>
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
                        <div className={"headFaq"}>
                            <div className={"icon-plus"}><span className="material-symbols-outlined">add</span></div>
                            <div className={"questFaq"}>
                                Как сделать заказ?
                            </div>
                        </div>
                        <div className={"answerFaq"}>
                            Чтобы сделать заказ, просто выберите необходимые фрукты и овощи на нашем сайте, добавьте
                            их
                            в корзину и следуйте инструкциям на экране для оформления заказа
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"headFaq"}>
                            <div className={"icon-plus"}><span className="material-symbols-outlined">add</span></div>
                            <div className={"questFaq"}>
                                Какой минимальный размер заказа?
                            </div>
                        </div>
                        <div className={"answerFaq"}>
                            Минимальный размер заказа составляет <span className={"highlight"}> 500 рублей</span>.
                            Это
                            позволяет нам обеспечить хорошую стоимость доставки и свежесть продуктов.
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"headFaq"}>
                            <div className={"icon-plus"}><span className="material-symbols-outlined">add</span></div>
                            <div className={"questFaq"}>
                                Как быстро доставляется заказ?
                            </div>
                        </div>
                        <div className={"answerFaq"}>
                            Мы доставляем заказы от <span className={"highlight"}> 10 минут</span> после их
                            оформления,
                            в зависимости от загруженности и вашего местоположения.
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"headFaq"}>
                            <div className={"icon-plus"}><span className="material-symbols-outlined">add</span></div>
                            <div className={"questFaq"}>
                                Могу ли я изменить время доставки?
                            </div>
                        </div>
                        <div className={"answerFaq"}>
                            Да, вы можете изменить время доставки до момента, пока ваш заказ <span
                            className={"highlight"}> не будет обработан</span>. Просто свяжитесь с нашим курьером.
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"headFaq"}>
                            <div className={"icon-plus"}><span className="material-symbols-outlined">add</span></div>
                            <div className={"questFaq"}>
                                Какие способы оплаты вы принимаете?
                            </div>
                        </div>
                        <div className={"answerFaq"}>
                            Мы принимаем <span className={"highlight"}> различные</span> способы оплаты
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"headFaq"}>
                            <div className={"icon-plus"}><span className="material-symbols-outlined">add</span></div>
                            <div className={"questFaq"}>
                                Что делать, если что-то не так с заказом?
                            </div>
                        </div>
                        <div className={"answerFaq"}>
                            Если с вашим заказом возникли проблемы, пожалуйста, свяжитесь с нашей службой поддержки,
                            и мы постараемся решить вашу проблему как можно скорее.
                        </div>
                    </div>
                    <div className={"questAnswerFaq"}>
                        <div className={"headFaq"}>
                            <div className={"icon-plus"}><span className="material-symbols-outlined">add</span></div>
                            <div className={"questFaq"}>
                                Как я могу отменить заказ?
                            </div>
                        </div>
                        <div className={"answerFaq"}>
                            Вы можете отменить заказ, если <span
                            className={"highlight"}>доставка еще не началась</span>. В противном случае мы удержим
                            стоимость услуг курьера.
                        </div>
                    </div>
                </div>
            </div>
            <div className={"block"} id={"cartBlock"}>
                <img className={"fruit"} src={"image/fruits/apple.png"}/>
                <img className={"fruit"} src={"image/fruits/onion.png"}/>
                <img className={"fruit"} src={"image/fruits/carrot.png"}/>
                <img className={"fruit"} src={"image/fruits/eggplant.png"}/>
                <img className={"fruit"} src={"image/fruits/garlic.png"}/>
                <img className={"fruit"} src={"image/fruits/orange.png"}/>
                <img className={"cart"} src={"image/fruits/cart.png"}/>
                <div className={"content"}>
                    <button>Заказать</button>
                </div>
            </div>
            <div className={"block"} id={"feedbackBlock"}>
                <div className={"content"}>
                    <h1>Отзывы:</h1>
                </div>
            </div>
            <div className={"block"}>
                <Footer/>
            </div>
        </>
    )
};


const rootElement: HTMLElement = document.getElementById('root');
if (rootElement) {
    const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);
    root.render(<Main/>);
}
