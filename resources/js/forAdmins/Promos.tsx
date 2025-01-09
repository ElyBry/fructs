import * as React from "react";

import styles from '../../sass/_componentsForAdminUsers.module.scss'

import Header from "../components/Header/_header";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Alert from "../components/Alert/Alert";
import useAuthCheck from "../components/User/useAuthCheck";

const TradePoints = () => {
    useAuthCheck(['Super Admin', 'Admin', 'Manager']);

    const navigate = useNavigate();

    const [promos, setPromos] = useState([]);
    const [loading,setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const fetchPromos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`../api/admin/promos`);
            const newData = response.data;
            setPromos((prev) => [...prev, ...newData.data]);
            setHasMore(newData.current_page < newData.last_page);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        setPage(1);
        setPromos([]);
    }, []);

    useEffect(() => {
        fetchPromos();
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
    const [selectedPromo, setSelectedPromo] = useState(null);
    const handleEdit = (point) => {
        setSelectedPromo(point);
        setIsOpenEdit(true);
    }

    const handleDelete = (point) => {
        setSelectedPromo(point);
        setIsOpenRemove(true);
    }

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setSelectedPromo((prevPoint) => ({
            ...prevPoint,
            [field]: value
        }));
    };

    const [message, setMessage] = useState('');

    const saveChanges = async () => {
        try {
            let response;
            if (isAdding) {
                response = await axios.post(`../api/admin/promos`, {
                    name: selectedPromo.name,
                    discount: selectedPromo.discount,
                })
            } else {
                response = await axios.put(`../api/admin/promos/${selectedPromo.id}`, {
                    name: selectedPromo.name,
                    discount: selectedPromo.discount,
                })
            }
            const newData = response.data.data;
            if (isAdding) {
                setPromos((prevTypes) => {
                    return [newData, ...prevTypes];
                });
            } else {
                setPromos((prevTypes) => {
                    return prevTypes.map((points) =>
                        points.id === newData.id ? newData : points
                    );
                });
            }

            setIsAdding(false);
            setIsOpenEdit(false);
            setMessage('Промокод успешно обновлён!');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (e) {
            if (e.status == 401 || e.status == 403) {
                console.error("Не аутентифицирован");
                navigate('../login');
            } else {
                setMessage(e.response.data.message);
                setTimeout(() => {
                    setMessage('');
                }, 3000);
                console.error(e);
            }
        }
    }
    const remove = async () => {
        try {
            const response = await axios.delete(`../api/admin/promos/${selectedPromo.id}`)
            setPromos((types) => {
                return types.filter((types) => types.id !== selectedPromo.id);
            });
            setIsOpenRemove(false);
            setMessage('Промокод успешно удален!');
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
                    <h1>Вы уверены что хотите удалить промокод {selectedPromo ? selectedPromo.name : ""}?</h1>
                    <button onClick={() => remove()}>Удалить</button>
                    <button onClick={() => setIsOpenRemove(false)}>Отмена</button>
                </div>
            </div>
            <div className={`${styles.changer} ${isOpenEdit ? styles.visible : ""}`}>
                <div className={styles.content}>
                    <label>Название</label>
                    <input
                        type="text"
                        value={selectedPromo ? selectedPromo.name : ''}
                        onChange={(e) => handleInputChange(e, 'name')}
                    />
                    <label>Скидка</label>
                    <input
                        type="text"
                        value={selectedPromo ? selectedPromo.discount : ''}
                        onChange={(e) => handleInputChange(e, 'discount')}
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
                >Добавить промокод</button>
                <div className={styles.usersTable}>
                    {promos.length > 0 && (
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Скидка</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {promos.map((point, i) => (
                                <tr key={point.id} ref={i + 1 == promos.length ? lastElementRef : null}>
                                    <td>{point.id}</td>
                                    <td>{point.name}</td>
                                    <td>{point.discount}%</td>
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
                    {!loading && promos.length == 0 && <p>Не найдено</p>}
                </div>
            </div>
        </div>
    )
}

export default TradePoints
