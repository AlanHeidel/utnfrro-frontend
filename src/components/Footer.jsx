import './Footer.css'

export function Footer () {
    return (
        <>
            <footer className="footer">
                <section className="footer-aboutus">
                    <h3>Sobre Nosotros</h3>
                    <a href="#">Restaurantes</a>
                    <a href="#">Quienes somos</a>
                    <a href="#">Trabaja con nosotros</a>
                </section>
                <section className="footer-help">
                    <h3 >Ayuda</h3>
                    <a href="#">Preguntas frecuentes</a>
                    <a href="#">Ayuda con un pago</a>
                    <a href="#">Términos y condiciones</a>
                </section>
                <section className="footer-contact">
                    <h3>Contacto</h3>
                    <p>Encontranos en nuestras redes sociales</p>
                    <div className="footer-social">
                        <a href="https://facebook.com/" target="_blank" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://instagram.com/" target="_blank" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://twitter.com/" target="_blank" aria-label="Twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://wa.me/123456789" target="_blank" aria-label="WhatsApp">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </section>          
            </footer>
        </>
    )
}