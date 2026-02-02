import {useEffect, useState} from "react";

export default function Reviews({slug}) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`/api/products/${slug}/reviews/`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setReviews(data)
            });
    }, [slug]);

    if (!reviews.length) {
        return <p className="text-muted">Отзывов пока нет</p>;
    }

    return (
        <div className="mt-3">
            {reviews.map(r => (
                <div key={r.id} className="border rounded p-3 mb-2">
                    <strong>{r.user_name}</strong>
                    <span className="ms-2 text-warning">
            {"★".repeat(r.rating)}
          </span>
                    <p className="mb-0">{r.text}</p>
                </div>
            ))}
        </div>
    );
}
