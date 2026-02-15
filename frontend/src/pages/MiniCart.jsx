import {useEffect, useRef, useState, useCallback} from "react";
import {createPortal} from "react-dom";
import {Link} from "react-router-dom";
import {useMainContext} from "../pages/MainContext.jsx";

export default function MiniCart({anchorRef, onClose}) {
    const {cartItems, totalPrice} = useMainContext();

    const cartRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({top: 0, left: 0});

    // ===== вычисление позиции относительно иконки =====
    const updatePosition = useCallback(() => {
        if (!anchorRef?.current) return;

        const rect = anchorRef.current.getBoundingClientRect();
        const width = 320;
        const gap = 8;

        let left = rect.right - width + 15;
        if (left < gap) left = gap;
        if (left + width > window.innerWidth) {
            left = window.innerWidth - width - gap;
        }

        setPos({
            top: rect.bottom + gap,
            left,
        });
    }, [anchorRef]);

    // ===== позиционирование + resize/scroll =====
    useEffect(() => {
        updatePosition();
        requestAnimationFrame(() => setVisible(true));

        const handleUpdate = () => {
            requestAnimationFrame(updatePosition);
        };

        window.addEventListener("resize", handleUpdate);
        window.addEventListener("scroll", handleUpdate, true);

        return () => {
            window.removeEventListener("resize", handleUpdate);
            window.removeEventListener("scroll", handleUpdate, true);
        };
    }, [updatePosition]);

    // ===== закрытие по клику вне корзины и вне иконки =====
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                cartRef.current &&
                !cartRef.current.contains(e.target) &&
                anchorRef?.current &&
                !anchorRef.current.contains(e.target)
            ) {
                close();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const close = () => {
        setVisible(false);
        setTimeout(onClose, 200); // совпадает с анимацией
    };

    return createPortal(
        <div
            ref={cartRef}
            className={`mini-cart card shadow ${visible ? "show" : ""}`}
            style={{
                top: pos.top,
                left: pos.left,
                width: 320,
                zIndex: 9999,
            }}
        >
            <div className="card-body">
                <h6 className="text-secondary mb-3">Корзина</h6>

                {cartItems.length === 0 && (
                    <p className="text-muted text-center">Корзина пуста</p>
                )}

                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="d-flex justify-content-between mb-2"
                    >
                        <div>
                            <div className="small">{item.name}</div>
                            <div className="text-muted small">
                                {item.quantity} × {item.price} ₽
                            </div>
                        </div>
                        <div className="fw-semibold">
                            {item.quantity * item.price} ₽
                        </div>
                    </div>
                ))}

                {cartItems.length > 0 && (
                    <>
                        <hr/>
                        <div className="d-flex justify-content-between fw-bold">
                            <span>Итого:</span>
                            <span>{totalPrice} ₽</span>
                        </div>

                        <Link
                            to="/cart"
                            className="btn btn-secondary w-100 mt-3"
                            onClick={close}
                        >
                            Перейти в корзину
                        </Link>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}


