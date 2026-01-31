import { useState } from "react";
import axios from "axios";

export default function ReviewForm({ slug, token, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `/api/products/${slug}/reviews/`,
        { rating, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRating(5);
      setText("");
      onSuccess(); // 🔥 обновляем отзывы
    } catch (e) {
      console.error("Ошибка добавления отзыва", e);
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

