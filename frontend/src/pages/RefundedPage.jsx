import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useMainContext} from "./MainContext.jsx";

export default function RefundedPage() {
    const navigate = useNavigate();
    const { authTokens } = useMainContext()

    useEffect(() => {
        localStorage.removeItem("guestCart");
    }, []);
    return (
        <div className="container py-5 text-center">
            <h2 className="text-danger mb-3">Заказ отменен ❌</h2>

            <p className="text-muted">
               Заказ отменен, деньги вернутся на карту
            </p>

            <div className="mt-4 d-flex justify-content-center gap-3">
                {authTokens?.access && <button
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