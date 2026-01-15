import { useEffect, useState } from "react";

export default function Products() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("/api/products")
            .then(r => r.json())
            .then(data => {
                console.log(data);
                setItems(data)
            });
    }, [])

    return (
        <div>
            <h2 className="h2">Товары</h2>
            {items.map(p => (
               <div className="container-item" key={p.id}>
                    <img className="img" src={p.image} alt={p.slug}/>
                    <p><a href={p.slug}>{p.name}</a></p>
                    <p>{p.price}</p>
                </div>
            ))}

        </div>
    )
}