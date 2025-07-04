import { useState, useEffect } from 'react';

export function useCart() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    // Central function to update state and localStorage together
    const updateCart = (newCartItems) => {
        const newTotal = newCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        localStorage.setItem('cart', JSON.stringify(newCartItems));
        setCartItems(newCartItems);
        setTotal(newTotal);
    };

    // Load cart from localStorage only on initial mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                updateCart(JSON.parse(storedCart));
            } catch (error) {
                console.error('Error parsing cart from localStorage', error);
                updateCart([]);
            }
        }
    }, []);

    const addToCart = (item) => {
        const currentItems = [...cartItems];
        const itemId = Number(item.id);
        const existingItemIndex = currentItems.findIndex(cartItem => Number(cartItem.id) === itemId);

        if (existingItemIndex >= 0) {
            currentItems[existingItemIndex].quantity += item.quantity;
        } else {
            currentItems.push({ ...item, id: itemId });
        }
        updateCart(currentItems);
    };

    const removeFromCart = (itemId) => {
        const updatedItems = cartItems.filter(item => Number(item.id) !== Number(itemId));
        updateCart(updatedItems);
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
            return;
        }
        const updatedItems = cartItems.map(item =>
            Number(item.id) === Number(itemId) ? { ...item, quantity: newQuantity } : item
        );
        updateCart(updatedItems);
    };

    const clearCart = () => {
        updateCart([]);
    };

    return {
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };
} 