import {useMainContext} from "../pages/MainContext.jsx";
import {useRef, useState} from "react";
import MiniCart from "../pages/MiniCart.jsx";

export default function CartHeader() {
    const {totalPrice} = useMainContext();
    const [open, setOpen] = useState(false);
    const cartRef = useRef(null);

    return <>
        <li className="nav-item">
            <div
                className={`nav-link custom-link ${open ? 'non-active' : ''} cartDiv position-relative`}
                ref={cartRef}
                onClick={() => setOpen(v => !v)}>
                <i className="bi bi-cart"></i>
                <span id="totalPrice">{totalPrice.toFixed(2)}</span>
            </div>
            {open && (
                <MiniCart
                    anchorRef={cartRef}
                    onClose={() => setOpen(false)}
                />
            )}
        </li>
    </>
}