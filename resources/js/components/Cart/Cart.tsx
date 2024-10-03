import * as React from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {cartAtom, totalCostAtom, quantityAtom} from "./cartAtom";
import useCart from "./useCart"
import {useEffect, useState} from "react";

const Cart = ({ isOpenCart }) => {
    const cart = useRecoilValue(cartAtom);
    const quantity = useRecoilValue(quantityAtom);
    const totalCost = useRecoilValue(totalCostAtom);
    const { addItem, removeItem, updateItemQuantity } = useCart();

    const [discount, setDiscount] = useState(0)
    const [stage, setStage] = useState(1);

    return (
        <div id={"cart"} className={isOpenCart && quantity > 0 ? "visible" : ""}>
            <div id="cartBlock">
                <table>
                    <thead>
                    <tr>
                        <th className={"name"}>Название</th>
                        <th className={"quantity"}>Количество</th>
                        <th className={"price"}>Цена</th>
                        <th className={"res"}>Итого:</th>
                        <th className={"remove"}>Удалить</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cart.map((item) =>
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td className={"quantity"}>
                                <input name={"quantity"}
                                       type={"number"}
                                       value={item.quantity}
                                       onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                                />
                            </td>
                            <td className={"price"}>{item.price}р / {`${item.weight} ${item.type_weight}`}</td>
                            <td className={"price"}>{item.price * item.quantity}р
                                / {`${item.weight * item.quantity} ${item.type_weight}`} </td>
                            <td>
                                <button className={"remove"} onClick={() => removeItem(item.id)}><span
                                    className="material-symbols-outlined">delete</span>Удалить
                                </button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div className={`infoOrder firstStage ${stage == 1 ? "active" : ""}`}>
                    <div className={"result"}>

                        {discount != 0 &&
                            <>
                                <div>
                                    Без скидки: {totalCost}
                                </div>
                                <div>
                                    Скидка: <span id={"discount"}>{discount}</span>
                                </div>
                            </>
                        }
                        <div>
                            Итого: {totalCost - discount}
                        </div>
                    </div>
                    <div className={"promo"}>
                        <input type={"text"} name={"promo"} placeholder={"ПРОМОКОД"}/>
                        <button>Применить промокод<span className="material-symbols-outlined">favorite</span></button>
                    </div>
                    <div className={"type"}>
                        <h1>Тип платежа?</h1>
                        <div>
                            <input type={"radio"} id={"cash"} name={"typePay"} defaultChecked={true}/>
                            <label htmlFor={"cash"}><span className="material-symbols-outlined">currency_ruble</span>Наличными</label>
                            <input type={"radio"} id={"cashless"} name={"typePay"}/>
                            <label htmlFor={"cashless"}><span className="material-symbols-outlined">credit_card</span>Безналичными</label>
                        </div>
                    </div>
                    <button className={"next"} onClick={() => setStage(stage + 1)}>Продолжить оформление заказа<span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
                <div className={`infoOrder secondStage ${stage == 2 ? "active" : ""}`}>
                    <h1>Как доставить заказ?</h1>
                    <h2>Доставка по всему Екатеринбургу</h2>
                    <div className={"type"}>
                        <div>
                            <input type={"radio"} id={"pickup"} name={"howDeliver"} defaultChecked={true}/>
                            <label htmlFor={"pickup"}>Самовывоз</label>
                            <input type={"radio"} id={"delivery"} name={"howDeliver"}/>
                            <label htmlFor={"delivery"}>Курьер</label>
                        </div>
                    </div>
                    <div className={"location"}>
                        <div>
                            <label>Адрес</label>
                            <input type={"text"} name={"address"}/>
                        </div>
                        <div>
                            <label>Квартира</label>
                            <input type={"text"} name={"flat"}/>
                        </div>
                        <div>
                            <label>Этаж</label>
                            <input type={"text"} name={"floor"}/>
                        </div>
                        <div>
                            <label>Подьезд</label>
                            <input type={"text"} name={"entrance"}/>
                        </div>
                        <div>
                            <label>Домофон</label>
                            <input type={"text"} name={"intercom"}/>
                        </div>
                        <div>
                            <label>Комментарий для курьера</label>
                            <input type={"text"}/>
                        </div>

                    </div>
                    <div id={"yMap"}>
                        <script type="text/javascript" charSet="utf-8" async
                                src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A54703ffb231a6d94c85c37a22254eb22e5cb2205453236d6681278ad1c399eb3&amp;width=100%&amp;height=100%&amp;lang=ru_RU&amp;scroll=true">
                        </script>
                    </div>
                    <div className={"buttons"}>
                        <button className={"back"} onClick={() => setStage(stage - 1)}>
                            <span className="material-symbols-outlined">arrow_back</span>Назад
                        </button>
                        <button className={"submit"} onClick={() => setStage(stage + 1)}>Заказать<span
                            className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Cart;
