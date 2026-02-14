import { useEffect, useState} from "react";
import {Link} from "react-router-dom";
import HeaderSearch from "./HeaderSearch.jsx";
import AuthHeader from "./AuthHeader.jsx";
import CartHeader from "./CartHeader.jsx";
import CategoryHeader from "./CategoryHeader.jsx";

export default function Header() {
    const [hideName, setHideName] = useState(window.innerWidth < 940);

    // Обновление состояния при изменении размеров экрана
    useEffect(() => {
        const handleResize = () => {
            setHideName(window.innerWidth < 940);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <header>
            <ul className="nav justify-content-center custom-nav mt-3 mb-4">

                {/* Логотип */}
                <li className="nav-item">
                    <Link id="logo" className="nav-link active custom-link" to="/">
                        <i className="bi bi-disc"></i>
                        {!hideName && <span> Beads-shop</span>}
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link custom-link" to="/products">
                        Каталог
                    </Link>
                </li>

                <CategoryHeader/>

                <HeaderSearch/>

                <CartHeader/>

                <AuthHeader/>
            </ul>
        </header>
    );
}

