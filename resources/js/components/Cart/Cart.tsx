import * as React from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {cartAtom, totalCostAtom, quantityAtom} from "./cartAtom";
import useCart from "./useCart"
import {useEffect, useState} from "react";
import YandexMap from "../Map/YandexMap";
import axios from "axios";

import styles from "../../../sass/_cart.module.scss";
import {Link, useNavigate} from "react-router-dom";

import {isValidPhoneNumber, parsePhoneNumber} from "libphonenumber-js";
import {userIsAuth} from "../User/userAtom";
import Alert from "../Alert/Alert";

const Cart = ({ isOpenCart }) => {

    const navigate = useNavigate();

    const [cart, setCart] = useRecoilState(cartAtom);
    const quantity = useRecoilValue(quantityAtom);
    const totalCost = useRecoilValue(totalCostAtom);
    const { addItem, removeItem, updateItemQuantity } = useCart();

    const [discountPercent, setDiscountPercent] = useState(0);
    const [stage, setStage] = useState(0);

    const [address, setAddress] = useState('');
    const [flat, setFlat] = useState('');
    const [floor, setFloor] = useState('');
    const [entrance, setEntrance] = useState('');
    const [comment, setComment] = useState('');

    const [howConnect, setHowConnect] = useState('call');
    const [howSocial, setHowSocial] = useState('');
    const [number, setNumber] = useState('');
    const [howDeliver, setHowDeliver] = useState('pickup');

    const [tradingPoint, setTradingPoint] = useState([]);
    const [pickedTradePoint, setPickedTradePoint] = useState('');
    const [loadingTradingPoints , setLoadingTradingPoints] = useState(false);

    const [isAuth,setIsAuth] = useRecoilState(userIsAuth);
    const [error, setError] = useState('');

    const [loadingPayments, setLoadingPayments] = useState(false);
    const [payments, setPayments] = useState([]);
    const [paymentId,setPaymentId] = useState(1);

    const [loadOrder, setLoadOrder ] = useState(false);

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
        } catch (e) {
            if (e.status == 429) {
                setErrorPromo('Превышено количество попыток, попробуйте позже)');
            } else {
                console.log(e)
            }
        } finally {
            setLoadingPromo(false);
        }
    }

    const convertPhoneNumber = (inp) => {
        if (isValidPhoneNumber(inp, 'RU')) {
            const phoneNumber = parsePhoneNumber(inp, 'RU')
            setNumber(phoneNumber.formatNational())
        } else {
            setNumber(inp);
        }
    }
    const checkDeliver = () => {
        let err = '';
        if (howDeliver == 'pickup') {
            if (pickedTradePoint == '') err = 'Пожалуйста, выберите откуда собираетесь забирать заказ'
        } else {
            if (address == '' && address.length > 3) err ='Пожалуйста проверьте адрес'
            if (floor == '') err = 'Напишите этаж'
            if (flat == '') err = 'Напишите квартиру'
            if (entrance == '') err = 'Напишите подьезд'
        }
        if (howConnect == 'soc' && howSocial == '') {
            err = 'Пожалуйста, выберите социальную сеть'
        }
        if (err == '') {
            setStage(stage + 1)
            setError('')
        }
        else setError(err)
    }

    const [message, setMessage] = useState('');
    const doOrder = async () => {
        setLoadOrder(true);
        try {
            const response = await axios.post('/api/doOrder', {
                how_deliver: howDeliver,
                how_connect: howConnect,
                how_social: howSocial,
                number: number,
                cart: cart,
                promo: promo,
                picked_trade_point: pickedTradePoint,
                comment: comment,
                address: `ул.${address} п.${entrance}, ${floor}э, ${flat}кв`,
                quantity: quantity,
                total_price: totalCost,
                discount_percent: discountPercent,
                discount: totalCost - Math.round(totalCost * (1 - discountPercent * 0.01)),
                cost_with_discount: Math.round(totalCost * (1 - discountPercent * 0.01)),
                payment_method_id: paymentId,
                payment_status_id: 2
            });
            if (response.status == 200) {
                setMessage('Заказ обрабатывается...');
                setTimeout(() => {
                    setMessage('');
                }, 3000);
                setCart([]);
                localStorage.setItem('cartItems',JSON.stringify([]))
                setLoadOrder(false);
                setStage(0)
            }
        } catch (e) {
            console.error(e);
            if (e.status == 401) {
                setMessage("Вы не авторизованы");
                setTimeout(() => {
                    setMessage('');
                }, 3000);
                navigate('../login');
            }
            if (e.status == 400) {
                setMessage(e.response.data.data.error);
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            }
        }
    }

    const fetchPaymentMethods = async () => {
        if (payments.length > 0) return;
        setLoadingPayments(true);
        try {
            const response = await axios.get('/api/pays');
            setPayments(response.data);
            setLoadingPayments(false);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <Alert message={message}/>
            <div id={"cart"} className={`${styles.cart} ${isOpenCart ? styles.visible : ""}`}>
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
                                                   min={-1}
                                                   max={item.count}
                                                   onChange={(e) => {
                                                       updateItemQuantity(item.id, e.target.value, item.count)
                                                   }}
                                                   onBlur={() => {
                                                       if (item.quantity === 0) {
                                                           removeItem(item.id);
                                                       }
                                                   }}
                                            />/{item.count}
                                        </td>
                                        <td className={`${styles.price}`}>{item.price}р
                                            /{`${item.weight} ${item.type_weight}`}</td>
                                        <td className={styles.total}>
                                            {`${item.price * item.quantity}р
                                            /${item.weight * item.quantity} ${item.type_weight}`
                                            }</td>
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
                                        Скидка: <span id={"discount"}
                                                      className={styles.discount}>{discountPercent}%</span><br/>
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
                        {isAuth ?
                            <button className={styles.next} onClick={() => {
                                setStage(stage + 1);
                                fetchTradingPoints();
                                fetchPaymentMethods();
                            }}>Начать оформление заказа<span
                                className="material-symbols-outlined">arrow_forward</span>
                            </button>
                            :
                            <Link className={styles.next} to={"/login"}>
                                Авторизоваться/ Зарегистрироваться
                            </Link>
                        }
                    </div>
                    <div className={`${styles.infoOrder} ${styles.firstStage} ${stage == 1 ? styles.active : ""}`}>
                        <div className={styles.type}>
                            <h1>Тип платежа?</h1>
                            <div>
                                {payments && payments.map((pay, index) => (
                                    <div key={pay.id}>
                                        <input type={"radio"} id={`pay ${pay.id}`}
                                               value={pay.id}
                                               name={"typePay"}
                                               defaultChecked={index == 0}
                                               onChange={(e) => setPaymentId(parseInt(e.target.value))}
                                        />
                                        <label htmlFor={`pay ${pay.id}`}>
                                        <span
                                            className="material-symbols-outlined">
                                            {pay.id == 1 && "currency_ruble"}
                                            {pay.id == 2 && "credit_card"}
                                            {pay.id == 3 && "security_update_good "}
                                        </span><br/>
                                            {pay.name}
                                        </label>
                                    </div>
                                ))}
                                {loadingPayments && <h2>Загрузка...</h2>}
                            </div>
                        </div>
                        <div className={styles.number}>
                            <h1>Ваш номер телефона</h1>
                            <input type={"tel"}
                                   onChange={(e) => convertPhoneNumber(e.target.value)}
                                   placeholder="+7 (999) 999-99-99"
                                   pattern="^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$"
                                   value={number}
                                   required
                            />
                        </div>
                        <div className={styles.error}>
                            {error}
                        </div>
                        <div className={styles.buttons}>
                            <button className={styles.back} onClick={() => {
                                setStage(stage - 1);
                                setError('');
                            }}>
                                <span className="material-symbols-outlined">arrow_back</span>Назад
                            </button>
                            <button className={styles.next} onClick={() => {
                                if (isValidPhoneNumber(number, 'RU')) {
                                    setStage(stage + 1);
                                    setError('');
                                } else setError('Пожалуйста, введите правильный номер телефона');
                            }}
                            >Продолжить оформление заказа<span
                                className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                    <div className={`${styles.infoOrder} ${styles.secondStage} ${stage == 2 ? styles.active : ""}`}>
                        <div className={styles.left}>
                            <h1>Как доставить заказ?</h1>
                            <h2>Доставка по всему Екатеринбургу</h2>
                            <div className={styles.type}>
                                <div className={styles.howDeliverBlock}>
                                    <input type={"radio"} id={"pickup"} name={"howDeliver"} defaultChecked={true}
                                           onChange={(e) => setHowDeliver(e.target.id)}/>
                                    <label htmlFor={"pickup"}>Самовывоз</label>
                                    <input type={"radio"} id={"delivery"} name={"howDeliver"}
                                           onChange={(e) => setHowDeliver(e.target.id)}/>
                                    <label htmlFor={"delivery"}>Курьер</label>
                                </div>
                                <div
                                    className={`${styles.tradingPoints} ${howDeliver == "pickup" ? styles.visible : ""}`}>
                                    {tradingPoint.length > 0
                                        &&
                                        tradingPoint.map((point) => (
                                            <div key={point.id}>
                                                <input type={"radio"} id={point.name} name={"pickedTradePoint"}
                                                       onChange={() => setPickedTradePoint(point.address)}/>
                                                <label htmlFor={point.name}>
                                                    {point.address}
                                                </label>
                                            </div>
                                        ))
                                    }
                                    {tradingPoint.length == 0 && !loadingTradingPoints &&
                                        <h2>Точек продаж не найдено</h2>}
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
                                </div>
                                <div>
                                    <input type={"text"} name={"address"}
                                           onChange={(e) => setAddress(e.target.value)}/>
                                </div>
                                <div>
                                    <label>Квартира</label>
                                </div>
                                <div>
                                    <input type={"text"} name={"flat"}
                                           onChange={(e) => {
                                               setFlat(e.target.value)
                                           }}/>
                                </div>
                                <div>
                                    <label>Этаж</label>
                                </div>
                                <div>
                                    <input type={"text"} name={"floor"}
                                           onChange={(e) => {
                                               setFloor(e.target.value)
                                           }}/>
                                </div>
                                <div>
                                    <label>Подьезд</label>
                                </div>
                                <div>
                                    <input type={"text"} name={"entrance"}
                                           onChange={(e) => {
                                               setEntrance(e.target.value)
                                           }}/>
                                </div>
                                <div>
                                    <label>Комментарий для курьера</label>
                                </div>
                                <div>
                                    <input type={"text"} name={"comment"}
                                           onChange={(e) => {
                                               setComment(e.target.value)
                                           }}/>
                                </div>
                            </div>
                            <div className={styles.error}>
                                {error}
                            </div>
                            <div className={styles.buttons}>
                                <button className={styles.back} onClick={() => setStage(stage - 1)}>
                                    <span className="material-symbols-outlined">arrow_back</span>Назад
                                </button>
                                <button className={styles.submit} onClick={() => checkDeliver()}
                                >Далее<span
                                    className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                        <div className={styles.right}>
                            <YandexMap/>
                        </div>
                    </div>
                    <div className={`${styles.infoOrder} ${styles.thirdStage} ${stage == 3 ? styles.active : ""}`}>
                        <h2>Пожалуйста, проверьте ваши данные</h2>
                        <div className={styles.summaryItem}>
                            <strong>Номер телефона:</strong> {number}
                        </div>
                        <div className={styles.summaryItem}>
                            <strong>Способ получения
                                заказа:</strong> {howDeliver == 'delivery' ? "Доставка" : "Самовывоз"}
                        </div>
                        {howDeliver === 'delivery' && (
                            <div>
                                <div className={styles.summaryItem}>
                                    <strong>Адрес доставки:</strong> {address}
                                </div>
                                <div className={styles.summaryItem}>
                                    <strong>Квартира:</strong> {flat}
                                </div>
                                <div className={styles.summaryItem}>
                                    <strong>Этаж:</strong> {floor}
                                </div>
                                <div className={styles.summaryItem}>
                                    <strong>Подъезд:</strong> {entrance}
                                </div>
                            </div>
                        )}
                        {howDeliver === 'pickup' && (
                            <div className={styles.summaryItem}>
                                <strong>Улица точки выдачи:</strong> {pickedTradePoint}
                            </div>
                        )}
                        <div className={styles.summaryItem}>
                            <strong>Как связаться:</strong> {howConnect == 'call' ? "Позвонить" : howSocial}
                        </div>
                        <div className={styles.summaryItem}>
                            <strong>Сумма заказа:</strong> {totalCost}₽
                        </div>
                        <div className={styles.summaryItem}>
                            <strong>Скидка:</strong> {totalCost - Math.round(totalCost * (1 - discountPercent * 0.01))}₽
                        </div>
                        <div className={styles.summaryItem}>
                            <strong>К оплате:</strong> {Math.round(totalCost * (1 - discountPercent * 0.01))}₽
                        </div>
                        <div className={styles.buttons}>
                            <button className={styles.back} onClick={() => setStage(stage - 1)}>
                                <span className="material-symbols-outlined">arrow_back</span>Изменить
                            </button>
                            <button className={`${styles.submit} ${loadOrder ? styles.load : ""}`}
                                    onClick={() => doOrder()}>Всё верно<span
                                className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart;
