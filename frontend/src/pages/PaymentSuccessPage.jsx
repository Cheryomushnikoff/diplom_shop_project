import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useMainContext} from "./MainContext.jsx";

export default function PaymentSuccessPage() {
    const navigate = useNavigate();
    const { authToken } = useMainContext()

    useEffect(() => {
        // можно очистить корзину
        localStorage.removeItem("guestCart");
    }, []);

    return (
        <div className="container py-5 text-center">
            <h2 className="text-success mb-3">Оплата прошла успешно 🎉</h2>

            <p className="text-muted">
                Мы получили ваш платёж.
                Скоро приступим к обработке заказа.
            </p>

            <div className="mt-4 d-flex justify-content-center gap-3">
                {authToken?.access && <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/profile?tab=orders")}
                >
                    Мои заказы
                </button>}

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/products")}
                >
                    Продолжить покупки
                </button>
            </div>
        </div>
    );
}
