import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMainContext } from "./MainContext";

export default function Home() {
  const { cartItems, addToCart, setQty } = useMainContext();
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products/?popular=true");
      const products = res.data || [];

      // сортировка: сначала по рейтингу, потом по количеству отзывов
      products.sort((a, b) => {
        if (b.average_rating !== a.average_rating) {
          return b.average_rating - a.average_rating;
        }
        return b.reviews_count - a.reviews_count;
      });

      setTopProducts(products.slice(0, 8)); // выводим только топ-8
    } catch (err) {
      console.error("Ошибка загрузки топ-товаров:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const renderSkeletons = () =>
    Array.from({ length: 8 }).map((_, i) => (
      <div className="col-md-3" key={i}>
        <div className="card h-100 shadow-sm animate-pulse">
          <div
            className="bg-secondary bg-opacity-25"
            style={{ height: 160 }}
          ></div>
          <div className="card-body">
            <div className="bg-secondary bg-opacity-25 mb-2" style={{ height: 20, width: "80%" }}></div>
            <div className="bg-secondary bg-opacity-25 mb-2" style={{ height: 16, width: "60%" }}></div>
            <div className="bg-secondary bg-opacity-25" style={{ height: 24, width: "40%" }}></div>
          </div>
        </div>
      </div>
    ));

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

      {/* ПРЕИМУЩЕСТВА */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">🚚 Быстрая доставка</h5>
              <p className="card-text text-muted">
                Отправляем заказы в день оформления
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">💳 Удобная оплата</h5>
              <p className="card-text text-muted">
                Онлайн-оплата или оплата при получении
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">📞 Поддержка</h5>
              <p className="card-text text-muted">
                Всегда на связи и готовы помочь
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ТОП-ТОВАРЫ ПО ОТЗЫВАМ */}
      <h4 className="mb-3 text-dark">Топ-товары по отзывам</h4>
      <div className="row g-4 mb-5">
        {loading ? (
          renderSkeletons()
        ) : topProducts.length === 0 ? (
          <p className="text-muted">Товары отсутствуют</p>
        ) : (
          topProducts.map((product) => {
            const cartItem = cartItems.find((p) => p.id === product.id);
            return (
              <div className="col-md-3" key={product.id}>
                <div className="card h-100 shadow-sm">
                  <Link to={`/products/${product.slug}`}>
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: 160, objectFit: "cover" }}
                    />
                  </Link>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{product.name}</h6>
                    <p className="text-muted small mb-1">
                      {product.reviews_count > 0
                        ? `${product.average_rating.toFixed(1)} ★ (${product.reviews_count})`
                        : "Нет отзывов"}
                    </p>
                    <div className="fw-semibold mb-2">{product.price} ₽</div>

                    {!cartItem ? (
                      <button
                        className="btn btn-secondary mt-auto"
                        onClick={() => addToCart(product)}
                      >
                        Добавить в корзину
                      </button>
                    ) : (
                      <div className="d-flex align-items-center gap-2 mt-auto">
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
