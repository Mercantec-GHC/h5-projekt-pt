"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
    id: number | string;
    name: string;
    price: string;
    image?: string;
    quantity: number;
};

type CartContextValue = {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Omit<CartItem, "quantity">) => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    clearCart: () => void;
    checkout: () => void;
    resetCheckout: () => void;
    isCheckoutPending: boolean;
    checkoutError: string | null;
};

// localStorage key
const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = "pt-market-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isCheckoutPending, setIsCheckoutPending] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    useEffect(() => {
        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!savedCart) {
            return;
        }

        try {
            const parsedCart = JSON.parse(savedCart) as CartItem[];
            if (Array.isArray(parsedCart)) {
                setItems(parsedCart);
            }
        } catch {
            window.localStorage.removeItem(CART_STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (item: Omit<CartItem, "quantity">) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return currentItems.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                );
            }

            return [...currentItems, { ...item, quantity: 1 }];
        });

        setIsOpen(true);
    };

    const clearCart = () => {
        setItems([]);
        setCheckoutError(null);
    };

    const checkout = () => {
        if (items.length === 0) {
            setCheckoutError("Cart is empty");
            return;
        }

        setIsCheckoutPending(true);
        setCheckoutError(null);
    };

    const resetCheckout = () => {
        setIsCheckoutPending(false);
        setCheckoutError(null);
    };

    const value = useMemo(
        () => ({
            items,
            isOpen,
            addItem,
            toggleCart: () => setIsOpen((currentOpen) => !currentOpen),
            openCart: () => setIsOpen(true),
            closeCart: () => setIsOpen(false),
            clearCart,
            checkout,
            resetCheckout,
            isCheckoutPending,
            checkoutError,
        }),
        [items, isOpen, isCheckoutPending, checkoutError],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
};
