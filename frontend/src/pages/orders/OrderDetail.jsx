import {useEffect, useState} from "react";
import {useMainContext} from "../MainContext.jsx";
import ApiClient from "../helpers/apiClient.js";

export default function OrderDetail({orderId, onUpdate }) {
    const [order, setOrder] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const {logoutUser} = useMainContext()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fetchOrder = async () => {
        ApiClient.get(`/orders/${orderId}/`)
            .then(res => setOrder(res.data))
            .catch(err => {
                console.log(err);
                logoutUser()
            })
    }

    useEffect(() => {
        fetchOrder()
    }, [orderId]);

    if (!order) return null;

    const canCancel = ["new"].includes(order.status);

    const cancelOrder = async () => {
        if (!window.confirm("Вы уверены, что хотите отменить заказ?")) return;

        setLoading(true);
        setError("");

        try {
            await ApiClient.post(`/orders/${order.id}/cancel/`);
            onUpdate(); // 🔄 перезагрузка списка заказов
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Не удалось отменить заказ"
            );
        } finally {
            setLoading(false);
            fetchOrder()
        }
    };

    const date = new Date(order.created_at)
    const timeString = `${date.getHours()}:${date.getMinutes()}`
    let formattedDate = date.toLocaleDateString('ru-RU')

    return (
        <div className="card">
            <div className="card-body">
                <h5>Заказ #{order.id}</h5>
                <div>
                    <small>Создан: {formattedDate}</small> <small>{timeString}</small>
                </div>
                <span className="badge bg-secondary">
          {order.status_display}
        </span>

                <hr/>

                {order.items.map((i, idx) => (
                    <div key={idx} className="d-flex justify-content-between">
                        <span>{i.product_name} × {i.quantity}</span>
                        <span>{i.price} ₽</span>
                    </div>
                ))}

                <hr/>

                <strong>Итого: {order.total_price} ₽</strong>

                <hr/>
                <strong>Адрес доставки:</strong>
                <p>{order.address}</p>
                {order.status_display === 'Новый' && <button
                    className="btn btn-success mt-4 px-4"
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
                </button>}
                {canCancel && (
                <button
                    className="btn btn-outline-danger mt-4 px-4 ml-2"
                    onClick={cancelOrder}
                    disabled={loading}
                >
                    {loading ? "Отмена…" : "Отменить заказ"}
                </button>
            )}
            </div>
        </div>
    );
}
