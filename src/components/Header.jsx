import './Header.css'

export function Header () {
    return (
    <>
        <header className="header">
            <nav className="navbar">
                <a href="index.html" className="logo">
                    <img src="public/images/home-icon.png" alt="Logo del restaurante" />
                </a>
                <div className="nav-menu">
                
                </div>
                <div className="navbar-list">
                    <a href="menu.html" className="montserrat">MENU</a>
                    <a href="#" className="montserrat">RECOMENDADOS</a>
                    <a href="#aboutus" className="montserrat">NOSOTROS</a>   
                    <a className="reserve-button montserrat" href="#">
                        RESERVÁ UNA MESA
                    </a>
                </div>
                <div className="navbar-list-mobile">
                    <a href="menu.html" className="montserrat">MENU</a>
                    <a href="#" className="montserrat">RECOMENDADOS</a>
                    <a href="#aboutus" className="montserrat">NOSOTROS</a>   
                    <a className="reserve-button-mobile montserrat" href="#">
                        RESERVÁ UNA MESA
                    </a>
                </div>
            </nav>
        </header>
    </>
    )
}