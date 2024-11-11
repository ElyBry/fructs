import * as React from 'react';
import {Component, useEffect, useState} from 'react';
import * as ReactDOM from 'react-dom/client';

import styles from "../sass/_componentsForSignInUp.module.scss"
import {Link, useNavigate} from "react-router-dom";
import TelegramConnect from "./components/TelegramConnect/TelegramConnect";

const SignInUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidName, setIsValidName] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [errorLogin, setErrorLogin] = useState('');
    const [errorSignUp, setErrorSignUp] = useState('');
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);

    const handleSubmit = (event, is = "") => {
        event.preventDefault();
        if (!isValidEmail) return;
        setLoading(true);
        const url = "/api/auth/" + (is === "in" ? 'login' : 'register');
        const body = is === "in" ? {
            email: email,
            password: password
        } : {
            name: name,
            email: email,
            password: password
        };

        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(body),
            credentials: 'include'
            })
            .then(response => {
                if (response.status !== 200 && response.status !== 400) {
                    setLoading(false);
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Ошибка при выполнении запроса'); // Обработка ошибки
                    });
                }
                return response.json();
            })
            .then(data => {
                if (!data.success) {
                    if (is == "in") {
                        setErrorLogin(data.data.error);
                    } else {
                        setErrorSignUp(data.data.email);
                    }
                }
                if (data.success) {
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                    navigate('/products');
                }
                setLoading(false);
            })
            .catch(error => console.error(error));
    }
    const handleOnChangeEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        setIsValidEmail(re.test(email));
    }
    const handleOnChangeName = (name) => {
        setIsValidName(name.length >= 10 && name.length <= 100);
    }
    const handleOnChangePassword = (password) => {
        setIsValidPassword(password.length >= 6);
    }
    useEffect(() => {
        const cookies = document.cookie.split('; ');
        const isAuthenticated = cookies.some(cookie => cookie.startsWith('is_authenticated='));
        if (isAuthenticated) navigate('/products');
    }, []);
    const changePanel = () => {
        if (isDisabled) return;
        setIsDisabled(true);
        const panel:HTMLElement = document.querySelector('.panel');
        const main_sign_in:HTMLElement = document.querySelector('#main_sign_in');
        const main_create_acc:HTMLElement = document.querySelector('#main_create_acc');
        const sign_in:HTMLElement = document.querySelector('#sign_in');
        const create_acc:HTMLElement = document.querySelector('#create_acc');
        if (panel.style.transform === 'translateX(150%)') {
            panel.style.transform = 'translateX(0%)';
            panel.style.transformOrigin = 'right';
            panel.style.transform += 'scaleX(2.4)';
            sign_in.style.transform = 'translateX(0%)';
            create_acc.style.transform = 'translateX(67%)';
            panel.style.borderRadius = '30px 0 0 30px';
            setTimeout(() => {
                main_sign_in.style.display = 'flex';
                main_create_acc.style.display = 'none';
            }, 345);
            setTimeout(() => {
                panel.style.transform =  'translateX(0%)';
            },250);
        } else {
            panel.style.transform =  'translateX(150%)';
            panel.style.transform += 'scaleX(2.4)';
            panel.style.transformOrigin = 'left';
            sign_in.style.transform = 'translateX(-67%)';
            create_acc.style.transform = 'translateX(0%)';
            create_acc.style.borderRadius = '30px 0 0 30px';
            panel.style.borderRadius = '0 30px 30px 0';
            setTimeout(() => {
                main_create_acc.style.display = 'flex';
                main_sign_in.style.display = 'none';
            }, 345);
            setTimeout(() => {
                panel.style.transform =  'translateX(150%)';
            },250)
        }
        setTimeout(() => {
            setIsDisabled(false);
        }, 600)
    }

    const handleReset = async () => {

    }

    useEffect(() => {
        window.onTelegramAuth = function (user) {
            console.log(user);

            fetch('/auth/telegram/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify(user),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    navigate('/products');
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
        };
    }, []);
    return  (
        <div className={styles.root}>
            <div className={`${styles.mainDiv} ${reset ? styles.display : ""}`}>
                <button className={styles.back} onClick={() => setReset(false)}>
                    <span className={"material-symbols-outlined"}>arrow_back</span>
                </button>
                <div className={styles.reset}>
                    <h1>Сброс пароля. <span style={{color:"red"}}> ПОКА НЕ ДОСТУПНО</span></h1>
                    <h2>Введите почту для сброса пароля. Код будет отправлена на почту</h2>
                    <div className={styles.input}>
                        <input type={"email"} value={email}
                               autoComplete={"email"}
                               onBlur={(e) => handleOnChangeEmail(e.target.value)}
                               onChange={(e) => setEmail(e.target.value)}
                               className={`${styles.inputField} ${isValidEmail ? '' : styles.invalid}`}
                               required={true}/>
                        <label className={styles.inputLabel}>Почта</label>
                    </div>
                    <button className={styles.buttonToSignIn} onClick={() => handleReset()}>Отправить код</button>
                </div>
            </div>
            <div id={"main_div"} className={`${styles.mainDiv} ${!reset ? styles.display : ""}`}>
                <Link className={styles.back} to={"/products"}>
                    <span className={"material-symbols-outlined"}>arrow_back</span>
                </Link>
                <div id={"logo"} className={styles.logo}>
                    <img src={"../../image/logos/nocolorlogo.png"}/>
                </div>
                <div className={`${styles.panel} panel`}></div>
                <div id={"main_sign_in"} className={styles.mainSignIn}>
                <div id={"hello"} className={styles.secondBlock}>
                        <h1>Привет, друг!</h1>
                        <div className={styles.note}>
                            Необходимо авторизоваться, чтобы продолжить заказ
                        </div>
                        <button id={"button_to_sign_up"} className={styles.buttonToSignUp}
                                onClick={changePanel}>Зарегистрироваться
                        </button>
                    </div>
                    <div id={"sign_in"} className={styles.signIn}>
                        <h1>Войти</h1>
                        <div className={styles.fromAcc}>
                            <div className={styles.icons}>
                                {/*<a href={"#"}><img src={"../../image/icons/icon-google.png"}/></a>
                                <a href={"#"}><img src={"../../image/icons/icon-telegram.png"}/></a>
                                <a href={"#"}><img src={"../../image/icons/icon-vk.png"}/></a>
                                */}
                                <TelegramConnect/>
                            </div>
                            <div className={styles.note}>
                                или используйте вашу почту и пароль для входа:
                            </div>
                        </div>

                        <div id={"form_login"} className={styles.formLogin}>
                            <form onSubmit={(e) => handleSubmit(e, "in")}>
                                <div className={styles.input}>
                                    <input type={"email"} value={email}
                                           autoComplete={"email"}
                                           onBlur={(e) => handleOnChangeEmail(e.target.value)}
                                           onChange={(e) => setEmail(e.target.value)}
                                           className={`${styles.inputField} ${isValidEmail ? '' : styles.invalid}`}
                                           required={true}/>
                                    <label className={styles.inputLabel}>Почта</label>
                                </div>
                                <div className={styles.input}>
                                    <input type={"password"} onChange={(e) => setPass(e.target.value)}
                                           onBlur={(e) => handleOnChangePassword(e.target.value)}
                                           autoComplete={"current-password"}
                                           className={`${styles.inputField} ${isValidPassword ? '' : styles.invalid}`}
                                           required={true} minLength={6}
                                    />
                                    <label className={styles.inputLabel}>Пароль</label>
                                </div>
                                <div id={"errors"}
                                     className={styles.errors}>{errorLogin}
                                </div>
                                <div id={"block_button_sign_in"} className={styles.blockButtonSignIn}>
                                    <button className={`${styles.buttonSign} ${loading ? styles.loading : ""}`}>
                                        Войти в аккаунт
                                    </button>
                                </div>
                            </form>
                            <div className={styles.note}>
                                <button className={styles.secondaryElement}
                                        onClick={() => setReset(true)}
                                >Забыли пароль?
                                </button>
                            </div>
                            <button className={styles.buttonGoToSignUp}
                                    onClick={changePanel}>У меня нету аккаунта
                            </button>
                        </div>
                    </div>
                </div>
                <div id={"main_create_acc"} className={styles.mainCreateAcc}>
                    <div id={"create_acc"} className={styles.createAcc}>
                        <h1>Создать аккаунт</h1>
                        {/*
                        <div className={styles.from_acc}>
                            <div className={styles.icons}>
                                <a href={"#"}><img src={"../../image/icons/icon-google.png"}/></a>
                                <a href={"#"}><img src={"../../image/icons/icon-telegram.png"}/></a>
                                <a href={"#"}><img src={"../../image/icons/icon-vk.png"}/></a>
                            </div>
                            <div className={styles.note}>
                                или используйте ваш email для регистрации:
                            </div>
                        </div>
                        */}

                        <div id={"form_registration"} className={styles.formRegistration}>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.input}>
                                    <input type={"text"} onChange={(e) => setName(e.target.value)}
                                           autoComplete={"username"}
                                           className={`${styles.inputField} ${isValidName ? '' : styles.invalid}`}
                                           onBlur={(e) => handleOnChangeName(e.target.value)}
                                           required={true} minLength={10} maxLength={100}
                                    />
                                    <label className={styles.inputLabel}>ФИО</label>
                                </div>
                                <div className={styles.input}>
                                    <input type={"email"}
                                           autoComplete={"email"}
                                           onBlur={(e) => handleOnChangeEmail(e.target.value)}
                                           onChange={(e) => setEmail(e.target.value)}
                                           className={`${styles.inputField} ${isValidEmail ? '' : styles.invalid}`}
                                           required={true}/>
                                    <label className={styles.inputLabel}>Почта</label>
                                </div>
                                <div id={"errorEmail"}
                                     className={styles.errorEmail}>{errorSignUp}
                                </div>
                                <div className={styles.input}>
                                    <input type={"password"} onChange={(e) => setPass(e.target.value)}
                                           className={`${styles.inputField} ${isValidPassword ? '' : styles.invalid}`}
                                           autoComplete={"new-password"}
                                           onBlur={(e) => handleOnChangePassword(e.target.value)}
                                           required={true} minLength={6}
                                    />
                                    <label className={styles.inputLabel}>Пароль</label>
                                </div>
                                <div id={"block_button_sign_up"} className={styles.blockButtonSignUp}>
                                    <button className={`${styles.buttonSign} ${loading ? styles.loading : ""}`}>
                                        Зарегистрироваться
                                    </button>
                                </div>
                                <div className={styles.note}>
                                    Регистрируясь, вы подтверждаете, что согласны с <a href={"#"}>Нашими правилами</a>
                                </div>
                            </form>
                            <button className={styles.buttonGoToSignIn}
                                    onClick={changePanel}>У меня уже есть аккаунт
                            </button>
                        </div>
                    </div>
                    <div id={"welcome"} className={`${styles.secondBlock}`}>
                        <h1>Добро пожаловать!</h1>
                        <div className={styles.note}>
                            Для создания заказа необходимо зарегистрироваться, введя персональные данные
                        </div>
                        <button id={"button_to_sign_in"}
                                className={styles.buttonToSignIn}
                                onClick={changePanel}
                        >
                            Войти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default SignInUp;
