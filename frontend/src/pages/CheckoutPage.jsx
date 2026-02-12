import {useEffect, useState} from "react";
import {useMainContext} from "../pages/MainContext.jsx";
import ApiClient from "./helpers/apiClient.js";
import {useNavigate} from "react-router-dom";

export default function CheckoutPage() {
    const {
        setCartItems,
        cartItems,
        totalPrice,
        authTokens,
        logoutUser
    } = useMainContext();
    const navigate = useNavigate()
    const [orderId, setOrderId] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);



    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);



    /* ---------- загрузка профиля ---------- */

    useEffect(() => {
        if (authTokens) {
            ApiClient
                .get("/accounts/profile/")
                .then(res => setUser(res.data))
                .catch(() => logoutUser());
        }
    }, []);

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

    /* ---------- helpers ---------- */

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: null,
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.first_name.trim()) newErrors.first_name = "Введите имя";
        if (!form.last_name.trim()) newErrors.last_name = "Введите фамилию";

        if (!form.email.trim()) {
            newErrors.email = "Введите email";
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = "Некорректный email";
        }

        if (!form.phone.trim()) newErrors.phone = "Введите телефон";
        if (!form.address.trim()) newErrors.address = "Введите адрес доставки";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const cancelOrder = async () => {
        if (!window.confirm("Вы уверены, что хотите отменить заказ?")) return;

        setLoadingCancel(true);
        setErrors("");

        try {
            await ApiClient.post(`/orders/${orderId}/cancel/`);
            navigate('/cancelled')

        } catch (err) {
            setErrors({
                global: err.response?.data?.detail ||
                "Не удалось отменить заказ",
            });

        } finally {
            setLoadingCancel(false);
        }
    };

    /* ---------- submit ---------- */

    const submitOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);

        const payload = {
            ...form,
            items: authTokens
                ? undefined
                : cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
        };

        try {
            const res = await ApiClient.post(
                "/orders/create/",
                JSON.stringify(payload)
            );

            setCartItems([]);
            setOrderId(res.data.id);
        } catch {
            setErrors({
                global: "Не удалось оформить заказ. Попробуйте позже.",
            });
        } finally {
            setLoading(false);
        }
    };


    /* ---------- success ---------- */

    if (orderId) {
        return (
            <div className="container py-5 text-center">
                <h3>Заказ №{orderId} создан ✅</h3>

                <p className="text-muted mt-2">
                    Остался последний шаг — оплата
                </p>

                <button
                    className="btn btn-success m-2 px-4"
                    disabled={paymentLoading}
                    onClick={async () => {
                        setPaymentLoading(true);
                        try {
                            const res = await ApiClient.post(
                                `/payments/yookassa/create/${orderId}/`
                            );
                            console.log(res.data.payment_url)
                            window.location.href = res.data.payment_url;
                        } catch {
                            alert("Ошибка перехода к оплате");
                        } finally {
                            setPaymentLoading(false);
                        }
                    }}
                >
                    {paymentLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"/>
                            Переход к оплате…
                        </>
                    ) : (
                        "Оплатить заказ"
                    )}
                </button>
                <button
                    className="btn btn-outline-danger m-2 px-4"
                    onClick={cancelOrder}
                    disabled={loadingCancel}
                >
                    {loadingCancel ? <>
                            <span className="spinner-border spinner-border-sm me-2"/>
                            Отмена…
                        </> : "Отменить заказ"}
                </button>
            </div>
        );
    }


    /* ---------- render ---------- */

    return (
        <div className="container py-4">
            <h3 className="mb-4">Оформление заказа</h3>

            <div className="row g-4">
                {/* Левая колонка */}
                <div className="col-lg-7">
                    <div className="card p-3">
                        <h5 className="mb-3">Данные покупателя</h5>

                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <input
                                    name="first_name"
                                    className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                                    placeholder="Имя"
                                    value={form.first_name}
                                    onChange={handleChange}
                                />
                                <div className="invalid-feedback">
                                    {errors.first_name}
                                </div>
                            </div>

                            <div className="col-md-6 mb-2">
                                <input
                                    name="last_name"
                                    className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                                    placeholder="Фамилия"
                                    value={form.last_name}
                                    onChange={handleChange}
                                />
                                <div className="invalid-feedback">
                                    {errors.last_name}
                                </div>
                            </div>
                        </div>

                        <input
                            name="email"
                            className={`form-control mb-2 ${errors.email ? "is-invalid" : ""}`}
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {errors.email}
                        </div>

                        <input
                            name="phone"
                            className={`form-control mb-2 ${errors.phone ? "is-invalid" : ""}`}
                            placeholder="Телефон"
                            value={form.phone}
                            onChange={handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {errors.phone}
                        </div>

                        <textarea
                            name="address"
                            className={`form-control ${errors.address ? "is-invalid" : ""}`}
                            rows={3}
                            placeholder="Адрес доставки"
                            value={form.address}
                            onChange={handleChange}
                        />
                        <div className="invalid-feedback d-block">
                            {errors.address}
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
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

                        {errors.global && (
                            <div className="alert alert-danger">
                                {errors.global}
                            </div>
                        )}

                        <button
                            className="btn btn-secondary w-100"
                            onClick={submitOrder}
                            disabled={loading || cartItems.length === 0}
                        >
                            {loading ? (
                                <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                />
                                    Оформляем…
                                </>
                            ) : "Оформить заказ"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

