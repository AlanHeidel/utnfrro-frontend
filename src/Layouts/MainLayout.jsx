import { Outlet } from "react-router-dom";
import { Header } from '../components/Header/Header.jsx'
import { Footer } from '../components/Footer/Footer.jsx'

export function MainLayout() {
    return (
        <div className='content'>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>

    )
}