import {createContext, useContext, useEffect, useState} from "react";
import {refreshToken as refreshTokenAPI} from "./helpers/api.js";
import {clearGuestCart, loadGuestCart, saveGuestCart} from "./helpers/cartStorage.js";
import parseJwt from "./helpers/api.js";

const MainContext = createContext();

export function MainProvider({children}) {
    const [authTokens, setAuthTokens] = useState(() => {
        const tokens = localStorage.getItem("authTokens");
        if (tokens) {
            try {
                return JSON.parse(tokens);
            } catch (e) {
                console.error("Ошибка при парсинге authTokens:", e);
                localStorage.removeItem("authTokens"); // очищаем некорректные данные
            }
        }
        return null;
    });
    const [user, setUser] = useState(() =>
        authTokens ? parseJwt(authTokens.access) : null
    );

    const [cartItems, setCartItems] = useState([]);


    const loginUser = async (data) => {

        localStorage.setItem("authTokens", JSON.stringify(data));
        setUser(parseJwt(data.access));
        const guestCart = loadGuestCart();

        if (guestCart.length > 0) {
            await fetch("/api/cart/merge/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.access}`,
                },
                body: JSON.stringify(
                    guestCart.map(p => ({
                        product_id: p.id,
                        quantity: p.quantity,
                    }))
                ),
            });

            clearGuestCart();
        }
        setAuthTokens(data);
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        setCartItems([]);
    };

    // Автообновление access-токена каждые 14 минут
    useEffect(() => {
        if (!authTokens) return;

        const interval = setInterval(async () => {
            try {
                const res = await refreshTokenAPI(authTokens.refresh);
                const newTokens = {
                    access: res.data.access,
                    refresh: authTokens.refresh,
                };
                setAuthTokens(newTokens);
                localStorage.setItem("authTokens", JSON.stringify(newTokens));
                setUser(parseJwt(newTokens.access));
            } catch (err) {
                console.error("Не удалось обновить токен", err);
                logoutUser();
            }
        }, 1000 * 60 * 14);

        return () => clearInterval(interval);
    }, [authTokens]);

    // Загрузка корзины с сервера
    useEffect(() => {
        if (!authTokens) {
            setCartItems(loadGuestCart());
            return;
        }

            fetch("/api/cart/", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authTokens.access}`
                },
            })
                .then((r) => r.json())
                .then((data) => {
                    const normalized = data.map((item) => ({
                        ...item.product,
                        quantity: item.quantity,
                        cart_id: item.id,
                    }));
                    setCartItems(normalized);
                })
                .catch((err) => console.error(err));
    }, [authTokens]);

    const saveServer = async (items) => {
        try {
            const token = JSON.parse(localStorage.getItem("authTokens")).access;

            await fetch("/api/cart/sync/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify(
                    items.map((p) => ({product_id: p.id, quantity: p.quantity}))
                ),
            });
        } catch (err) {
            console.error("Ошибка синхронизации корзины:", err);
        }
    };

    const addToCart = (product) => {
        setCartItems((prev) => {
            const found = prev.find((p) => p.id === product.id);
            const items = found
                ? prev.map((p) =>
                    p.id === product.id ? {...p, quantity: p.quantity + 1} : p
                )
                : [...prev, {...product, quantity: 1}];
            if (authTokens) {
                saveServer(items);
            } else {
                saveGuestCart(items)
            }

            return items;
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => {
            const next = prev.filter((p) => p.id !== id);
            if (authTokens) {
                saveServer(next);
            } else {
                saveGuestCart(next)
            }
            return next;
        });
    };

    const setQty = (id, qty) => {
        setCartItems((prev) => {
            const next =
                qty <= 0
                    ? prev.filter((p) => p.id !== id)
                    : prev.map((p) => (p.id === id ? {...p, quantity: qty} : p));
            if (authTokens) {
                saveServer(next);
            } else {
                saveGuestCart(next)
            }
            return next;
        });
    };

    const totalPrice = cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return (
        <MainContext.Provider
            value={{
                setCartItems,
                cartItems,
                addToCart,
                setQty,
                removeFromCart,
                authTokens,
                user,
                loginUser,
                logoutUser,
                totalPrice,
            }}
        >
            {children}
        </MainContext.Provider>
    );
}

export const useMainContext = () => useContext(MainContext);


