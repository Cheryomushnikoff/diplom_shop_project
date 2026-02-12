import {useRef, useState} from "react";
import CategoryDropdown from "./CategoryDropdown.jsx";

export default function CategoryHeader() {
    const buttonRef = useRef(null);
    const [open, setOpen] = useState(false);

    return (
        <>
            <li className="nav-item custom-link">
                <button
                    ref={buttonRef}
                    className="nav-link btn btn-link"
                    onClick={() => setOpen((v) => !v)}
                >
                    Категории <i className="bi bi-three-dots-vertical"></i>
                </button>
            </li>

            {open && (
                <CategoryDropdown
                    anchorRef={buttonRef}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
