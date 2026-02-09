import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [register, setRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formatErrors = (obj) => {
        if (typeof obj === "string") return obj;

        return Object.values(obj)
            .flat()
            .join("\n");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            setError("Пароли не совпадают");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            await axios.post("/api/accounts/register/", {
                email,
                password,
            });

            setRegister(true);
        } catch (err) {
            if (err.response?.data) {
                setError(formatErrors(err.response.data));
            } else {
                setError("Ошибка регистрации");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (register) {
        return (
            <div className="container py-5 text-center">
                <h3>Спасибо за регистрацию 🎉</h3>
                <p className="text-muted mt-2">
                    Ссылка на подтверждение email отправлена на <b>{email}</b>
                </p>
            </div>
        );
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "#f5f5f5", height: "600px" }}
        >
            <div
                className="card shadow p-4"
                style={{ width: "400px", borderRadius: "10px" }}
            >
                <h4 className="text-center mb-4 text-secondary">
                    Регистрация
                </h4>

                {error && (
                    <div className="alert alert-danger" style={{ whiteSpace: "pre-line" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Подтверждение пароля
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-secondary w-100 mt-3"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Регистрация…
                            </>
                        ) : (
                            "Зарегистрироваться"
                        )}
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
