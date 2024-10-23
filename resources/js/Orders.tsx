import * as React from "react";

import styles from "../sass/_componentsForOrders.module.scss"

import Header from "./components/_header.js";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Alert from "./components/Alert/Alert";

const Orders = () => {
    const navigate = useNavigate();
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    const [hasMoreOrders, setHasMoreOrders] = useState(true);
    const [page, setPage] = useState(1);
    const user = JSON.parse(localStorage.getItem('user'));
    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            const response = await axios.get(`api/orders?page=${page}`);
            setOrders((prev) => [...prev, ...response.data.data]);
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

    const [countFeedbacks, setCountFeedbacks] = useState(0);
    const fetchCountFeedbacks = async () => {
        try {
            const response = await axios.get(`api/getExist/${user.id}`)
            setCountFeedbacks(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchCountFeedbacks();
        setOrders([])
        setPage(1);
    }, []);
    useEffect(() => {
        fetchOrders();
    }, [page]);

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
        const response = await axios.get(`api/orderItems/${orderId}`);
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

    const [message, setMessage] = useState('');
    const [newFeedback, setNewFeedback] = useState({
        'user_name': user.name,
        'message': '',
        'rating': 5,
        'title': '',
        'product_id': 0
    });
    const [openFeedback, setOpenFeedback] = useState(false);
    const [openFeedbackProducts, setOpenFeedbackProducts] = useState(false);

    const openAddNewFeedbackProducts = (product) => {
        setNewFeedback({
            ...product,
            'user_name': user.name,
            'message': '',
            'rating': 5
        })
        setOpenFeedbackProducts(true);
    }

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setNewFeedback((newFeedback) => ({
            ...newFeedback,
            [field]: value
        }));
    };

    const addFeedback = async () => {
        try {
            if (openFeedback) {
                const response = await axios.post('api/addFeedback', {
                    'user_name': newFeedback.user_name,
                    'user_id': user.id,
                    'message': newFeedback.message,
                    'rating': newFeedback.rating,
                })
            } else {
                const response = await axios.post('api/addFeedbackProducts', {
                    'user_name': newFeedback.user_name,
                    'product_id': newFeedback.product_id,
                    'user_id': user.id,
                    'message': newFeedback.message,
                    'rating': newFeedback.rating,
                })
            }

            setOpenFeedbackProducts(false);
            setOpenFeedback(false);
            setNewFeedback({
                'user_name': user.name,
                'message': '',
                'rating': 5,
                'title': '',
                'product_id': 0
            })
            setMessage('Отзыв отправлен на проверку, спасибо');
            setTimeout(() => {
                setMessage('');
            }, 3000);
            setOrderDetails(prevItems => {
                const updatedItems = { ...prevItems};
                for (const orderId in updatedItems) {
                    updatedItems[orderId] = updatedItems[orderId].map(item =>
                        item.product_id === newFeedback.product_id
                            ? { ...item, feedback_exists: 1 }
                            : item
                    );
                }
                return updatedItems;
            });
        } catch (e) {
            console.error(e);
            if (e.status == 422) {
                setMessage(e.response.data.message);
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            }
            if (e.status == 400) {
                setMessage(e.response.data.data.error);
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            }
        }
    }

    return (
        <>
            <Header className={styles.header}/>
            <Alert message={message}/>
            {orders.length > 0 && (countFeedbacks == 0 || openFeedbackProducts) &&
                <div className={`${styles.feedBack} ${(openFeedback || openFeedbackProducts) ? styles.visible : ""}`}>
                    <div className={styles.content}>
                        <span className={`${styles.closeIcon} material-symbols-outlined`}
                              onClick={() => {setOpenFeedback(false);setOpenFeedbackProducts(false)}}>arrow_back</span>
                        <h2>
                            Данный отзыв будет размещён на сайте
                        </h2>
                        {openFeedbackProducts &&
                            <h2>
                                Продукт: {newFeedback.title}
                            </h2>
                        }
                        <label>Как будет отображаться ваше ФИО</label>
                        <input type={"text"}
                               value={newFeedback.user_name}
                               onChange={e => handleInputChange(e, 'user_name')}
                        />
                        <label>Отзыв(Хотя бы 1 слово<span className="material-symbols-outlined">sentiment_very_satisfied</span>)</label>
                        <textarea rows={4}
                                  placeholder="Напишите ваш отзыв здесь..."
                                  value={newFeedback.message}
                                  onChange={e => handleInputChange(e, 'message')}
                        />
                        <label>Рейтинг</label>
                        <div className={styles.rating}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`${styles.star} material-symbols-outlined ${newFeedback.rating >= star ? styles.selected : ""}`}
                                    onClick={() => handleInputChange({target: {value: star}}, 'rating')}
                                >star</span>
                            ))}
                        </div>
                        <button onClick={() => addFeedback()}>Отправить на проверку(после проверки отзыв будет доступен)
                        </button>
                    </div>
                </div>
            }

            <div className={styles.orders}>
                <div className={styles.content}>
                    {orders.length > 0 && countFeedbacks == 0 &&
                        <div>
                            <button className={styles.getFeedback}
                                    onClick={() => setOpenFeedback(true)}
                            >Оставить отзыв о приложении
                            </button>
                        </div>
                    }
                    {orders.length > 0 &&
                        orders.map((order, index) => (
                            <div key={order.id} ref={index + 1 == orders.length ? lastElementRef : null}
                                 className={styles.order}>
                                <div className={styles.orderHeader}>
                                    <h3>Заказ #{order.id}</h3>
                                    <p>{new Date(order.created_at).toLocaleString()}</p>
                                    <p>Итоговая сумма: {order.cost_with_discount}р</p>
                                    {order.discount_percent != 0 && <p>Без скидки: {order.total_price}р</p>}
                                    <p>Статус заказа: {order.payment_status_id}</p>
                                    {order.discount_percent != 0 &&
                                        <span className={styles.orderDiscount}>{order.discount_percent}% скидка</span>}
                                    <button onClick={() => toggleOrderDetails(order.id)}> Подробнее</button>
                                </div>
                                {expandedOrderId === order.id && (
                                    <div className={styles.orderDetails}>
                                        {order.address && order.how_deliver != "pickup" &&
                                            <p>Адрес доставки: {order.address}</p>}
                                        {order.picked_trade_point && order.how_deliver == "pickup" && <p>Точка приёма: {order.picked_trade_point}</p>}
                                        <p>Способ доставки: {order.how_deliver == "pickup" ? "Самовывоз" : "Доставка"}</p>
                                        {order.comment &&<p>Комментарий: {order.comment}</p>}
                                        <h4>Содержимое заказа:</h4>
                                        <ul className={styles.productList}>
                                            {orderDetails[order.id] && orderDetails[order.id].length > 0 ? (
                                                <>
                                                    {orderDetails[order.id].map(product => (
                                                        <li key={product.id} className={styles.productItem}>
                                                            <div className={styles.productInfo}>
                                                                <span
                                                                    className={styles.productTitle}>{product.title}</span>
                                                                <span
                                                                    className={styles.productQuantity}>{product.quantity} шт.</span>
                                                                <span className={styles.productPrice}>
                                                                    {product.total_price} р/{product.weight} {product.type_weight}
                                                                </span>
                                                            </div>
                                                            {order.payment_status_id == "Доставлено" && product.feedback_exists == 0 &&
                                                                <div>
                                                                    <button className={styles.getFeedbackProducts}
                                                                            onClick={() => openAddNewFeedbackProducts(product)}
                                                                    >Оставить отзыв о продукте
                                                                    </button>
                                                                </div>
                                                            }
                                                            <div className={styles.productTotal}>
                                                                Итого: {product.quantity * product.total_price} р
                                                            </div>
                                                        </li>
                                                    ))
                                                    }
                                                    <button onClick={() => toggleOrderDetails(order.id)}> Скрыть
                                                    </button>
                                                </>

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
                                <p>Статус заказа: ....</p>
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
