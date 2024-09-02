import * as React from 'react';
import { Component, useState } from 'react';
import * as ReactDOM from 'react-dom/client';

const SignInUp = () => {
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPass] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const errorOut:HTMLInputElement = document.querySelector('#errors');
    const errorEmail:HTMLInputElement = document.querySelector('#errorEmail');
    const handleSubmit = (event, is = "") => {
        event.preventDefault();
        if (!isValid) return;
        const url = is === "in" ? 'http://localhost:8000/api/auth/login' : 'http://localhost:8000/api/auth/register';
        const body = is === "in" ? {
            email: Email,
            password: Password
        } : {
            name: Name,
            email: Email,
            password: Password
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
                if (response.status === 400) {
                    errorOut.textContent = 'Неверно введены данные для авторизации';
                    throw new Error('Неверно введены данные для авторизации');
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => console.error(error));
    }
    const handleOnChangeEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        setIsValid(re.test(email));
    }
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
    return  (
        <div id={"main_div"}>
            <div id={"logo"}>
                <img src={"../../image/logos/nocolorlogo.png"}/>
            </div>
            <div className={"panel"}></div>
            <div id={"main_sign_in"}>
                <div id={"hello"} className={"second_block"}>
                    <h1>Привет, друг!</h1>
                    <div className={"note"}>
                        Необходимо авторизоваться, чтобы продолжить заказ
                    </div>
                    <button id={"button_to_sign_up"} onClick={changePanel}>Зарегистрироваться</button>
                </div>
                <div id={"sign_in"}>
                    <h1>Войти</h1>
                    <div className={"from_acc"}>
                        <div className={"icons"}>
                            <a href={"#"}><img src={"../../image/icons/icon-google.png"}/></a>
                            <a href={"#"}><img src={"../../image/icons/icon-telegram.png"}/></a>
                            <a href={"#"}><img src={"../../image/icons/icon-vk.png"}/></a>
                        </div>
                        <div className={"note"}>
                            или используйте вашу почту и пароль для входа:
                        </div>
                    </div>
                    <div id={"form_login"}>
                        <form onSubmit={(e) => handleSubmit(e, "in")}>
                            <div className={"input"}>
                                <input type={"email"} value={Email} onBlur={(e) => handleOnChangeEmail(e.target.value)}
                                       onChange={(e) => setEmail(e.target.value)}
                                       className={`input-field ${isValid ? '' : 'invalid'}`} required={true}/>
                                <label className={"input-label"}>Почта</label>
                            </div>
                            <div className={"input"}>
                                <input type={"password"} value={Password} onChange={(e) => setPass(e.target.value)}
                                       className={"input-field"} required={true}/>
                                <label className={"input-label"}>Пароль</label>
                            </div>
                            <div id={"errors"}>{isValid ? '' : 'Неверно введена почта'}</div>
                            <div id={"block_button_sign_in"}>
                                <button className={"button_sign"}>
                                    Войти в аккаунт
                                </button>
                            </div>
                        </form>
                        <div className={"note"}>
                            <button className={"secondary-element"}>Забыли пароль?</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id={"main_create_acc"}>
                <div id={"create_acc"}>
                    <h1>Создать аккаунт</h1>
                    <div className={"from_acc"}>
                        <div className={"icons"}>
                            <a href={"#"}><img src={"../../image/icons/icon-google.png"}/></a>
                            <a href={"#"}><img src={"../../image/icons/icon-telegram.png"}/></a>
                            <a href={"#"}><img src={"../../image/icons/icon-vk.png"}/></a>
                        </div>
                        <div className={"note"}>
                            или используйте ваш email для регистрации:
                        </div>
                    </div>
                    <div id={"form_registration"}>
                        <form onSubmit={handleSubmit}>
                            <div className={"input"}>
                                <input type={"text"} value={Name} onChange={(e) => setName(e.target.value)}
                                       className={"input-field"} required={true}/>
                                <label className={"input-label"}>ФИО</label>
                            </div>
                            <div className={"input"}>
                                <input type={"email"} value={Email} onBlur={(e) => handleOnChangeEmail(e.target.value)}
                                       onChange={(e) => setEmail(e.target.value)}
                                       className={`input-field ${isValid ? '' : 'invalid'}`} required={true}/>
                                <label className={"input-label"}>Почта</label>
                            </div>
                            <div id={"errorEmail"}>{isValid ? '' : 'Неверно введена почта'}</div>
                            <div className={"input"}>
                                <input type={"password"} value={Password} onChange={(e) => setPass(e.target.value)}
                                       className={"input-field"} required={true}/>
                                <label className={"input-label"}>Пароль</label>
                            </div>
                            <div id={"block_button_sign_up"}>
                                <button className={"button_sign"}>
                                    Зарегистрироваться
                                </button>
                            </div>
                            <div className={"note"}>
                                Регистрируясь, вы подтверждаете, что согласны с <a href={"#"}>Нашими правилами</a>
                            </div>
                        </form>
                    </div>
                </div>
                <div id={"welcome"} className={"second_block"}>
                    <h1>Добро пожаловать!</h1>
                    <div className={"note"}>
                        Для создания заказа необходимо зарегистрироваться, введя персональные данные
                    </div>
                    <button id={"button_to_sign_in"} onClick={changePanel}>Войти</button>
                </div>
            </div>
        </div>
    );
}


const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<SignInUp/>);
}
