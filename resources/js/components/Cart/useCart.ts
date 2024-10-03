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

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (newItem) => {
        const isExist = cartItems.findIndex(item => item.id == newItem.id);
        if (isExist >= 0) {
            return removeItem(newItem.id);
        } else {
            setCartItems((prevItems) => [...prevItems, { ...newItem, quantity: 1}]);
        }
    };

    const removeItem = (itemId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };

    const updateItemQuantity = (itemId, quantity) => {
        if (quantity == 0) {
            return removeItem(itemId);
        }
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id !== itemId ? item : {...item, quantity}
            )
        );
    };

    return { addItem, removeItem, updateItemQuantity };
};

export default useCart;
