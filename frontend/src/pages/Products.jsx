import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useMainContext} from "./MainContext.jsx";

export default function Products() {
    const [products, setProducts] = useState([]);
    const {addToCart, cartItems, setQty} = useMainContext()
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q");


    useEffect(() => {
        let url = "/api/products";

        if (query) {
            url = `/api/products/search/?q=${encodeURIComponent(query)}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setProducts(data)
            });
    }, [query]);

    const findItem = (fI) => cartItems.find(item => item.id === fI.id)

    return (
        <div>
            <h2 className="text-center mb-5">
                {query ? `Результаты по: "${query}"` : "Товары"}
            </h2>
            <div className="products">
                {products.map(p => (
                    <div key={p.id} className="container-item">
                        <img src={p.image} alt={p.slug}/>
                        <p><a href={p.slug}>{p.name}</a></p>
                        <p>{p.price}</p>
                        {findItem(p) ? (
                                <div className="btn-group btn-group-sm">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setQty(findItem(p).id, findItem(p).quantity - 1)}
                                    >
                                        −
                                    </button>
                                    <input
                                        className="btn btn-outline-dark w-25 text-center"
                                        type="number"
                                        value={findItem(p).quantity}
                                        min={0}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value, 10);
                                            if (!isNaN(value) && value >= 0) {
                                                setQty(findItem(p).id, value);
                                            }
                                        }}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setQty(findItem(p).id, findItem(p).quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>) :
                            <button className={'btn btn-outline-dark'} onClick={() => addToCart(p)}>Добавить в корзину
                            </button>
                        }

                    </div>
                ))}
            </div>
        </div>
    );
}
