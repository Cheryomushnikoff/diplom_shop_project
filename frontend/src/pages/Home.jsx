import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMainContext } from "./MainContext";

export default function Home() {
  const { cartItems, addToCart, setQty } = useMainContext();
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await axios.get("/api/products/top/");
        setTopProducts(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке топовых товаров:", err);
      }
    };
    fetchTopProducts();
  }, []);

  return (
    <div className="container py-4">

      {/* HERO */}
      <div className="p-5 mb-4 bg-light rounded-3 border">
        <div className="container-fluid py-3">
          <h1 className="display-6 fw-semibold text-dark">
            Добро пожаловать в наш магазин
          </h1>
          <p className="col-md-8 fs-6 text-secondary">
            Качественные товары, честные цены и быстрая доставка по всей стране.
          </p>
          <Link to="/products" className="btn btn-secondary btn-lg">
            Перейти в каталог
          </Link>
        </div>
      </div>

      {/* ТОПОВЫЕ ТОВАРЫ */}
      <h4 className="mb-3 text-dark">Топовые товары по отзывам</h4>
      <div className="row g-4 mb-5">
        {topProducts.length === 0 ? (
          <p className="text-muted">Топовые товары пока не доступны</p>
        ) : (
          topProducts.map((product) => {
            const cartItem = cartItems.find((p) => p.id === product.id);

            return (
              <div className="col-md-3" key={product.id}>
                <div className="card h-100 shadow-sm">
                  {/* Изображение */}
                  <Link to={`/products/${product.slug}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: 160, objectFit: "cover" }}
                    />
                  </Link>

                  <div className="card-body d-flex flex-column">
                    {/* Название товара */}
                    <Link
                      to={`/products/${product.slug}`}
                      className="text-dark text-decoration-none mb-1"
                    >
                      <h6 className="card-title">{product.name}</h6>
                    </Link>

                    {/* Рейтинг */}
                    <div className="text-warning mb-2 small">
                      {"★".repeat(Math.round(product.average_rating))}
                      {"☆".repeat(5 - Math.round(product.average_rating))}
                      <span className="text-dark ms-1">
                        ({product.average_rating.toFixed(1)})
                      </span>
                    </div>

                    {/* Кол-во отзывов */}
                    <div className="text-muted small mb-2">
                      {product.reviews_count} отзыв
                      {product.reviews_count === 1 ? "" : "ов"}
                    </div>

                    {/* Цена */}
                    <div className="fw-semibold mb-2">{product.price} ₽</div>

                    {/* ===== КОРЗИНА ===== */}
                    {!cartItem ? (
                      <button
                        className="btn btn-secondary mt-auto"
                        onClick={() => addToCart(product)}
                      >
                        Добавить в корзину
                      </button>
                    ) : (
                      <div className="d-flex align-items-center mt-auto gap-2">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setQty(product.id, cartItem.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="fw-bold">{cartItem.quantity}</span>
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
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* О МАГАЗИНЕ */}
      <div className="row">
        <div className="col-md-8">
          <h4 className="mb-3">О магазине</h4>
          <p className="text-muted">
            Мы — современный интернет-магазин, ориентированный на качество сервиса
            и удобство покупателя. Работаем напрямую с поставщиками и гарантируем
            подлинность товаров.
          </p>
        </div>
      </div>
    </div>
  );
}
