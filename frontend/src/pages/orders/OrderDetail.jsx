import {useEffect, useState} from "react";
import {useMainContext} from "../MainContext.jsx";
import ApiClient from "../helpers/apiClient.js";

export default function OrderDetail({orderId}) {
    const [order, setOrder] = useState(null);
    const {authTokens, logoutUser} = useMainContext()

    useEffect(() => {
        ApiClient.get(`/orders/${orderId}/`)
            .then(res => setOrder(res.data))
            .catch(err => {
                console.log(err);
                logoutUser()
            })
    }, [orderId]);

    if (!order) return null;

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
            </div>
        </div>
    );
}
