import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./layout/Layout";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import ProductPage from "./pages/ProductPage.jsx";


export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/products/:slug" element={<ProductPage/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/checkout" element={<CheckoutPage/>} />
                    <Route path="/" element={<Home/>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}