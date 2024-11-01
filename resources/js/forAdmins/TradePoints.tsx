import * as React from "react";

import styles from '../../sass/_componentsForAdminUsers.module.scss'

import Header from "../components/Header/_header";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userIsAuth, userRole} from "../components/User/userAtom";
import User from "../components/User/user";
import Alert from "../components/Alert/Alert";

const TradePoints = () => {
    const [isAuth, setIsAuth] = useRecoilState( userIsAuth );
    const [roles, setRoles] = useState(userRole);
    const {checkRole, checkAuthAndGetRole} = User();

    const navigate = useNavigate();
    useEffect(() => {
        if (!checkRole(['Super Admin', 'Admin', 'Manager'])) {
            navigate('/login');
        }
    }, []);

    const [points, setPoints] = useState([]);
    const [loading,setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const fetchTradePoints = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`../api/tradingPoints`);
            const newData = response.data;
            setPoints((prev) => [...prev, ...newData.data]);
            setHasMore(newData.current_page < newData.last_page);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        setPage(1);
        setPoints([]);
    }, []);

    useEffect(() => {
        fetchTradePoints();
    }, [page]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const [isAdding, setIsAdding] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenRemove, setIsOpenRemove] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const handleEdit = (point) => {
        setSelectedPoint(point);
        setIsOpenEdit(true);
    }

    const handleDelete = (point) => {
        setSelectedPoint(point);
        setIsOpenRemove(true);
    }

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setSelectedPoint((prevPoint) => ({
            ...prevPoint,
            [field]: value
        }));
    };

    const [message, setMessage] = useState('');

    const saveChanges = async () => {
        try {
            let response;
            if (isAdding) {
                response = await axios.post(`../api/admin/tradingPoints`, {
                    name: selectedPoint.name,
                    address: selectedPoint.address
                })
            } else {
                response = await axios.put(`../api/admin/tradingPoints/${selectedPoint.id}`, {
                    name: selectedPoint.name,
                    address: selectedPoint.address
                })
            }
            const newData = response.data.data;
            setPoints((prevPoints) => {
                return [newData, ...prevPoints];
            });
            setIsAdding(false);
            setIsOpenEdit(false);

            setMessage('Точка успешна обновлена!');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (e) {
            if (e.status == 401 || e.status == 403) {
                console.error("Не аутентифицирован");
                navigate('../login');
            } else {
                console.error(e);
            }
        }
    }
    const remove = async () => {
        try {
            const response = await axios.delete(`../api/admin/tradingPoints/${selectedPoint.id}`)
            setPoints((prevPoints) => {
                return prevPoints.filter((points) => points.id !== selectedPoint.id);
            });
            setIsOpenRemove(false);
            setMessage('Точка успешна удалена!');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (e) {
            if (e.status == 401 || e.status == 403) {
                console.error("Не аутентифицирован");
                navigate('../login');
            } else {
                console.error(e);
            }
        }
    };

    return (
        <div className={styles.root}>
            <Header className={styles.header}/>
            <Alert message={message}/>
            <div className={`${styles.changer} ${isOpenRemove ? styles.visible : ""}`}>
                <div className={styles.content}>
                    <h1>Вы уверены что хотите удалить точку {selectedPoint ? selectedPoint.name : ""}?</h1>
                    <button onClick={() => remove()}>Удалить</button>
                    <button onClick={() => setIsOpenRemove(false)}>Отмена</button>
                </div>
            </div>
            <div className={`${styles.changer} ${isOpenEdit ? styles.visible : ""}`}>
                <div className={styles.content}>
                    <label>Название точки</label>
                    <input
                        type="text"
                        value={selectedPoint ? selectedPoint.name : ''}
                        onChange={(e) => handleInputChange(e, 'name')}
                    />
                    <label>Адрес</label>
                    <input
                        type="text"
                        value={selectedPoint ? selectedPoint.address : ''}
                        onChange={(e) => handleInputChange(e, 'address')}
                    />
                    <button onClick={() => saveChanges()}>{isAdding ? "Добавить" : "Изменить"}</button>
                    <button onClick={() => {
                        setIsOpenEdit(false);
                        setIsAdding(false);
                    }}>Отмена</button>
                </div>
            </div>
            <div className={styles.content}>
                <button className={styles.defButton}
                        onClick={() => {
                            setIsAdding(true);
                            handleEdit({});
                        }}
                >Добавить точку</button>
                <div className={styles.usersTable}>
                    {points.length > 0 && (
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Адрес</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {points.map((point, i) => (
                                <tr key={point.id} ref={i + 1 == points.length ? lastElementRef : null}>
                                    <td>{point.id}</td>
                                    <td>{point.name}</td>
                                    <td>{point.address}</td>
                                    <td>
                                        <button onClick={() => handleEdit(point)}>Изменить</button>
                                        <button onClick={() => handleDelete(point)}>Удалить</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                    {loading && <p>Загрузка...</p>}
                    {!loading && points.length == 0 && <p>Не найдено</p>}
                </div>
            </div>
        </div>
    )
}

export default TradePoints
