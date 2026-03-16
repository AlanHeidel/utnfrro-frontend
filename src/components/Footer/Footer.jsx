import "./Footer.css";

const mapQuery = "Rosario Centro, Santa Fe";

export function Footer() {
  const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY?.trim();
  const mapsSrc = mapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${encodeURIComponent(mapQuery)}`
    : `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <section className="site-footer__brand-block">
          <div className="site-footer__brand">
            <img src="/images/home-icon.png" alt="PPA logo" />
            <h3>Pasión Por el Asado</h3>
          </div>
          <p className="site-footer__description">
            Cocina de fuego y tradición argentina. Un espacio pensado para
            compartir mesa, vinos y buena parrilla.
          </p>
          <div className="site-footer__social" aria-label="Redes sociales">
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter" />
            </a>
            <a
              href="https://wa.me/123456789"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <i className="fab fa-whatsapp" />
            </a>
          </div>
        </section>

        <section className="site-footer__links-block">
          <div>
            <h4>Nosotros</h4>
            <a href="#">Nuestra historia</a>
            <a href="#">Equipo</a>
            <a href="#">Trabajá con nosotros</a>
          </div>
          <div>
            <h4>Ayuda</h4>
            <a href="#">Preguntas frecuentes</a>
            <a href="#">Medios de pago</a>
            <a href="#">Términos y condiciones</a>
          </div>
        </section>
        <section
          className="site-footer__map-block"
          aria-label="Mapa de Rosario Centro"
        >
          <div className="site-footer__map-frame">
            <iframe
              title="Mapa de Rosario Centro, Santa Fe"
              src={mapsSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      </div>

      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Pasión Por el Asado.</span>
      </div>
    </footer>
  );
}
