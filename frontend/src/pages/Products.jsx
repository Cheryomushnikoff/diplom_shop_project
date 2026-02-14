import {useEffect, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {useMainContext} from "./MainContext.jsx";

export default function Products() {
    const [products, setProducts] = useState([]);
    const {addToCart, cartItems, setQty} = useMainContext();
    const [searchParams] = useSearchParams();
    const categories = {
        seriozhki: 'Серёжки',
        braslet: 'Браслет',
        ozherele: 'Ожерелье',
        portupeia: 'Портупея',
        kuolony: 'Кулоны',
        koltsa: 'Кольца'


    }

    const query = searchParams.get("q") || "";
    const selectedCategories = searchParams.getAll("category"); // массив строк

    useEffect(() => {
        let url = "";

        // ✅ если нет ни запроса, ни категорий — грузим все товары
        if (!query && selectedCategories.length === 0) {
            url = "/api/products/";
        } else {
            url = `/api/products/search?q=${encodeURIComponent(query)}`;
            selectedCategories.forEach((cat) => {
                url += `&category=${encodeURIComponent(cat)}`;
            });
        }

        fetch(url)
            .then((res) => res.json())
            .then(setProducts)
            .catch(console.error);
    }, [query, selectedCategories.join("|")]);

    const findItem = (product) =>
        cartItems.find((item) => item.id === product.id);

    return (
        <div className="products-container pb-2 mt-4">
            <h2 className="text-center mb-4">
                {query ? `Результаты по: "${query}"` : "Товары"}
            </h2>

            {selectedCategories.length > 0 && (
                <div className="mb-3 text-center">
                    {selectedCategories.map((cat) => (
                        <span key={cat} className="badge bg-secondary me-2">
              {categories[cat]}
            </span>
                    ))}
                </div>
            )}

            <div className="products">
                {products.length !== 0 ? (
                    products.map((p) => {
                        const cartItem = findItem(p);

                        return (
                            <div
                                className="container-item shadow-sm position-relative p-3"
                                key={p.id}
                            >
                                {p.is_popular && (
                                    <span className="position-absolute top-0 start-0 badge bg-warning text-dark">
                    Популярное
                  </span>
                                )}

                                <Link to={`/products/${p.slug}`}>
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="img-fluid rounded mb-2"
                                    />
                                </Link>

                                <Link
                                    to={`/products/${p.slug}`}
                                    className="text-dark text-decoration-none mb-1"
                                >
                                    <strong>{p.name}</strong>
                                </Link>

                                <div className="small mb-2">
                  <span className="text-warning me-1">
                    {"★".repeat(Math.round(p.average_rating || 0))}
                      {"☆".repeat(5 - Math.round(p.average_rating || 0))}
                  </span>
                                    <span className="text-muted">
                    ({(p.average_rating || 0).toFixed(1)},{" "}
                                        {p.reviews_count || 0})
                  </span>
                                </div>

                                <div className="fw-bold fs-5 mb-2">{p.price} ₽</div>

                                {!cartItem ? (
                                    <button
                                        className="btn btn-outline-dark w-100"
                                        onClick={() => addToCart(p)}
                                    >
                                        Добавить в корзину
                                    </button>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => setQty(p.id, cartItem.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <span className="fw-bold">{cartItem.quantity}</span>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => setQty(p.id, cartItem.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <h3 className="text-center text-muted">Таких товаров нет</h3>
                )}
            </div>
        </div>
    );
}
