import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HeaderSearch() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!query.trim()) {
            setIsError(true);
            return;
        }

        setIsError(false);
        navigate(`/products?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
    };

    const handleSearchClick = (e) => {
        e.preventDefault();

        if (window.innerWidth < 750) {
            if (!isOpen) {
                setIsOpen(true);
                return;
            }

            setIsOpen(false);
            return;
        }
        handleSubmit(e);
    };

    return (
        <form className="header-search" onSubmit={handleSubmit}>
            <div className={`search-container ${isOpen ? "visible" : ""}`}>
                <input
                    className={`search-input ${
                        isError ? "error" : ""
                    }`}
                    type="search"
                    placeholder={
                        isError
                            ? "Надо что-то написать..."
                            : "Что интересует?.."
                    }
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsError(false);
                    }}
                    autoFocus={isOpen && window.innerWidth < 750}
                />
            </div>

            <button
                className="search-button"
                type="button"
                onClick={handleSearchClick}
                aria-label="Поиск"
            >
                <i className="bi bi-search"></i>
            </button>
        </form>
    );
}
