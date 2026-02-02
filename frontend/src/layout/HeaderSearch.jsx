import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../pages/MainContext.jsx";

export default function HeaderSearch() {
  const { selectedCategories } = useMainContext();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const lastUrlRef = useRef(""); // 🔒 защита от зацикливания
  const isMobile = window.innerWidth < 750;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();

      if (query.trim()) params.set("q", query.trim());

      selectedCategories.forEach((cat) =>
        params.append("category", cat[1])
      );

      const nextUrl = `/products?${params.toString()}`;

      if (nextUrl === lastUrlRef.current) return; // ⛔ стоп

      lastUrlRef.current = nextUrl;
      navigate(nextUrl, { replace: true });
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query, selectedCategories, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isMobile && !isOpen) {
      setIsOpen(true);
      return;
    }

    if (!query.trim() && selectedCategories.length === 0) {
      setIsError(true);
      return;
    }

    setIsError(false);
  };

  return (
    <form className="header-search" onSubmit={handleSubmit}>
      <div
        className={`search-container ${
          isOpen || !isMobile ? "visible" : ""
        }`}
      >
        <input
          type="search"
          className={`search-input ${isError ? "error" : ""}`}
          placeholder={
            isError
              ? "Введите запрос…"
              : "Поиск по товарам…"
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsError(false);
          }}
          autoFocus={isMobile && isOpen}
        />
      </div>

      <button
          type="button"
          aria-label="Поиск"
          className='search-button'
          onClick={()=>setIsOpen(prev=>!prev)}
      >
        <i className="bi bi-search"></i>
      </button>
    </form>
  );
}
