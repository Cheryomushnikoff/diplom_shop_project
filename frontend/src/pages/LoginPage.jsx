import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMainContext} from "./MainContext.jsx";
import {login} from "./helpers/api.js";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [load, setLoad] = useState(false);

    const {loginUser} = useMainContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await  async function ()  {
                setLoad(true);
                return login(email, password);
            }()
            loginUser(res.data); // сохраняем токены
            navigate("/products"); // перенаправляем на страницу с товарами
        } catch (err) {
            setError("Неверный логин или пароль");
            console.error(err);
        }finally {
            setLoad(false)
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center  bg-light" style={{height: "600px"}}>
            <div className="card shadow-sm border-0" style={{width: "380px"}}>
                <div className="card-body p-4">
                    <h4 className="text-center mb-4 text-secondary">
                        Вход в аккаунт
                    </h4>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted">
                                Логин / Email
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Введите логин"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-muted">
                                Пароль
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger py-2 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-secondary w-100 mt-3"
                        >
                            {load ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Входим…
                            </>
                        )  : "Войти"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

