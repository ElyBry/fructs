import React, {useEffect} from 'react';

declare global {
    interface Window {
        onTelegramAuth: (user: any) => void;
    }
}
const Telegram = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute('data-telegram-login', '@Fructs_EKB_bot');
        script.setAttribute('data-size', 'medium');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        script.async = true;
        script.type = "text/javascript";

        document.getElementById('telegram').appendChild(script);

        window.onTelegramAuth = function (user) {
            alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
        };

        return () => {
            document.getElementById('telegram').removeChild(script);
        };
    }, []);

    return (
        <div id="telegram"></div>
    );
};

export default Telegram;
