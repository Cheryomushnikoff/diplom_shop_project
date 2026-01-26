import {useEffect, useState} from "react";
import {useMainContext} from "../pages/MainContext.jsx";
import axios from "axios";

export default function CheckoutPage() {
    const {
        setCartItems,
        cartItems,
        totalPrice,
        authTokens,
    } = useMainContext();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (authTokens) {
            axios.get("/api/accounts/profile/", {headers: {Authorization: `Bearer ${authTokens.access}`}})
                .then(res => {
                    setUser(res.data);
                })
                .catch(err => console.error(err));
        }
    }, []);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // автозаполнение для авторизованного пользователя
    useEffect(() => {
        if (user) {
            setForm({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const submitOrder = async () => {
        setLoading(true);

        const payload = {
            ...form,
            items: authTokens
                ? undefined // для авторизованного корзина на сервере
                : cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
        };

        try {
            const res = await fetch("/api/orders/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(authTokens && {
                        Authorization: `Bearer ${authTokens.access}`,
                    }),
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Ошибка оформления");

            setCartItems([]);
            setSuccess(true);
        } catch (err) {
            alert("Не удалось оформить заказ");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container py-5 text-center">
                <h3>Спасибо за заказ 🎉</h3>
                <p className="text-muted mt-2">
                    Мы свяжемся с вами в ближайшее время
                </p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h3 className="mb-4">Оформление заказа</h3>

            <div className="row g-4">
                {/* === Левая колонка: данные === */}
                <div className="col-lg-7">
                    <div className="card p-3">
                        <h5 className="mb-3">Данные покупателя</h5>

                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <input
                                    name="first_name"
                                    className="form-control"
                                    placeholder="Имя"
                                    value={form.first_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6 mb-2">
                                <input
                                    name="last_name"
                                    className="form-control"
                                    placeholder="Фамилия"
                                    value={form.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <input
                            name="email"
                            className="form-control mb-2"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <input
                            name="phone"
                            className="form-control mb-2"
                            placeholder="Телефон"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        <textarea
                            name="address"
                            className="form-control"
                            rows={3}
                            placeholder="Адрес доставки"
                            value={form.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* === Правая колонка: заказ === */}
                <div className="col-lg-5">
                    <div className="card p-3">
                        <h5 className="mb-3">Ваш заказ</h5>

                        {cartItems.map(item => (
                            <div
                                key={item.id}
                                className="d-flex justify-content-between mb-2"
                            >
                                <div>
                                    <div>{item.name}</div>
                                    <div className="text-muted small">
                                        {item.quantity} × {item.price} ₽
                                    </div>
                                </div>
                                <div className="fw-semibold">
                                    {item.quantity * item.price} ₽
                                </div>
                            </div>
                        ))}

                        <hr/>

                        <div className="d-flex justify-content-between fw-bold mb-3">
                            <span>Итого:</span>
                            <span>{totalPrice} ₽</span>
                        </div>

                        <button
                            className="btn btn-secondary w-100"
                            onClick={submitOrder}
                            disabled={loading || cartItems.length === 0}
                        >
                            {loading ? "Оформляем..." : "Оформить заказ"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
