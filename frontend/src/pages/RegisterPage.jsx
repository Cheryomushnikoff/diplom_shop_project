import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка совпадения паролей на клиенте
        if (password !== passwordConfirm) {
            setError("Пароли не совпадают");
            return;
        }

        try {
            // Отправка данных на бэкенд
            await axios.post("/api/accounts/register/", {
                email,
                password,
            });

            // Редирект на страницу логина после успешной регистрации
            navigate("/login");
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError("Ошибка регистрации");
            }
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{backgroundColor: "#f5f5f5",height: "600px"}}
        >
            <div
                className="card shadow p-4"
                style={{width: "400px", borderRadius: "10px"}}
            >
                <h4 className="text-center mb-4 text-secondary">Регистрация</h4>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Пароль</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Подтверждение пароля</label>
                        <input
                            type="password"
                            className="form-control"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-secondary w-100 mt-3">
                        Зарегистрироваться
                    </button>
                </form>

                <div className="text-center mt-3">
                    <small>
                        Уже есть аккаунт? <a href="/login">Войти</a>
                    </small>
                </div>
            </div>
        </div>
    );
}
