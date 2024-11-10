<!DOCTYPE html>
<html>
<head>
    <title>Уведомление о заказе</title>
</head>
<body>
    <h1>Новый заказ!</h1>
    <p>У вас новый заказ с ID: {{ $orderId }}</p>
    <p>Общая сумма заказа: {{ $orderTotal }}</p>
    <p>Адрес: {{ $address }}</p>
    <p>Номер телефона: {{ $number }}</p>
    <h2>Подробнее на <a href="https://fructs.ru/admin/orders">сайте</a> </h2>
</body>
</html>
