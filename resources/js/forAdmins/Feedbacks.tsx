import * as React from "react";

import styles from '../../sass/_componentsForAdminUsers.module.scss'

import Header from "../components/Header/_header";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Alert from "../components/Alert/Alert";
import useAuthCheck from "../components/User/useAuthCheck";

const Feedbacks = () => {
    const navigate = useNavigate();
    useAuthCheck(['Super Admin', 'Admin', 'Manager']);

    const [feedbacks, setFeedbacks] = useState([]);
    const [loadingFeedbacks,setLoadingFeedbacks] = useState(false);
    const [hasMoreFeedbacks, setHasMoreFeedbacks] = useState(true);
    const [pageFeedbacks, setPageFeedbacks] = useState(1);

    const fetchFeedbacks = async () => {
        try {
            setLoadingFeedbacks(true);
            const response = await axios.get(`../api/admin/feedBacks?page=${pageFeedbacks}`);
            const newData = response.data;
            setFeedbacks((prev) => [...prev, ...newData.data]);
            setHasMoreFeedbacks(newData.current_page < newData.last_page);
            setLoadingFeedbacks(false);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        setPageFeedbacks(1);
        setFeedbacks([]);
    }, []);

    useEffect(() => {
        fetchFeedbacks();
    }, [pageFeedbacks]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node) => {
            if (loadingFeedbacks) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreFeedbacks) {
                    setPageFeedbacks((prevPage) => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loadingFeedbacks, hasMoreFeedbacks]
    );


    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenRemove, setIsOpenRemove] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const handleEdit = (feedback) => {
        setSelectedFeedback(feedback);
        setIsOpenEdit(true);
    }

    const handleChangeApprove = (feedback) => {
        saveChanges(feedback);
    }

    const handleDelete = (feedback) => {
        setSelectedFeedback(feedback);
        setIsOpenRemove(true);
    }

    const handleInputChange = (e, field) => {
        let { value } = e.target;
        if (field == 'is_approved') {
            if (e.target.checked) {
                value = 1
            } else {
                value = 0
            }
        }
        setSelectedFeedback((prevFeedBack) => ({
            ...prevFeedBack,
            [field]: value
        }));
    };

    const [message, setMessage] = useState('');

    const saveChanges = async (feedback = null) => {
        try {
            let response;
            if (feedback) {
                response = await axios.put(`../api/admin/feedBacks/${feedback.id}`, {
                    id: feedback.id,
                    user_name: feedback.user_name,
                    message: feedback.message,
                    is_approved: feedback.is_approved ? 0 : 1,
                    rating: feedback.rating
                })
            } else {
                response = await axios.put(`../api/admin/feedBacks/${selectedFeedback.id}`, {
                    id: selectedFeedback.id,
                    user_name: selectedFeedback.user_name,
                    message: selectedFeedback.message,
                    is_approved: selectedFeedback.is_approved,
                    rating: selectedFeedback.rating
                })
            }

            const newData = response.data.data;
            setFeedbacks((prevFeedBack) => {
                return prevFeedBack.map((feedback) =>
                    feedback.id === newData.id ? newData : feedback
                );
            });
            setMessage('Отзыв успешно обновлён!');
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

    return (
        <div className={styles.root}>
            <Header className={styles.header}/>
            <Alert message={message}/>
            <div className={`${styles.changer} ${isOpenEdit ? styles.visible : ""}`}>
                <div className={styles.content}>
                    <input
                        type="text"
                        value={selectedFeedback ? selectedFeedback.user_name : ''}
                        onChange={(e) => handleInputChange(e, 'user_name')}
                    />
                    <textarea
                        value={selectedFeedback ? selectedFeedback.message : ''}
                        onChange={(e) => handleInputChange(e, 'message')}
                    />
                    <br/>
                    <input max={5} value={selectedFeedback?.rating}
                           type={"number"}
                           onChange={(e) => handleInputChange(e, 'rating')}
                    />
                    <div>
                        Опубликован
                        <input type={"checkbox"}
                               checked={selectedFeedback?.is_approved}
                               onChange={(e) => handleInputChange(e, 'is_approved')}
                        />
                    </div>

                    <button onClick={() => saveChanges()}>Изменить</button>
                    <button onClick={() => setIsOpenEdit(false)}>Назад</button>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.usersTable}>
                    {feedbacks.length > 0 && (
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>ФИО</th>
                                <th>Отзыв</th>
                                <th>Оценка</th>
                                <th>Дата</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {feedbacks.map((feedback, i) => (
                                <tr key={feedback.id} ref={i + 1 == feedbacks.length ? lastElementRef : null}>
                                    <td>{feedback.id}</td>
                                    <td>{feedback.user_name}</td>
                                    <td>{feedback.message}</td>
                                    <td>{feedback.rating}</td>
                                    <td>{feedback?.created_at?.slice(0, 10)}</td>
                                    <td className={styles.buttons}>
                                        {feedback.is_approved ?
                                            <button onClick={() => handleChangeApprove(feedback)}>Скрыть</button>
                                            :
                                            <button onClick={() => handleChangeApprove(feedback)}>Опубликовать</button>
                                        }
                                        <button onClick={() => handleEdit(feedback)}>Изменить</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                    {loadingFeedbacks && <p>Загрузка...</p>}
                </div>
            </div>
        </div>
    )
}

export default Feedbacks
