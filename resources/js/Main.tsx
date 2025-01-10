import * as React from 'react'
import {useEffect, useRef, useState} from 'react';
import * as ReactDOM from 'react-dom/client';
import Footer from "./components/_footer.js";
import Header from "./components/Header/_header";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const random = gsap.utils.random;

import styles from "../sass/_componentsForMain.module.scss";
import {Link, useLocation} from "react-router-dom";
import axios from "axios";

gsap.registerPlugin(ScrollTrigger);

const Main: React.FC = () => {
    useEffect(() => {
        gsap.to("#bgTargetS", {
            yPercent: -150,
            ease: "sine",
            scrollTrigger: {
                trigger: "#bgTargetS",
                scrub: 3,
            }
        });
    })

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
    }, []);

    useEffect(() => {
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
    }, [])

    useEffect(() => {
        document.querySelectorAll("#superiorityBlock h2").forEach((element) => {
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
    }, []);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        document.querySelectorAll("#cartBlock .fruit").forEach((el,index) => {
            const offsetX = index * 250
            gsap.fromTo(el, {
                    x: offsetX,
                    y: -550
                },
                {
                    scrollTrigger: {
                        trigger: "#cartBlock",
                        start: "top 80%",
                        end: "top 45%",
                        scrub: 5,
                    },
                    x: 0,
                    rotate: random(-180,180),
                    y: 0
                })
        })
    }, []);

    useEffect(() => {
        gsap.to("#cartBlock",{
            scrollTrigger: {
                trigger: "#cartBlock",
                start: "top 45%",
                end: "top 30%",
                scrub: 5,
            },
            x: 0,
        })
    }, []);



    useEffect(() => {
        const openFaq = (element: Element) => {
            const classListElement = element.classList;
            if (classListElement.contains(styles.open)) {
                classListElement.remove(styles.open)
            } else {
                classListElement.add(styles.open)
            }
        }

        const questAnswer = document.querySelectorAll("." + styles.questAnswerFaq.toString());
        questAnswer.forEach((element) => {
            element.addEventListener('click', () => openFaq(element))
        });

        return () => {
            questAnswer.forEach((element) => {
                element.removeEventListener('click', () => openFaq(element));
            })
        }
    }, []);

    const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const fetchFeedbacks = async(page) => {
        setLoadingFeedbacks(true);
        const response = await axios.get(`api/feedback`, {
            params: {
                page: page
            }
        });
        setFeedbacks((prev) => [...prev, ...response.data.data]);
        setHasMore(response.data.current_page < response.data.last_page);
        setLoadingFeedbacks(false);
    }

    useEffect(() => {
        setFeedbacks([])
    }, []);

    useEffect(() => {
        setLoadingFeedbacks(true);

        const fetchData = async () => {
            await fetchFeedbacks(page);
        };

        if (page == 1 || !loadingFeedbacks) {
            fetchData();
        }

    }, [page])

    return (
        <div className={styles.root}>
            <Header className={styles.header}/>
            <div id={"target"} className={styles.target}>
                <div id={"bgTarget"} className={styles.bgTarget}></div>
                <div id={"bgTargetS"} className={styles.bgTargetS}></div>
                <div className={styles.content}>
                    <div className={`${styles.block} ${styles.targetBlock}`} id={"targetBlock"}>
                        <h1>Сочные овощи и фрукты - прямо от природы к вашему столу!</h1>
                        <h2>Свежесть, качество и удобство доставки по <span
                            className={styles.highlight}>Екатеринбургу</span></h2>
                    </div>
                </div>
            </div>
            <div className={`${styles.background} ${styles.stats}`} id={"stats"}>
                <div className={styles.content}>
                    <div id={"statsBlock"} className={styles.statsBlock}>
                        <div className={`${styles.statsText} statsText`}>
                            <img src={"../image/icons/elements/basket.svg"} loading={"lazy"} alt={"Заказы"}/>
                            <h3>Совершено более</h3>
                            <h2>1000 доставок</h2>
                        </div>
                        <div className={`${styles.statsText} statsText`}>
                            <img src={"../image/icons/elements/clients.svg"} loading={"lazy"} alt={"Клиенты"}/>
                            <h3>Около </h3>
                            <h2>30 постоянных клиентов</h2>
                        </div>
                        <div className={`${styles.statsText} statsText`}>
                            <img src={"../image/icons/elements/clock.svg"} loading={"lazy"} alt={"Лет"}/>
                            <h3>Работаем для вас</h3>
                            <h2>Более 8 лет</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.guaranteeBlock} guaranteeBlock`} id={"guaranteeBlock"}>
                <h1>Гарантии:</h1>
                <div className={styles.guarantees}>
                    <div className={"slider"}>
                        <div className={`${styles.sliderContent} slider-content`}>
                            <div className={styles.guaranteeText}>
                                <div className={styles.imgGuarantee}>
                                    <img src={"image/background-images/woman.webp"} loading={"lazy"} alt={"Девушка держит фрукты"}/>
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
                            <div className={styles.guaranteeText}>
                                <div className={styles.imgGuarantee}>
                                    <img src={"image/background-images/woman_refund.webp"} loading={"lazy"} alt={"Доставка фруктов"}/>
                                </div>
                                <div>
                                    <h2>Возврат</h2>
                                    <h3> Если вы получили поврежденный или недоброкачественный продукт, сообщите нам в
                                        течение
                                        24 часов, и мы без проблем организуем возврат или обмен.</h3>
                                </div>
                            </div>
                            <div className={styles.guaranteeText}>
                                <div className={styles.imgGuarantee}>
                                    <img src={"image/background-images/courier-delivering.webp"} loading={"lazy"} alt={"Доставка фруктов"}/>
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
                            <div className={styles.guaranteeText}>
                                <div className={styles.imgGuarantee}>
                                    <img src={"image/background-images/meal_with_transparency.webp"} loading={"lazy"} alt={"Фрукты на столе"}/>
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
            <div className={`${styles.block} ${styles.superiorityBlock}`} id={"superiorityBlock"}>
                <div className={styles.content}>
                    <h1>Отличия от конкурентов</h1>
                    <div className={`${styles.superiorityText} superiorityText`}>
                        <h2><span>1.</span> Удобный интерфейс для доставки</h2>
                        <h2><span>2.</span> Быстрая доставка</h2>
                        <h2><span>3.</span> Выбираем удобное для вас время</h2>
                        <h2><span>4.</span> Доступные цены и прозрачность</h2>
                        <h2><span>5.</span> Возможность выбрать продукт самостоятельно</h2>
                    </div>
                </div>
            </div>
            <div className={`${styles.block} ${styles.bestBlock}`} id={"bestBlock"}>
                <img src={"../image/background-images/fruits-falling-realistic-composition.webp"} loading={"lazy"} alt={""}/>
                <div className={styles.content}>
                    <h1>Только у нас <span className={styles.highlight}>сладкие </span>и <span
                        className={styles.highlight}>насыщенные</span> фрукты и овощи в нелетнее время</h1>
                </div>
            </div>
            <div className={`${styles.block} ${styles.workBlock}`} id={"workBlock"}>
                <div className={styles.content}>
                    <h1>Как мы работаем</h1>
                    <div className={styles.workMain}>
                        <div className={styles.work}>
                            <div className={styles.workImg}>
                                <img src={"../image/icons/elements/shopping.svg"} loading={"lazy"} alt={"Иконка корзина для продуктов"}/>
                            </div>
                            <div className={styles.workText}>
                                Вы совершаете заказ на сайте
                            </div>
                        </div>
                        <div className={styles.work}>
                            <div className={styles.workImg}>
                                <img src={"../image/icons/elements/chat.svg"} loading={"lazy"} alt={"Иконка сообщения"}/>
                            </div>
                            <div className={styles.workText}>
                                Курьер связывается с вами
                            </div>
                        </div>
                        <div className={styles.work}>
                            <div className={styles.workImg}>
                                <img src={"../image/icons/elements/clock-lines.svg"} loading={"lazy"} alt={"Иконка таймера"}/>
                            </div>
                            <div className={styles.workText}>
                                Вы назначаете удобное <span className={styles.highlight}>для вас</span> время
                            </div>
                        </div>
                        <div className={styles.work}>
                            <div className={styles.workImg}>
                                <img src={"../image/icons/elements/delivery.svg"} loading={"lazy"} alt={"Иконка движущийся грузовой машины"}/>
                            </div>
                            <div className={styles.workText}>
                                Вы получаете заказ в <span className={styles.highlight}>указанный срок</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.block} ${styles.faqBlock}`} id={"faqBlock"}>
                <div className={styles.content}>
                    <h1>FAQ</h1>
                    <div className={styles.questAnswerFaq}>
                        <div className={styles.headFaq}>
                            <div className={styles.iconPlus}><span className="material-symbols-outlined">add</span>
                            </div>
                            <div className={styles.questFaq}>
                                Как сделать заказ?
                            </div>
                        </div>
                        <div className={styles.answerFaq}>
                            Чтобы сделать заказ, просто выберите необходимые фрукты и овощи на нашем сайте, добавьте
                            их
                            в корзину и следуйте инструкциям на экране для оформления заказа
                        </div>
                    </div>
                    <div className={styles.questAnswerFaq}>
                        <div className={styles.headFaq}>
                            <div className={styles.iconPlus}><span className="material-symbols-outlined">add</span>
                            </div>
                            <div className={styles.questFaq}>
                                Какой минимальный размер заказа?
                            </div>
                        </div>
                        <div className={styles.answerFaq}>
                            Минимальный размер заказа составляет <span className={styles.highlight}> 500 рублей</span>.
                            Это
                            позволяет нам обеспечить хорошую стоимость доставки и свежесть продуктов.
                        </div>
                    </div>
                    <div className={styles.questAnswerFaq}>
                        <div className={styles.headFaq}>
                            <div className={styles.iconPlus}><span className="material-symbols-outlined">add</span></div>
                            <div className={styles.questFaq}>
                                Как быстро доставляется заказ?
                            </div>
                        </div>
                        <div className={styles.answerFaq}>
                            Мы доставляем заказы от <span className={styles.highlight}> 10 минут</span> после их
                            оформления,
                            в зависимости от загруженности и вашего местоположения.
                        </div>
                    </div>
                    <div className={styles.questAnswerFaq}>
                        <div className={styles.headFaq}>
                            <div className={styles.iconPlus}><span className="material-symbols-outlined">add</span></div>
                            <div className={styles.questFaq}>
                                Могу ли я изменить время доставки?
                            </div>
                        </div>
                        <div className={styles.answerFaq}>
                            Да, вы можете изменить время доставки до момента, пока ваш заказ <span
                            className={styles.highlight}> не будет обработан</span>. Просто свяжитесь с нашим курьером.
                        </div>
                    </div>
                    <div className={styles.questAnswerFaq}>
                        <div className={styles.headFaq}>
                            <div className={styles.iconPlus}><span className="material-symbols-outlined">add</span></div>
                            <div className={styles.questFaq}>
                                Какие способы оплаты вы принимаете?
                            </div>
                        </div>
                        <div className={styles.answerFaq}>
                            Мы принимаем <span className={styles.highlight}> различные</span> способы оплаты
                        </div>
                    </div>
                    <div className={styles.questAnswerFaq}>
                        <div className={styles.headFaq}>
                            <div className={styles.iconPlus}><span className="material-symbols-outlined">add</span></div>
                            <div className={styles.questFaq}>
                                Что делать, если что-то не так с заказом?
                            </div>
                        </div>
                        <div className={styles.answerFaq}>
                            Если с вашим заказом возникли проблемы, пожалуйста, свяжитесь с нашей службой поддержки,
                            и мы постараемся решить вашу проблему как можно скорее.
                        </div>
                    </div>
                    <div className={styles.questAnswerFaq}>
                        <div className={styles.headFaq}>
                            <div className={styles.iconPlus}><span className="material-symbols-outlined">add</span></div>
                            <div className={styles.questFaq}>
                                Как я могу отменить заказ?
                            </div>
                        </div>
                        <div className={styles.answerFaq}>
                            Вы можете отменить заказ, если <span
                            className={styles.highlight}>доставка еще не началась</span>. В противном случае мы удержим
                            стоимость услуг курьера.
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.block} ${styles.cartBlock}`} id={"cartBlock"}>
                <div className={styles.left}>
                    <Link to={'/products'}>Заказать</Link>
                </div>
                <div className={styles.right}>
                    <img className={`${styles.fruit} fruit`} src={"image/fruits/apple.webp"} loading={"lazy"} alt={"Яблоко"}/>
                    <img className={`${styles.fruit} fruit`} src={"image/fruits/onion.webp"} loading={"lazy"} alt={"Лук"}/>
                    <img className={`${styles.fruit} fruit`} src={"image/fruits/carrot.webp"} loading={"lazy"} alt={"Морковь"}/>
                    <img className={`${styles.fruit} fruit`} src={"image/fruits/eggplant.webp"} loading={"lazy"} alt={"Баклажан"}/>
                    <img className={`${styles.fruit} fruit`} src={"image/fruits/garlic.webp"} loading={"lazy"} alt={"Чеснок"}/>
                    <img className={`${styles.fruit} fruit`} src={"image/fruits/orange.webp"} loading={"lazy"} alt={"Апельсин"}/>
                    <img className={`${styles.cart} cart`} src={"image/fruits/cart.webp"} loading={"lazy"} alt={"Корзина для продуктов"}/>
                </div>
            </div>
            <div className={`${styles.block} ${styles.feedbackBlock}`} id={"feedbackBlock"}>
                <div className={styles.content}>
                    <h1>Отзывы:</h1>
                    {feedbacks && feedbacks.map((feedback) => (
                        <div className={styles.feedback} key={feedback.id}>
                            <div className={styles.userName}>
                                {feedback.user_name}
                            </div>
                            <div className={styles.message}>
                                {feedback.message}
                            </div>
                            <div className={styles.star}>
                                <span className={"material-symbols-outlined"}>star_rate</span>
                                <div>
                                    {feedback.rating}
                                </div>
                            </div>
                            <div className={styles.date}>
                                {feedback.created_at.slice(0, 10)}
                            </div>
                        </div>
                    ))}
                    {loadingFeedbacks && <h2>Загрузка...</h2>}
                    {!loadingFeedbacks && hasMore && <button onClick={() => setPage(page + 1)}>Загрузить ещё</button>}
                    {!loadingFeedbacks && feedbacks && feedbacks.length == 0 && <h2>Отзывов пока нету</h2>}
                </div>
            </div>
            <div className={styles.block}>
                <Footer/>
            </div>
        </div>
    )
};

export default Main;
