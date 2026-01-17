import {useEffect, useState} from "react";
import {useCart} from "./CartContext.jsx";

export default function Products() {
    const [products, setProducts] = useState([]);
    const {addToCart} = useCart()

    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data)
            });
    }, []);


    return (
        <div>
            <h2 className={'text-center mb-5'}>Товары</h2>
            <div className="products">
                {products.map(p => (
                    <div key={p.id} className="container-item">
                        <img src={p.image} alt={p.slug}/>
                        <p>{p.name}</p>
                        <p>{p.price}</p>
                        <button className={'btn btn-outline-dark'} onClick={() => addToCart(p)}>Добавить в корзину</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
