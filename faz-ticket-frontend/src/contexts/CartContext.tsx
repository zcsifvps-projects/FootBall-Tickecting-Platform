// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { CartItem } from "../types/ticket";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number; // 1. Add this to your interface
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => setCart((prev) => [...prev, item]);
  
  const removeFromCart = (index: number) =>
    setCart((prev) => prev.filter((_, i) => i !== index));

  const updateQuantity = (index: number, quantity: number) =>
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );

  const clearCart = () => setCart([]);

  // 2. Calculate the total number of items (sum of all quantities)
  const itemCount = useMemo(() => 
    cart.reduce((acc, item) => acc + item.quantity, 0), 
  [cart]);

  const totalPrice = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), 
  [cart]);

  return (
    <CartContext.Provider
      // 3. Pass itemCount into the value
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, itemCount }}
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