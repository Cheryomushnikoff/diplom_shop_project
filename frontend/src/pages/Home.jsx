import { Link } from "react-router-dom";

export default function Home() {
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

      {/* ПОПУЛЯРНЫЕ ТОВАРЫ */}
      <h4 className="mb-3 text-dark">Популярные товары</h4>
      <div className="row g-4 mb-5">
        {[1, 2, 3, 4].map((i) => (
          <div className="col-md-3" key={i}>
            <div className="card h-100 shadow-sm">
              <div
                className="bg-secondary bg-opacity-25"
                style={{ height: 160 }}
              />
              <div className="card-body">
                <h6 className="card-title">Товар #{i}</h6>
                <p className="text-muted small">Краткое описание товара</p>
                <div className="fw-semibold">1 000 ₽</div>
              </div>
            </div>
          </div>
        ))}
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
