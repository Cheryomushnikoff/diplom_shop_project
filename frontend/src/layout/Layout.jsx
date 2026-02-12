import Header from "./Header";
import Footer from "./Footer";
import {MainProvider} from "../pages/MainContext.jsx";


export default function Layout({children}) {
    return (
        <MainProvider>
            <Header/>
            <main className="container-fluid">
                {children}
            </main>
            <Footer/>
        </MainProvider>
    );
}
