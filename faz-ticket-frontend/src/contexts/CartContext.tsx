// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { CartItem } from "../types/ticket";

interface CartContextType {
  cart: CartItem[]; // Changed from 'items' to 'cart' to match your page imports
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number; // Added this so you don't have to calculate it on every page
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]); // Changed from 'items'

  const addToCart = (item: CartItem) => setCart((prev) => [...prev, item]);
  
  const removeFromCart = (index: number) =>
    setCart((prev) => prev.filter((_, i) => i !== index));

  const updateQuantity = (index: number, quantity: number) =>
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );

  const clearCart = () => setCart([]);

  // Calculate total price here once
  const totalPrice = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), 
  [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};