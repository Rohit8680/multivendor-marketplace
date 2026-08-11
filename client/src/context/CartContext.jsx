import React, { createContext, useState, useEffect, useContext } from 'react';
import API, { getErrorMessage } from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    if (!user || user.role !== 'CUSTOMER') {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      setCart(data || { items: [] });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const { data } = await API.post('/cart', { productId, quantity });
      setCart(data);
      return data;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setError(null);
      const { data } = await API.put(`/cart/${productId}`, { quantity });
      setCart(data);
      return data;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      const { data } = await API.delete(`/cart/${productId}`);
      setCart(data);
      return data;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const clearCartState = () => {
    setCart({ items: [] });
  };

  const cartCount = cart && cart.items ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
  const cartTotal = cart && cart.items
    ? cart.items.reduce(
        (sum, item) => sum + (item.product && item.product.price ? item.product.price * item.quantity : 0),
        0
      )
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCartState,
        setError
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
