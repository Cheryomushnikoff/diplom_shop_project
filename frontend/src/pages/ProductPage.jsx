import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {useMainContext} from "./MainContext";
import ReviewForm from "./ReviewForm";

/*  Рейтинг звёздами */
function Stars({rating}) {
    return (
        <span className="text-warning">
      {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
    </span>
    );
}

export default function ProductPage() {
    const {slug} = useParams();
    const {
        cartItems,
        addToCart,
        setQty,
        authTokens,
        user,
    } = useMainContext();

    const token = authTokens?.access;

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    /*  товар в корзине */
    const cartItem = product
        ? cartItems.find((p) => p.id === product.id)
        : null;

    /* 🔄 загрузка товара + отзывов */
    const fetchProduct = async () => {
        try {
            setLoading(true);
            const tokens = JSON.parse(localStorage.getItem("authTokens"));

            const productRes = tokens ? await axios.get(
                `/api/products/${slug}/`,
                {
                    headers: {
                        Authorization: `Bearer ${tokens.access}`,
                    },
                }
            ) : await axios.get(
                `/api/products/${slug}/`);

            setProduct(productRes.data);

            const reviewsRes = await axios.get(
                `/api/products/${slug}/reviews/`
            );
            setReviews(reviewsRes.data || []);
        } catch (e) {
            console.error("Ошибка загрузки товара", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [slug]);

    if (loading) {
        return <div className="container mt-4">Загрузка…</div>;
    }

    if (!product) {
        return <div className="container mt-4">Товар не найден</div>;
    }

    /* ⭐ пользователь уже писал отзыв */
    const alreadyReviewed =
        product.user_retry_review
    const paidRewiew =
        product.user_paid_review


    return (
        <div className="container mt-4">
            <div className="row g-4">
                {/* 🖼️ картинка */}
                <div className="col-md-6">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="img-fluid rounded border"
                    />
                </div>

                {/* ℹ️ информация */}
                <div className="col-md-6">
                    <h2>{product.name}</h2>

                    {/* ⭐ рейтинг + кол-во */}
                    <div className="mb-2">
                        {product.reviews_count > 0 ? (
                            <>
                                <Stars rating={Math.round(product.average_rating)}/>
                                <span className="text-muted ms-2">
                  {product.average_rating.toFixed(1)} •{" "}
                                    {product.reviews_count} отзывов
                </span>
                            </>
                        ) : (
                            <span className="text-muted">Пока нет отзывов</span>
                        )}
                    </div>

                    <h4 className="text-secondary mb-3">
                        {product.price} ₽
                    </h4>

                    <p className="text-muted">{product.description}</p>


                    {!cartItem ? (
                        <button
                            className="btn btn-secondary mt-3"
                            onClick={() => addToCart(product)}
                        >
                            Добавить в корзину
                        </button>
                    ) : (
                        <div className="d-flex align-items-center mt-3 gap-2">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setQty(product.id, cartItem.quantity - 1)
                                }
                            >
                                −
                            </button>
                            <span className="fw-bold">
                {cartItem.quantity}
              </span>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setQty(product.id, cartItem.quantity + 1)
                                }
                            >
                                +
                            </button>
                        </div>
                    )}

                    {/*  ОТЗЫВЫ */}
                    <div className="mt-5">
                        <h5 className="mb-3">
                            Отзывы ({reviews.length})
                        </h5>

                        {reviews.length === 0 && (
                            <p className="text-muted">
                                Пока нет отзывов
                            </p>
                        )}

                        {reviews.map((r) => (
                            <div
                                key={r.id}
                                className="border rounded p-3 mb-3 bg-light"
                            >
                                <div className="d-flex justify-content-between">
                                    <strong>
                                        {r.user_name || r.user_email}
                                    </strong>
                                    <Stars rating={r.rating}/>
                                </div>

                                <div className="text-muted small mb-2">
                                    {new Date(r.created_at).toLocaleDateString()}
                                </div>

                                <div>{r.text}</div>
                            </div>
                        ))}

                        {/*  ФОРМА ОТЗЫВА */}
                        {token && !alreadyReviewed && paidRewiew && (
                            <div className="mt-4">
                                <h6>Оставить отзыв</h6>
                                <ReviewForm
                                    slug={slug}
                                    token={token}
                                    onSuccess={fetchProduct}
                                />
                            </div>
                        )}
                        
                        {!token && (
                            <div className="alert alert-secondary mt-3">
                               Отзыв могут оставить только <Link to='/register'>зарегистрированные</Link> пользователи
                            </div>
                        )}

                        {token && !paidRewiew && (
                            <div className="alert alert-secondary mt-3">
                               Отзыв можно оставить только для приобретенного товара
                            </div>
                        )}

                        {alreadyReviewed && (
                            <div className="alert alert-secondary mt-3">
                                Вы уже оставили отзыв на этот товар
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
