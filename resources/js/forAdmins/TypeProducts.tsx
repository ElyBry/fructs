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

    const [types, setTypes] = useState([]);
    const [loading,setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const fetchTypes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`../api/typeProducts`);
            const newData = response.data;
            console.log(response.data);
            setTypes((prev) => [...prev, ...newData]);
            setHasMore(newData.current_page < newData.last_page);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        setPage(1);
        setTypes([]);
    }, []);

    useEffect(() => {
        fetchTypes();
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

    const fileInputRef = useRef<HTMLInputElement | null>();

    const [isAdding, setIsAdding] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenRemove, setIsOpenRemove] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const handleEdit = (point) => {
        setSelectedType(point);
        setIsOpenEdit(true);
    }

    const handleDelete = (point) => {
        setSelectedType(point);
        setIsOpenRemove(true);
    }

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setSelectedType((prevPoint) => ({
            ...prevPoint,
            [field]: value
        }));
    };

    const [message, setMessage] = useState('');

    const saveChanges = async () => {
        try {
            let response;
            const formData = new FormData();
            const file = fileInputRef.current?.files[0];
            formData.append('img', selectedType.img);
            if (file) {
                formData.append('image', file);
            }
            formData.append('name', selectedType.name);
            console.log(selectedType.name);
            if (isAdding) {
                response = await axios.post(`../api/admin/typeProducts`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await axios.post(`../api/admin/typeProducts/${selectedType.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            return;
            const newData = response.data.data;
            setTypes((prevPoints) => {
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
            const response = await axios.delete(`../api/admin/tradingPoints/${selectedType.id}`)
            setTypes((prevPoints) => {
                return prevPoints.filter((points) => points.id !== selectedType.id);
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
                    <h1>Вы уверены что хотите удалить точку {selectedType ? selectedType.name : ""}?</h1>
                    <button onClick={() => remove()}>Удалить</button>
                    <button onClick={() => setIsOpenRemove(false)}>Отмена</button>
                </div>
            </div>
            <div className={`${styles.changer} ${isOpenEdit ? styles.visible : ""}`}>
                <div className={styles.content}>
                    <label>Название типа</label>
                    <input
                        type="text"
                        value={selectedType ? selectedType.name : ''}
                        onChange={(e) => handleInputChange(e, 'name')}
                    />
                    <div>
                        <img style={{width: "100%"}} src={`${window.location.origin}/${selectedType ? selectedType.img : ''}`}/>
                        <label>
                            <input type={"file"} accept={"image/*"} ref={fileInputRef}/><br/>
                            <span className="input-file-btn">Выберите изображение</span><br/>
                            <span className="input-file-text">Максимум 16МБ</span>
                        </label>
                    </div>
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
                    {types.length > 0 && (
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {types.map((point, i) => (
                                <tr key={point.id} ref={i + 1 == types.length ? lastElementRef : null}>
                                    <td>{point.id}</td>
                                    <td>{point.name}</td>
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
                    {!loading && types.length == 0 && <p>Не найдено</p>}
                </div>
            </div>
        </div>
    )
}

export default TradePoints
