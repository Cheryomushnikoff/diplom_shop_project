import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

export default function CategoryDropdown({ anchorRef, onClose }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(true); // открыто по умолчанию
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [visible, setVisible] = useState(false); // для анимации

  // --- Получение категорий ---
  useEffect(() => {
    fetch("/api/category/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  // --- Вычисление позиции ---
  const updatePosition = useCallback(() => {
    if (!anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 8,
      left: rect.left,
    });
  }, [anchorRef]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  // --- Плавное появление ---
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // --- Закрытие по клику вне ---
  const handleClickOutside = useCallback(
    (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        setVisible(false); // плавно скрываем
        setTimeout(onClose, 200); // таймаут под анимацию
      }
    },
    [onClose, anchorRef]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  if (!open) return null;

  return createPortal(
    <ul
      ref={dropdownRef}
      className={`dropdown-menu shadow category-dropdown ${visible ? "show" : ""}`}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 2147483647,
        display: "block",
        minWidth: "150px",
      }}
    >
      {categories.length === 0 && (
        <li>
          <span className="dropdown-item text-muted">Нет категорий</span>
        </li>
      )}
      {categories.map((cat) => (
        <li key={cat.id}>
          <a className="dropdown-item d-flex justify-content-between align-items-center" href="#">
            <span>{cat.name}</span>
            {cat.image && (
              <img
                src={cat.image}
                alt={cat.name}
                style={{ width: 30, marginLeft: 8 }}
              />
            )}
          </a>
        </li>
      ))}
    </ul>,
    document.body
  );
}
