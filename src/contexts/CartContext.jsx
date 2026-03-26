import { createContext, useContext, useState, useCallback } from 'react';

/*
  Item en el carrito:
  { id, nombre, precio, imagen?, qty }
*/

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = useCallback((producto) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) return prev.map(i => i.id === producto.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...producto, qty: 1 }];
    });
  }, []);

  const decrementItem = useCallback((id) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0)
    );
  }, []);

  const removeItem  = useCallback((id) => setItems(prev => prev.filter(i => i.id !== id)), []);
  const clearCart   = useCallback(() => setItems([]), []);

  const totalItems  = items.reduce((s, i) => s + i.qty, 0);
  const totalPrecio = items.reduce((s, i) => s + i.precio * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, decrementItem, removeItem, clearCart, totalItems, totalPrecio }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
};