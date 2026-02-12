import {useState} from "react";
import ApiClient from "./helpers/apiClient.js";

export default function ReviewForm({slug, onSuccess, logoutUser}) {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await ApiClient
                .post(
                    `/products/${slug}/reviews/`,
                    {rating, text}
                );

            setRating(5);
            setText("");
            onSuccess();
        } catch (e) {
            console.error("Ошибка добавления отзыва", e);
            logoutUser();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submitHandler}>
            <div className="mb-2">
                <label className="form-label">Оценка</label>
                <select
                    className="form-select"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                >
                    {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-2">
                <label className="form-label">Комментарий</label>
                <textarea
                    className="form-control"
                    rows="3"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                className="btn btn-secondary"
                disabled={loading}
            >
                Отправить
            </button>
        </form>
    );
}

