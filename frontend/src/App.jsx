import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./layout/Layout";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import Home from "./pages/Home.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";
import PaymentFailPage from "./pages/PaymentFailPage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import CancelledPage from "./pages/CancelledPage.jsx";
import DeliveryPage from "./pages/DeliveryPage.jsx";


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
                    <Route path="/email-verified" element={<VerifyPage/>} />
                    <Route path="/payment-success" element={<PaymentSuccessPage />} />
                    <Route path="/payment-fail" element={<PaymentFailPage />} />
                    <Route path="/cancelled" element={<CancelledPage/>} />
                    <Route path="/delivery" element={<DeliveryPage />} />
                    <Route path="/" element={<Home/>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}