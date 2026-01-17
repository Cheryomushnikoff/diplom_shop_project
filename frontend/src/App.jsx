import Products from './Products.jsx';

export default function App(){
    const root = document.getElementById("react-root");
    const page = root?.dataset.page;

    if (page === 'products') {
        return <Products/>;
    }

    return null;
}

