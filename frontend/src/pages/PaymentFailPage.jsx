import { useNavigate } from "react-router-dom";

export default function PaymentFailPage() {
    const navigate = useNavigate();

    return (
        <div className="container py-5 text-center">
            <h2 className="text-danger mb-3">Оплата не прошла ❌</h2>

            <p className="text-muted">
                Платёж был отменён или произошла ошибка.
                Вы можете попробовать снова.
            </p>

            <div className="mt-4 d-flex justify-content-center gap-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/checkout")}
                >
                    Попробовать снова
                </button>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/")}
                >
                    На главную
                </button>
            </div>
        </div>
    );
}
