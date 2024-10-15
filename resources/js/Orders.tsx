import * as React from "react";

import styles from "../sass/_componentsForOrders.module.scss"

import Footer from "./components/_footer.js";
import Header from "./components/_header.js";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const Orders = () => {
    const navigate = useNavigate();
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            const response = await axios.get("api/orders");
            console.log(response.data.data);
            setOrders(response.data.data);

        } catch (e) {
            if (e.status == 401) {
                console.error("Не аутентифицирован");
                navigate('/login');
            } else {
                console.error(e);
            }
        } finally {
            setLoadingOrders(false);
        }
    }
    useEffect(() => {
        fetchOrders();
    }, []);

    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    return (
        <>
            <Header className={styles.header}/>
            <div className={styles.orders}>
                <div className={styles.content}>
                    {orders.length > 0 &&
                        orders.map((order) => (
                            <div key={order.id} className={styles.order} onClick={() => toggleOrderDetails(order.id)}>
                                <div className={styles.orderHeader}>
                                    <h3>Заказ #{order.id}</h3>
                                    <p>Сумма: {order.total_price} р</p>
                                    <p>Статус оплаты: {order.payment_status_id}</p>
                                    <span className={styles.orderDiscount}>{order.discount_percent}% скидка</span>
                                </div>
                                {expandedOrderId === order.id && (
                                    <div className={styles.orderDetails}>
                                        <p>Адрес доставки: {order.address}</p>
                                        <p>Точка приёма: {order.picked_trade_point}</p>
                                        <p>Способ доставки: {order.how_deliver}</p>
                                        <p>Комментарий: {order.comment}</p>
                                        <h4>Содержимое заказа:</h4>
                                        <ul>
                                            {order.products > 0 && order.products.map(product => (
                                                <li key={product.id}>
                                                    {product.name} - {product.quantity} шт. ценой {product.price} р
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))
                    }
                    {loadingOrders && [...Array(8)].map((_, index) => (
                        <div key={index} className={`${styles.grey} ${styles.order}`}>
                            <div className={`${styles.grey} ${styles.orderHeader}`}>
                                <h3>Заказ #...</h3>
                                <p>Сумма:  ...р</p>
                                <p>Статус оплаты: ....</p>
                                <span className={`${styles.grey} ${styles.orderDiscount}`}>....% скидка</span>
                            </div>
                        </div>
                    ))}
                    {!loadingOrders && orders.length == 0 && <h1>Ничего не найдено</h1>}
                </div>
            </div>
        </>
    )
}

export default Orders;
