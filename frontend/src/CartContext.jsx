import {createContext, useContext, useEffect, useState} from "react";

const CartContext = createContext();

const saveServer = async (items) => {
    console.log(items.map(p => ({
            product_id: p.id,
            quantity: p.quantity,
        })))
    fetch("/api/cart/sync/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify(items.map(p => ({
            product_id: p.id,
            quantity: p.quantity,
        }))),
    })
};

export function CartProvider({children}) {
    const [cartItems, setCartItems] = useState([]);
    // Загрузка корзины
    useEffect(() => {
        fetch("/api/cart/", {credentials: "include"})
            .then(r => r.json())
            .then(data => {
                const normalized = data.map(item => ({
                    ...item.product,
                    quantity: item.quantity,
                    cart_id: item.id,
                }));
                console.log(normalized);
                setCartItems(normalized);
            })
    }, []);

    const addToCart = (product) => {
        setCartItems(prev => {
            const found = prev.find(p => p.id === product.id);
            let items;
            if (found) {
                items = prev.map(p =>
                    p.id === product.id
                        ? {...p, quantity: p.quantity + 1}
                        : p
                );
            } else {
                items = [...prev, {...product, quantity: 1}];
            }
            saveServer(items)
            return items
        });

    };

    const totalPrice = cartItems.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
    );

    // Обновление суммы в header
    useEffect(() => {
        const el = document.getElementById("totalPrice");
        if (el) el.textContent = totalPrice.toFixed(2);
    }, [totalPrice]);


    return (
        <CartContext.Provider value={{cartItems, addToCart}}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}