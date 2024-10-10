import * as React from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {cartAtom, totalCostAtom, quantityAtom} from "./cartAtom";
import useCart from "./useCart"
import {useEffect, useState} from "react";
import YandexMap from "../Map/YandexMap";
import axios from "axios";

import styles from "../../../sass/_cart.module.scss";

const Cart = ({ isOpenCart }) => {
    const cart = useRecoilValue(cartAtom);
    const quantity = useRecoilValue(quantityAtom);
    const totalCost = useRecoilValue(totalCostAtom);
    const { addItem, removeItem, updateItemQuantity } = useCart();

    const [discount, setDiscount] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [stage, setStage] = useState(0);

    const [address, setAddress] = useState('');
    const [numPhone, setNumPhone] = useState('');
    const [flat, setFlat] = useState('');
    const [floor, setFloor] = useState('');
    const [entrance, setEntrance] = useState('');
    const [intercom, setIntercom] = useState('');
    const [comment, setComment] = useState('');

    const [howConnect, setHowConnect] = useState('call');
    const [howSocial, setHowSocial] = useState('');

    const [howDeliver, setHowDeliver] = useState('pickup');

    const [tradingPoint, setTradingPoint] = useState([]);
    const [pickedTradePoint, setPickedTradePoint] = useState('');
    const [loadingTradingPoints , setLoadingTradingPoints] = useState(false);

    const [isLogged, setIsLogged] = useState(false);


    const fetchTradingPoints = async () => {
        if (tradingPoint.length > 0) return;
        try {
            setLoadingTradingPoints(true);
            const response = await axios.get('api/tradingPoints');
            const data = response.data.data;
            if (data) {
                setTradingPoint(data);
            } else {
                setTradingPoint([]);
            }

            setLoadingTradingPoints(false);
        } catch (e) {
            console.log(e);
        }
    }

    const [promo, setPromo] = useState('');
    const [loadingPromo, setLoadingPromo] = useState(false);
    const [errorPromo, setErrorPromo] = useState('');

    const verifyPromo = async () => {
        if (discountPercent > 0) {
            setErrorPromo("Вы уже ввели промокод");
            return;
        }
        try {
            setLoadingPromo(true);
            const response = await axios.get('api/promoVerify',{
                params: {
                    name: promo
                }
            })
            if (response.data.data == 0) {
                setErrorPromo(response.data.message)
            } else {
                setErrorPromo(response.data.message)
                setDiscountPercent(parseInt(response.data.data));
            }
            setLoadingPromo(false);
        } catch (e) {
            if (e.status == 429) {
                setErrorPromo('Превышено количество попыток, попробуйте позже)');
            } else {
                console.log(e)
            }
        }
    }

    return (
        <div id={"cart"} className={`${styles.cart} ${isOpenCart && quantity > 0 ? styles.visible : ""}`}>
            <div id="cartBlock" className={styles.cartBlock}>
                <div className={`${styles.infoOrder} ${styles.zeroStage} ${stage == 0 ? styles.active : ""}`}>
                    <div className={styles.table}>
                        <table>
                            <thead>
                            <tr>
                                <th className={styles.name}>Название</th>
                                <th className={styles.quantity}>Количество</th>
                                <th className={styles.price}>Цена</th>
                                <th className={styles.res}>Итого:</th>
                                <th className={styles.remove}></th>
                            </tr>
                            </thead>
                            <tbody>
                            {cart.map((item) =>
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td className={styles.quantity}>
                                        <input name={"quantity"}
                                               type={"number"}
                                               value={item.quantity}
                                               onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                                        />
                                    </td>
                                    <td className={styles.price}>{item.price}р / {`${item.weight} ${item.type_weight}`}</td>
                                    <td className={styles.price}>{item.price * item.quantity}р
                                        / {`${item.weight * item.quantity} ${item.type_weight}`} </td>
                                    <td>
                                        <button className={styles.remove} onClick={() => removeItem(item.id)}><span
                                            className="material-symbols-outlined">delete</span>Удалить
                                        </button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.result}>
                        {discountPercent != 0 &&
                            <>
                                <div>
                                    Без скидки: {totalCost}р
                                </div>
                                <div>
                                    Скидка: <span id={"discount"} className={styles.discount}>{discountPercent}%</span><br/>
                                    В рублях: {totalCost - Math.round(totalCost * (1 - discountPercent * 0.01))}р
                                </div>
                            </>
                        }
                        <div>
                            К оплате: {Math.round(totalCost * (1 - discountPercent * 0.01))}р
                        </div>
                    </div>
                    <div className={styles.promo}>
                        <input type={"text"} name={"promo"} placeholder={"ПРОМОКОД"}
                               onChange={(e) => setPromo(e.target.value)}/>
                        <button onClick={() => verifyPromo()}>Применить промокод<span
                            className="material-symbols-outlined">favorite</span></button>
                    </div>
                    <h3>{loadingPromo ? "Поиск промокода..." : errorPromo}</h3>
                    {isLogged ?
                        <button className={styles.next} onClick={() => {
                            setStage(stage + 1);
                            fetchTradingPoints();
                        }}>Начать оформление заказа<span
                            className="material-symbols-outlined">arrow_forward</span>
                        </button>
                        :
                        <button className={styles.next} onClick={() => {

                        }}>
                            Авторизоваться/ Зарегистрироваться
                        </button>
                    }
                </div>
                <div className={`${styles.infoOrder} ${styles.firstStage} ${stage == 1 ? styles.active : ""}`}>
                    <div className={styles.type}>
                        <h1>Тип платежа?</h1>
                        <div>
                            <input type={"radio"} id={"cash"} name={"typePay"} defaultChecked={true}/>
                            <label htmlFor={"cash"}><span className="material-symbols-outlined">currency_ruble</span>Наличными</label>
                            <input type={"radio"} id={"cashless"} name={"typePay"}/>
                            <label htmlFor={"cashless"}><span className="material-symbols-outlined">credit_card</span>Безналичными</label>
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.back} onClick={() => setStage(stage - 1)}>
                        <span className="material-symbols-outlined">arrow_back</span>Назад
                        </button>
                        <button className={styles.next} onClick={() => setStage(stage + 1)}>Продолжить оформление заказа<span
                            className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
                <div className={`${styles.infoOrder} ${styles.secondStage} ${stage == 2 ? styles.active : ""}`}>
                    <div className={styles.left}>
                        <h1>Как доставить заказ?</h1>
                        <h2>Доставка по всему Екатеринбургу</h2>
                        <div className={"type"}>
                            <div className={styles.howDeliverBlock}>
                                <input type={"radio"} id={"pickup"} name={"howDeliver"} defaultChecked={true}
                                       onChange={(e) => setHowDeliver(e.target.id)}/>
                                <label htmlFor={"pickup"}>Самовывоз</label>
                                <input type={"radio"} id={"delivery"} name={"howDeliver"}
                                       onChange={(e) => setHowDeliver(e.target.id)}/>
                                <label htmlFor={"delivery"}>Курьер</label>
                            </div>
                            <div className={`${styles.tradingPoints} ${howDeliver == "pickup" ? styles.visible : ""}`}>
                                {tradingPoint.length > 0
                                    &&
                                    tradingPoint.map((point) => (
                                        <>
                                            <input type={"radio"} key={point.id} id={point.name} name={"pickedTradePoint"}
                                                   onChange={(e) => setPickedTradePoint(e.target.id)}/>
                                            <label htmlFor={point.name}>
                                                {point.address}
                                            </label>
                                        </>
                                    ))
                                }
                                {tradingPoint.length <= 0 && !loadingTradingPoints && <h2>Точек продаж не найдено</h2>}
                            </div>
                        </div>
                        <div className={styles.type}>
                            <h1>Как с вами связаться?</h1>
                            <h2>Курьер свяжется с вами в ближайшее время</h2>
                            <div className={styles.typePick}>
                                <div>
                                    <input type={"radio"} id={"call"} name={"howConnect"} defaultChecked={true}
                                           onChange={(e) => setHowConnect(e.target.id)}/>
                                    <label htmlFor={"call"}>Позвонить</label>
                                    <input type={"radio"} id={"soc"} name={"howConnect"}
                                           onChange={(e) => setHowConnect(e.target.id)}/>
                                    <label htmlFor={"soc"}>Написать в:</label>
                                </div>
                                <div className={`${styles.socials} ${howConnect == "soc" ? styles.visible : ""}`}>
                                    <input type={"radio"} id={"whatsapp"} name={"howSoc"}
                                           onChange={(e) => setHowSocial(e.target.id)}/>
                                    <label htmlFor={"whatsapp"}>Ватсап</label>
                                    <input type={"radio"} id={"telegram"} name={"howSoc"}
                                           onChange={(e) => setHowSocial(e.target.id)}/>
                                    <label htmlFor={"telegram"}>Телеграм</label>
                                    <input type={"radio"} id={"viber"} name={"howSoc"}
                                           onChange={(e) => setHowSocial(e.target.id)}/>
                                    <label htmlFor={"viber"}>Вайбер</label>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.location} ${howDeliver != "pickup" ? styles.visible : ""}`}>
                            <div>
                                <label>Адрес</label>
                                <input type={"text"} name={"address"}
                                       onChange={(e) => setAddress(e.target.value)}/>
                            </div>
                            <div>
                                <label>Квартира</label>
                                <input type={"text"} name={"flat"}
                                       onChange={(e) => {
                                           setFlat(e.target.value)
                                       }}/>
                            </div>
                            <div>
                                <label>Этаж</label>
                                <input type={"text"} name={"floor"}
                                       onChange={(e) => {
                                           setFloor(e.target.value)
                                       }}/>
                            </div>
                            <div>
                                <label>Подьезд</label>
                                <input type={"text"} name={"entrance"}
                                       onChange={(e) => {
                                           setEntrance(e.target.value)
                                       }}/>
                            </div>
                            <div>
                                <label>Домофон</label>
                                <input type={"text"} name={"intercom"}
                                       onChange={(e) => {
                                           setIntercom(e.target.value)
                                       }}/>
                            </div>
                            <div>
                                <label>Комментарий для курьера</label>
                                <input type={"text"} name={"comment"}
                                       onChange={(e) => {
                                           setComment(e.target.value)
                                       }}/>
                            </div>
                        </div>
                        <div className={styles.buttons}>
                            <button className={styles.back} onClick={() => setStage(stage - 1)}>
                                <span className="material-symbols-outlined">arrow_back</span>Назад
                            </button>
                            <button className={styles.submit} onClick={() => setStage(stage + 1)}>Далее<span
                                className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.right}>
                        {"<YandexMap/>"}
                    </div>
                </div>
                <div className={`${styles.infoOrder} ${styles.thirdStage} ${stage == 3 ? styles.active : ""}`}>
                    <h1>Пожалуйста, проверьте ваши данные</h1>

                    <div className={styles.buttons}>
                        <button className={styles.back} onClick={() => setStage(stage - 1)}>
                            <span className="material-symbols-outlined">arrow_back</span>Назад
                        </button>
                        <button className={styles.submit} onClick={() => setStage(stage + 1)}>Заказать<span
                            className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
                <div className={`${styles.infoOrder} ${styles.lastStage} ${stage == 4 ? styles.active : ""}`}>
                    <h1>Благодарим за заказ</h1>
                    <h2>В ближайшее время с вами свяжется курьер для уточнения деталей заказа</h2>
                </div>
            </div>
        </div>
    )
}

export default Cart;
