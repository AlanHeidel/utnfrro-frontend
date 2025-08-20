import { useState, useEffect } from "react";
import { NavBarList } from "./NavBarList/NavBarList.jsx";
import "./Header.css";
import { BurgerButton } from "./NavBarList/BurgerButton.jsx";
import { Link } from "react-router-dom";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function handleScroll() {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const isMobile = window.innerWidth < 850;

    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Por si cambia el tamano de pantalla con el menú abierto
    const handleResize = () => {
      if (window.innerWidth >= 850) {
        document.body.style.overflow = "";
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);
  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className={`navbar-list-mobile ${isOpen ? "open" : ""}`}>
          <NavBarList />
        </div>
        <nav className="navbar">
          <Link to="/" className={`logo ${scrolled ? "scrolled" : ""}`}>
            <img src="/images/home-icon.png" alt="Logo del restaurante" />
          </Link>
          <div className="nav-menu">
            <BurgerButton
              className={`burger-button ${scrolled ? "scrolled" : ""}`}
              isOpen={isOpen}
              toggle={() => setIsOpen(!isOpen)}
            />
          </div>
          <div className={`navbar-list ${scrolled ? "scrolled" : ""}`}>
            <NavBarList />
          </div>
        </nav>
      </header>
    </>
  );
}
