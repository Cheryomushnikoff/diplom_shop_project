import Products from "./Products.jsx";
import CartPage from "./CartPage.jsx";

export default function App() {
  const root = document.getElementById("react-root");
  const page = root?.dataset.page;

  if (page === "products") {
    return <Products />;
  }

  if (page === "cart") {
    return <CartPage />;
  }

  return null;
}

