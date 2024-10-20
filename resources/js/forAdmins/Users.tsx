import * as React from "react";

import styles from '../../sass/_componentsForAdminUsers.module.scss'

import Header from "../components/_header";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {userIsAuth, userRole} from "../components/User/userAtom";
import User from "../components/User/user";

const Users = () => {
    const [isAuth, setIsAuth] = useRecoilState( userIsAuth );
    const [roles, setRoles] = useState(userRole);
    const {checkRole, checkAuthAndGetRole} = User();

    const navigate = useNavigate();
    useEffect(() => {
        if (!checkRole(['Super Admin', 'Admin'])) {
            navigate('/login');
        }
    }, []);

    const [users, setUsers] = useState([]);
    const [loadingUsers,setLoadingUsers] = useState(false);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const [pageUsers, setPageUsers] = useState(1);

    const [userRoles, setUserRoles] = useState([]);

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await axios.get(`../api/admin/users?page=${pageUsers}`);
            const newData = response.data;
            setUsers((prev) => [...prev, ...newData.data]);
            setHasMoreUsers(newData.current_page < newData.last_page);
            setLoadingUsers(false);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        setUsers([]);
        setUserRoles([]);
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [pageUsers]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node) => {
            if (loadingUsers) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreUsers) {
                    setPageUsers((prevPage) => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loadingUsers, hasMoreUsers]
    );


    const fetchRoles = async () => {
        try {
            const response = await axios.get(`../api/admin/roles`);
            const newData = response.data;
            setUserRoles(newData);
        } catch (e) {
            if (e.status == 401 || e.status == 403) {
                console.error("Не аутентифицирован");
                navigate('../login');
            } else {
                console.error(e);
            }
        }
    }

    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenRemove, setIsOpenRemove] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsOpenEdit(true);
    }

    const handleDelete = (user) => {
        setSelectedUser(user);
        setIsOpenRemove(true);
    }

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setSelectedUser((prevUser) => ({
            ...prevUser,
            [field]: value
        }));
    };

    const [alert, setAlert] = useState('');

    const saveChanges = async () => {
        try {
            const response = await axios.put(`../api/admin/users/${selectedUser.id}`, {
                name: selectedUser.name,
                role_id: selectedUser.role_id,
                email: selectedUser.email
            })
            const newData = response.data.data;
            setUsers((prevUsers) => {
                return prevUsers.map((user) =>
                    user.id === newData.id ? newData : user
                );
            });
            setAlert('Пользователь успешно обновлён!');
            setTimeout(() => {
                setAlert('');
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
        <>
            <Header className={styles.header}/>
            {alert != '' && <div className={styles.alert}>
                {alert}
            </div>}
            <div className={`${styles.changer} ${isOpenEdit ? styles.visible : ""}`}>
                <div className={styles.content}>
                    <input
                        type="text"
                        value={selectedUser ? selectedUser.name : ''}
                        onChange={(e) => handleInputChange(e, 'name')}
                    />
                    <input
                        type="email"
                        value={selectedUser ? selectedUser.email : ''}
                        onChange={(e) => handleInputChange(e, 'email')}
                    />
                    <select value={selectedUser ? selectedUser.role_id : ''}
                            onChange={(e) => handleInputChange(e, 'role_id')}
                    >
                        {userRoles.length > 0 && userRoles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.id} - {role.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => saveChanges()}>Изменить</button>
                    <button onClick={() => setIsOpenEdit(false)}>Отмена</button>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.usersTable}>
                    {users.length > 0 && (
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>ФИО</th>
                                <th>Почта</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, i) => (
                                <tr key={user.id} ref={i + 1 == users.length ? lastElementRef : null}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button onClick={() => handleEdit(user)}>Изменить</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                    {loadingUsers && <p>Загрузка...</p>}
                </div>
            </div>
        </>
    )
}

export default Users
