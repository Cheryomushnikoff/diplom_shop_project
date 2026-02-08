import {useEffect, useState} from "react";
import {useMainContext} from "../MainContext.jsx";
import OrderDetail from "./OrderDetail.jsx";
import ApiClient from "../helpers/apiClient.js";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const {authTokens, logoutUser} = useMainContext()

  useEffect(() => {
      ApiClient
          .get("/orders/")
          .then(res => setOrders(res.data))
          .catch(err => {
              console.log(err);
              logoutUser()
          })
  }, []);

  return (
    <div className="row">
      <div className="col-md-5 ">
        <ul className="list-group orders-list">
          {orders.map(o => (
            <li
              key={o.id}
              className={`list-group-item ${
                activeId === o.id ? "active" : ""
              }`}
              onClick={() => setActiveId(o.id)}
            >
              <div className="d-flex justify-content-between">
                <span>Заказ #{o.id}</span>
                <strong>{o.total_price} ₽</strong>
              </div>
              <small>{o.status_display}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-md-7">
        {activeId && <OrderDetail orderId={activeId} />}
      </div>
    </div>
  );
}
