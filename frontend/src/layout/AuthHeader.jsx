import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useMainContext} from "../pages/MainContext.jsx";

export default function AuthHeader() {
    const {user, setUser, logoutUser} = useMainContext();
    const [hideAuth, setHideAuth] = useState(window.innerWidth < 850);
    const navigate = useNavigate();

    // Обновление состояния при изменении размеров экрана
    useEffect(() => {
        const handleResize = () => {
            setHideAuth(window.innerWidth < 850);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Получаем текущего пользователя, если есть токен


    // Логаут
    const handleLogout = () => {
        logoutUser();
        navigate('/')
    };

    return <>
        {user ? (
            <>
                {hideAuth ? (
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle custom-link" data-bs-toggle="dropdown" href="#">
                            <i className="bi bi-person-circle"></i>
                        </a>
                        <ul className="dropdown-menu custom-dropdown-menu-auth-mobile">
                            <li><span className="dropdown-item auth-item"><Link
                                to='/profile'>{user.first_name || user.email}</Link></span></li>
                            <li>
                                <button className="dropdown-item auth-item" onClick={handleLogout}>Выход</button>
                            </li>
                        </ul>
                    </li>
                ) : (
                    <div id="authDesktop" className="d-flex">
                        <li className="nav-item custom-nav-item">
                  <span className="nav-link custom-link userSpan">
                    <i className="bi bi-person-circle"></i>
                      <Link to='/profile'>
                          {user.first_name || (user.email.length > 15 ? user.email.slice(0, 4) + '...' : user.email)}
                      </Link>
                  </span>
                        </li>
                        <li className="nav-item custom-nav-item">
                            <button className="nav-link custom-link btn btn-link p-0" onClick={handleLogout}>Выход
                            </button>
                        </li>
                    </div>
                )}
            </>
        ) : (
            <>
                {hideAuth ? (
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle custom-link" data-bs-toggle="dropdown" href="#">
                            <i className="bi bi-three-dots"></i>
                        </a>
                        <ul className="dropdown-menu custom-dropdown-menu-auth-mobile">
                            <li><Link className="dropdown-item auth-item" to="/login">Вход</Link></li>
                            <li><Link className="dropdown-item auth-item" to="/register">Регистрация</Link></li>
                        </ul>
                    </li>
                ) : (
                    <div id="authDesktop" className="d-flex">
                        <li className="nav-item custom-nav-item">
                            <Link className="nav-link custom-link" to="/login">Вход</Link>
                        </li>
                        /
                        <li className="nav-item custom-nav-item">
                            <Link className="nav-link custom-link" to="/register">Регистрация</Link>
                        </li>
                    </div>
                )}
            </>
        )}
    </>
}
