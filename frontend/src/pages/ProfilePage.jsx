import {useState, useEffect} from "react";
import OrdersTab from "./orders/OrdersTab.jsx";
import ApiClient from "./helpers/apiClient.js";
import {useMainContext} from "./MainContext.jsx";
import {useSearchParams} from "react-router-dom";

export default function ProfilePage() {
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
    );

    useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
        setActiveTab(tab);
    }}, [searchParams]);

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        address: "",
        first_name: "",
        last_name: "",
        subscribed_to_newsletter: false
    });
    const [message, setMessage] = useState("");
    const [passwordData, setPasswordData] = useState({old_password: "", new_password: "", confirm_password: ""});
    const [passwordMessage, setPasswordMessage] = useState("");
    const {logoutUser, user, setUser} = useMainContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 450)

    // Обновление состояния при изменении размеров экрана
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 450);

        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    // Получение профиля
    useEffect(() => {
        ApiClient
            .get("/accounts/profile/")
            .then(res => {
                setUser(res.data);
                setFormData(res.data);
            })
            .catch(err => {
                console.error(err);
                logoutUser();
            });
    }, []);

    // Получение истории заказо

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({...formData, [name]: type === "checkbox" ? checked : value});
    };

    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        setPasswordData({...passwordData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res = await ApiClient
                .put("/accounts/profile/", formData);
            setUser(res.data)
            setMessage("Профиль успешно обновлён!");
        } catch {
            setMessage("Ошибка обновления профиля");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage("");
        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordMessage("Новые пароли не совпадают");
            return;
        }
        try {
            await ApiClient
                .post("/accounts/change_password/", passwordData);
            setPasswordMessage("Пароль успешно изменён!");
            setPasswordData({old_password: "", new_password: "", confirm_password: ""});
        } catch {
            logoutUser();
            setPasswordMessage("Ошибка смены пароля");
        }
    };

    if (!user) return <div className="text-center mt-5">Загрузка...</div>;

    return (
        <div className="container my-5">
            <h2 className="mb-4">Личный кабинет</h2>
            <ul className="nav nav-tabs mb-4 justify-content-evenly">
                <li className="nav-item">
                    <button className={`nav-link ${ isMobile && 'px-2'} ${activeTab === "profile" ? "active" : ""}`}
                            onClick={() => setActiveTab("profile")}>
                        { isMobile ? 'Профиль' : 'Информация профиля'}
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${ isMobile && 'px-2'} ${activeTab === "orders" ? "active" : ""}`}
                            onClick={() => setActiveTab("orders")}>Мои заказы
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${ isMobile && 'px-2'} ${activeTab === "password" ? "active" : ""}`}
                            onClick={() => setActiveTab("password")}> Смена пароля
                    </button>
                </li>
            </ul>

            {activeTab === "profile" && (
                <div className="card shadow p-4">
                    {message && <div className="alert alert-info">{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control" value={formData.email} disabled/>
                        </div>
                        <div className="mb-3">
                            <label>Телефон</label>
                            <input type="text" className="form-control" name="phone" value={formData.phone || ""}
                                   onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label>Адрес</label>
                            <input type="text" className="form-control" name="address" value={formData.address || ""}
                                   onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label>Имя</label>
                            <input type="text" className="form-control" name="first_name"
                                   value={formData.first_name || ""} onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label>Фамилия</label>
                            <input type="text" className="form-control" name="last_name"
                                   value={formData.last_name || ""} onChange={handleChange}/>
                        </div>
                        <div className="form-check mb-3">
                            <input type="checkbox" className="form-check-input" name="subscribed_to_newsletter"
                                   checked={formData.subscribed_to_newsletter || false} onChange={handleChange}/>
                            <label className="form-check-label">Подписка на новости</label>
                        </div>
                        <button type="submit" className="btn btn-dark">Сохранить изменения</button>
                    </form>
                </div>
            )}

            {activeTab === "orders" && <OrdersTab/>}


            {activeTab === "password" && (
                <div className="card shadow p-4">
                    {passwordMessage && <div className="alert alert-info">{passwordMessage}</div>}
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="mb-3"><label>Старый пароль</label><input type="password"
                                                                                 className="form-control"
                                                                                 name="old_password"
                                                                                 value={passwordData.old_password}
                                                                                 onChange={handlePasswordChange}
                                                                                 required/></div>
                        <div className="mb-3"><label>Новый пароль</label><input type="password" className="form-control"
                                                                                name="new_password"
                                                                                value={passwordData.new_password}
                                                                                onChange={handlePasswordChange}
                                                                                required/></div>
                        <div className="mb-3"><label>Подтвердите новый пароль</label><input type="password"
                                                                                            className="form-control"
                                                                                            name="confirm_password"
                                                                                            value={passwordData.confirm_password}
                                                                                            onChange={handlePasswordChange}
                                                                                            required/></div>
                        <button type="submit" className="btn btn-dark">Сменить пароль</button>
                    </form>
                </div>
            )}
        </div>
    );
}
