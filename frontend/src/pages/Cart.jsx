import {useMainContext} from "./MainContext.jsx";
import {Link} from "react-router-dom";

export default function Cart() {
    const {cartItems, removeFromCart, setQty} = useMainContext();

    const total = cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    if (cartItems.length === 0) {
        return (
            <div className="alert alert-secondary">
                Корзина пуста
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-secondary">Корзина</h2>

            <div className="table-responsive">
                <table className="table table-sm table-bordered align-middle">
                    <thead className="table-light text-secondary">
                    <tr>
                        <th>Товар</th>
                        <th className="text-end">Цена</th>
                        <th className="text-center">Кол-во</th>
                        <th className="text-end">Сумма</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {cartItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>

                            <td className="text-end">
                                {parseFloat(item.price).toFixed(2)}
                            </td>

                            <td className="text-center" style={{width: 140}}>
                                <div className="btn-group btn-group-sm">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setQty(item.id, item.quantity - 1)}
                                    >
                                        −
                                    </button>

                                    <span className="btn btn-light disabled">
                      {item.quantity}
                    </span>

                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setQty(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </td>

                            <td className="text-end">
                                {(item.price * item.quantity).toFixed(2)}
                            </td>

                            <td className="text-center">
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    ×
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                    <tfoot className="table-light">
                    <tr>
                        <th colSpan="3" className="text-end text-secondary">
                            Итого:
                        </th>
                        <th className="text-end">
                            {total.toFixed(2)}
                        </th>
                        <th></th>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <div className="d-flex justify-content-end mt-3">
                <Link
                    to="/checkout"
                    className="btn btn-secondary w-100 mt-3"
                >
                    Оформить заказ
                </Link>
            </div>
        </div>
    );
}

