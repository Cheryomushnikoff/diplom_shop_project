import {useEffect, useState} from "react";
import {useMainContext} from "../MainContext.jsx";
import ApiClient from "../helpers/apiClient.js";

export default function OrderDetail({orderId, onUpdate}) {
    const [order, setOrder] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const {logoutUser} = useMainContext()
    const [loadingCanceled, setLoadingCanceled] = useState(false);
    const [loadingRefunded, setLoadingRefunded] = useState(false);
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

    const waitForStatusUpdate = async () => {
        let attempts = 0;

        const interval = setInterval(async () => {
            attempts++;

            const res = await ApiClient.get(`/orders/${orderId}/`);
            setOrder(res.data);

            if (res.data.status !== "paid" || attempts > 10) {
                clearInterval(interval);
                onUpdate?.();
            }

        }, 2000);
    };


    if (!order) return null;

    const canCancel = ["new"].includes(order.status);
    const canRefunded = ["paid"].includes(order.status);

    const cancelOrder = async () => {
        if (!window.confirm("Вы уверены, что хотите отменить заказ?")) return;

        setLoadingCanceled(true);
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
            setLoadingCanceled(false);
            fetchOrder()
        }
    };

    const refundedOrder = async () => {
        if (!window.confirm("Вы уверены, что хотите отменить заказ и вернуть деньги?")) return;

        setLoadingRefunded(true);
        setError("");

        try {
            await ApiClient.post(`/payments/user-refund/${orderId}/`);
            await waitForStatusUpdate()

        } catch (err) {
            setError({
                global: err.response?.data?.detail ||
                    "Не удалось отменить заказ",
            });

        } finally {
            setLoadingRefunded(false);
            fetchOrder();
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
                </button>}
                {canCancel && (
                    <button
                        className="btn btn-outline-danger m-2 px-4"
                        onClick={cancelOrder}
                        disabled={loadingCanceled}
                    >
                        {loadingCanceled ? <>
                            <span className="spinner-border spinner-border-sm me-2"/>
                            Отмена…
                        </> : "Отменить заказ"}
                    </button>
                )}
                {canRefunded && (
                    <button
                        className="btn btn-outline-danger m-2 px-4"
                        onClick={refundedOrder}
                        disabled={loadingRefunded}
                    >
                        {loadingRefunded ? <>
                            <span className="spinner-border spinner-border-sm me-2"/>
                            Возврат…
                        </> : "Отменить заказ и вернуть деньги"}
                    </button>
                )}
            </div>
        </div>
    );
}
