import { useState, useEffect } from "react";
import axios from "axios";
import OrdersTab from "./orders/OrdersTab.jsx";
import ApiClient from "./helpers/apiClient.js";
import {useMainContext} from "./MainContext.jsx";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // profile / orders / password
  const [formData, setFormData] = useState({});
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [passwordData, setPasswordData] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const {logoutUser} = useMainContext()

  const token = JSON.parse(localStorage.getItem("authTokens"))?.access;

  // Получение профиля
  useEffect(() => {
      ApiClient
        .get("/accounts/profile/")
        .then(res => { setUser(res.data); setFormData(res.data); })
        .catch(err => {
            console.error(err);
            logoutUser();
      });
  }, []);

  // Получение истории заказов
  // useEffect(() => {
  //   if (activeTab === "orders") {
  //     ApiClient
  //           .get("/orders/history/")
  //           .then(res => setOrders(res.data))
  //           .catch(err => {
  //               console.error(err)
  //               logoutUser();
  //           });
  //   }
  // }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiClient
          .put("/accounts/profile/", formData);
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
      setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
    } catch {
        logoutUser();
      setPasswordMessage("Ошибка смены пароля");
    }
  };

  if (!user) return <div className="text-center mt-5">Загрузка...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">Профиль пользователя</h2>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab==="profile"?"active":""}`} onClick={()=>setActiveTab("profile")}>Редактировать профиль</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab==="orders"?"active":""}`} onClick={()=>setActiveTab("orders")}>История заказов</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab==="password"?"active":""}`} onClick={()=>setActiveTab("password")}>Сменить пароль</button>
        </li>
      </ul>

      {activeTab==="profile" && (
        <div className="card shadow p-4">
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" value={formData.email} disabled />
            </div>
            <div className="mb-3">
              <label>Телефон</label>
              <input type="text" className="form-control" name="phone" value={formData.phone||""} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Адрес</label>
              <input type="text" className="form-control" name="address" value={formData.address||""} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Имя</label>
              <input type="text" className="form-control" name="first_name" value={formData.first_name||""} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Фамилия</label>
              <input type="text" className="form-control" name="last_name" value={formData.last_name||""} onChange={handleChange} />
            </div>
            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" name="subscribed_to_newsletter" checked={formData.subscribed_to_newsletter||false} onChange={handleChange} />
              <label className="form-check-label">Подписка на новости</label>
            </div>
            <button type="submit" className="btn btn-dark">Сохранить изменения</button>
          </form>
        </div>
      )}

      {activeTab==="orders" && <OrdersTab/>}



      {activeTab==="password" && (
        <div className="card shadow p-4">
          {passwordMessage && <div className="alert alert-info">{passwordMessage}</div>}
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3"><label>Старый пароль</label><input type="password" className="form-control" name="old_password" value={passwordData.old_password} onChange={handlePasswordChange} required /></div>
            <div className="mb-3"><label>Новый пароль</label><input type="password" className="form-control" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} required /></div>
            <div className="mb-3"><label>Подтвердите новый пароль</label><input type="password" className="form-control" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} required /></div>
            <button type="submit" className="btn btn-dark">Сменить пароль</button>
          </form>
        </div>
      )}
    </div>
  );
}
