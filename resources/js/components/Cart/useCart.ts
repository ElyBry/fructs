import { useRecoilState } from 'recoil';
import { cartAtom } from './cartAtom';
import {useEffect} from "react";

const useCart = () => {
    const [cartItems, setCartItems] = useRecoilState(cartAtom);

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, [setCartItems]);

    // Сохранение состояния корзины в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (newItem) => {
        setCartItems((prevItems) => [...prevItems, newItem]);
    };

    const removeItem = (itemId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };

    const updateItemQuantity = (itemId, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    return { addItem, removeItem, updateItemQuantity };
};

export default useCart();
