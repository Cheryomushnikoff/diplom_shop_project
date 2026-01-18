import {useEffect, useState} from "react";
import {useCart} from "./CartContext.jsx";

export default function Products() {
    const [products, setProducts] = useState([]);
    const {addToCart} = useCart()


    useEffect(() => {
        const input = document.getElementById("searchInput");
        if (!input) return;

        const handler = (e) => {
            const q = e.target?.value || e.value;

            if (!q) {
                fetch("/api/products")
                    .then(res => res.json())
                    .then(data => {
                        setProducts(data)
                    });
                return;
            }

            fetch(`/api/products/search/?q=${encodeURIComponent(q)}`)
                .then(r => r.json())
                .then(data => {
                    setProducts(data); // тут можешь рендерить подсказки
                });
        };
        handler(input)

        input.addEventListener("input", handler);
        return () => input.removeEventListener("input", handler);
    }, []);

    return (
        <div>
            <h2 className={'text-center mb-5'}>Товары</h2>
            <div className="products">
                {products.map(p => (
                    <div key={p.id} className="container-item">
                        <img src={p.image} alt={p.slug}/>
                        <p><a href={p.slug}>{p.name}</a></p>
                        <p>{p.price}</p>
                        <button className={'btn btn-outline-dark'} onClick={() => addToCart(p)}>Добавить в корзину</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
