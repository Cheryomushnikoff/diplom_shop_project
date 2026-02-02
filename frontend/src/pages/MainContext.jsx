import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "./helpers/apiClient";
import {
    clearGuestCart,
    loadGuestCart,
    saveGuestCart,
} from "./helpers/cartStorage";

const MainContext = createContext();

export function MainProvider({ children }) {
    const [authTokens, setAuthTokens] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("authTokens"));
        } catch {
            localStorage.removeItem("authTokens");
            return null;
        }
    });

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [query, setQuery] = useState("");

// Функция для переключения категории (выбор/снятие)
const toggleCategory = (slug) => {
    setSelectedCategories((prev) => {
        if (prev.find(arr => arr[1] === slug[1])) return prev.filter((s) => s[1] !== slug[1]);
        return [...prev, slug];
    });
};


    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    /* ---------------- AUTH ---------------- */

    const loginUser = async (tokens) => {
        localStorage.setItem("authTokens", JSON.stringify(tokens));
        setAuthTokens(tokens);

        const guestCart = loadGuestCart();

        if (guestCart.length) {
            await apiClient.post(
                "cart/merge/",
                guestCart.map((p) => ({
                    product_id: p.id,
                    quantity: p.quantity,
                }))
            );
            clearGuestCart();
        }
    };

    const logoutUser = () => {
        localStorage.removeItem("authTokens");
        setAuthTokens(null);
        setUser(null);
        setCartItems([]);
    };

    /* ---------------- USER ---------------- */

    useEffect(() => {
        if (!authTokens) return;

        apiClient
            .get("accounts/user/")
            .then((res) => setUser(res.data))
            .catch(() => logoutUser());
    }, [authTokens]);

    /* ---------------- CART LOAD ---------------- */

    useEffect(() => {
        if (!authTokens) {
            setCartItems(loadGuestCart());
            return;
        }

        apiClient
            .get("cart/")
            .then((res) => {
                const normalized = res.data.map((item) => ({
                    ...item.product,
                    quantity: item.quantity,
                    cart_id: item.id,
                }));
                setCartItems(normalized);
            })
            .catch(console.error);
    }, [authTokens]);

    /* ---------------- CART SYNC ---------------- */

    const syncCart = async (items) => {
        try {
            await apiClient.post(
                "cart/sync/",
                items.map((p) => ({
                    product_id: p.id,
                    quantity: p.quantity,
                }))
            );
        } catch (err) {
            console.error("Ошибка синхронизации корзины", err);
        }
    };

    /* ---------------- CART ACTIONS ---------------- */

    const addToCart = (product) => {
        setCartItems((prev) => {
            const found = prev.find((p) => p.id === product.id);
            const next = found
                ? prev.map((p) =>
                      p.id === product.id
                          ? { ...p, quantity: p.quantity + 1 }
                          : p
                  )
                : [...prev, { ...product, quantity: 1 }];

            authTokens ? syncCart(next) : saveGuestCart(next);
            return next;
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => {
            const next = prev.filter((p) => p.id !== id);
            authTokens ? syncCart(next) : saveGuestCart(next);
            return next;
        });
    };

    const setQty = (id, qty) => {
        setCartItems((prev) => {
            const next =
                qty <= 0
                    ? prev.filter((p) => p.id !== id)
                    : prev.map((p) =>
                          p.id === id ? { ...p, quantity: qty } : p
                      );

            authTokens ? syncCart(next) : saveGuestCart(next);
            return next;
        });
    };

    const totalPrice = cartItems.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
    );

    return (
        <MainContext.Provider
            value={{
                authTokens,
                user,
                cartItems,
                addToCart,
                removeFromCart,
                setQty,
                loginUser,
                logoutUser,
                totalPrice,
                setCartItems,
                selectedCategories,  // массив выбранных категорий
                toggleCategory,
                query,
                setQuery
            }}
        >
            {children}
        </MainContext.Provider>
    );
}

export const useMainContext = () => useContext(MainContext);
