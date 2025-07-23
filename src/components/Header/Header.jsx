import { useState, useEffect} from 'react';
import { NavBarList } from './NavBarList/NavBarList.jsx';
import './Header.css'
import BurgerButton from './NavBarList/BurgerButton.jsx'

export function Header () {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        function handleScroll () {
            const isScrolled = window.scrollY > 10;
            setScrolled (isScrolled);
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },[]);
    return (
    <>
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <nav className="navbar">
                <a href="index.html" className={`logo ${scrolled ? 'scrolled' : ''}`}>
                    <img src="/images/home-icon.png" alt="Logo del restaurante" />
                </a>
                <div className="nav-menu">
                    < BurgerButton className={`burger-button ${scrolled ? 'scrolled' : ''}`} isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}/>
                </div>
                <div className={`navbar-list ${scrolled ? 'scrolled' : ''}`}>
                    < NavBarList />
                </div>
                <div className={`navbar-list-mobile ${isOpen ? 'open' : ''}`}>
                    < NavBarList />
                </div>
            </nav>
        </header>
    </>
    )
}