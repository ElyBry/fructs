import * as React from "react";

import styles from "../../sass/_componentsForOrders.module.scss"

import Header from "../components/_header";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Orders = () => {

    const navigate = useNavigate();
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    const [hasMoreOrders, setHasMoreOrders] = useState(true);
    const [page, setPage] = useState(1);
    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            const response = await axios.get(`../api/admin/orders?page=${page}`);
            setOrders((prev) => [...prev, ...response.data.data]);
            console.log(response);
            setHasMoreOrders(response.data.current_page < response.data.last_page)
            setLoadingOrders(false);
        } catch (e) {
            if (e.status == 401) {
                console.error("Не аутентифицирован");
                navigate('/login');
            } else {
                console.error(e);
            }
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [page]);

    useEffect(() => {
        setOrders([])
    }, []);

    const observerFeedbacks = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node) => {
            if (loadingOrders) return;
            if (observerFeedbacks.current) observerFeedbacks.current.disconnect();

            observerFeedbacks.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreOrders) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observerFeedbacks.current.observe(node);
        },
        [loadingOrders, hasMoreOrders]
    );

    const fetchOrderDetails = async (orderId) => {
        const response = await axios.get(`../api/orderItems/${orderId}`);
        console.log(response);
        return response.data;
    }

    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});

    const toggleOrderDetails = async (orderId) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));

        if (!orderDetails[orderId]) {
            try {
                const details = await fetchOrderDetails(orderId);
                setOrderDetails(prevDetails => ({ ...prevDetails, [orderId]: details}))
            } catch (e) {
                console.error(e);
            }
        }
    };


    return (
        <>
            <Header className={styles.header}/>
            <div className={styles.orders}>
                <div className={styles.content}>
                    {orders.length > 0 &&
                        orders.map((order, index) => (
                            <div key={order.id} ref={index + 1 == orders.length ? lastElementRef : null}
                                 className={styles.order} onClick={() => toggleOrderDetails(order.id)}>
                                <div className={styles.orderHeader}>
                                    <h3>Заказ #{order.id}</h3>
                                    <p></p>
                                    <p>{new Date(order.created_at).toLocaleString()}</p>
                                    <p>Итоговая сумма: {order.cost_with_discount}р</p>
                                    {order.discount_percent != 0 && <p>Без скидки: {order.total_price}р</p> }
                                    <p>Статус оплаты: {order.payment_status_id}</p>
                                    {order.discount_percent != 0 && <span className={styles.orderDiscount}>{order.discount_percent}% скидка</span>}
                                </div>
                                {expandedOrderId === order.id && (
                                    <div className={styles.orderDetails}>
                                        {order.address && <p>Адрес доставки: {order.address}</p>}
                                        {order.picked_trade_point && <p>Точка приёма: {order.picked_trade_point}</p>}
                                        <p>Способ доставки: {order.how_deliver == "pickup" ? "Самовывоз" : "Доставка"}</p>
                                        {order.comment &&<p>Комментарий: {order.comment}</p>}
                                        <h4>Содержимое заказа:</h4>
                                        <ul className={styles.productList}>
                                            {orderDetails[order.id] && orderDetails[order.id].length > 0 ? (
                                                orderDetails[order.id].map(product => (
                                                    <li key={product.id} className={styles.productItem}>
                                                        <div className={styles.productInfo}>
                                                            <span className={styles.productTitle}>{product.title}</span>
                                                            <span
                                                                className={styles.productQuantity}>{product.quantity} шт.</span>
                                                            <span className={styles.productPrice}>
                                                                {product.total_price} р/{product.weight} {product.type_weight}
                                                            </span>
                                                        </div>
                                                        <div className={styles.productTotal}>
                                                            Итого: {product.quantity * product.total_price} р
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <h2>Загрузка...</h2>
                                            )}
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
                                <p>Сумма: ...р</p>
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
