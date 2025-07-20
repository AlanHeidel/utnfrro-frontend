import videoBackground from './assets/videos/background.mp4'
import './App.css'

export function App() {
  return (
    <>
      <video autoPlay muted playsInline loop id="videoBackground" aria-hidden="true" role="presentation">
            <source src= {videoBackground} type="video/mp4" />
        </video>
        <div className='content'>
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
          <main>
            <div className="overlay">
              <img src="public/images/image-overlay.webp" alt="Logo del restaurante" />
              <button className="order-button montserrat">ORDENÁ</button>
            </div>
            <section className="scroll-content">
              <section id="aboutus" className="aboutus">
                <div className="aboutus-section-1" aria-hidden="true" role="presentation">
                  <h2 className="aboutus-title" aria-labelledby="aboutus-title">
                    EL ARTE DE LA AUTÉNTICA PARRILLA ARGENTINA
                  </h2>
                  <h3 className="aboutus-description" aria-labelledby="aboutus-description">
                    Cada corte lleva consigo la esencia del campo, el crujir del fuego y la dedicación de manos expertas.
                  </h3>
                </div>
                <div className="aboutus-section-2" aria-hidden="true" role="presentation">
                  <div className="aboutus-section-2-content">
                    <h2 className="aboutus-meat" aria-labelledby="aboutus-meat">
                      LA CARNE
                    </h2>
                    <h3 className="aboutus-meat-description" aria-labelledby="aboutus-meat-description">
                      Nuestra carne se selecciona cuidadosamente, eligiendo cortes de calidad que destacan por su sabor y terneza. Es el proceso que nos permite lograr ese color dorado y ese aroma inconfundible que despierta todos los sentidos.<br /><br />
                      Cada pieza se cocina al fuego con dedicación, respetando el producto y realzando su esencia. El resultado deja una huella: la de una experiencia hecha con pasión y respeto por la carne.
                    </h3>
                  </div>
                  <div className="aboutus-section-2-image" aria-hidden="true" role="presentation">
                    <div className="aboutus-section-2-image-slider" aria-hidden="true" role="presentation">
                      <img src="public/images/parrilla-image-4.webp" alt="corte de carne" />
                      <img src="public/images/parrilla-image.webp" alt="corte de carne" />
                      <img src="public/images/parrilla-image-4.webp" alt="corte de carne" />
                    </div>
                  </div>
                        
                </div>
                <div className="aboutus-section-3" aria-hidden="true" role="presentation">
                  <div className="aboutus-section-3-image">
                    <div className="aboutus-section-3-image-slider">
                      <img src="public/images/vinos-image.webp" alt="botellas de vino" />
                      <img src="public/images/vinos-image-2.webp" alt="copa de vino" />
                      <img src="public/images/vinos-image.webp" alt="botellas de vino" />
                    </div>
                  </div>
                  <div className="aboutus-section-3-content">
                    <h2 className="aboutus-wines" aria-labelledby="aboutus-vinos">
                      LOS VINOS
                    </h2>
                    <h3 className="aboutus-wines-description" aria-labelledby="aboutus-wines-description">
                      Los vinos también son parte esencial de nuestra propuesta. Cada etiqueta fue cuidadosamente seleccionada para acompañar nuestros platos y realzar la experiencia en cada copa. Desde pequeños productores hasta bodegas reconocidas.<br /><br />
                      Cada vino cuenta una historia, y en cada servicio buscamos que esa historia se comparta, se sienta y se disfrute. Porque un buen vino no solo acompaña, transforma la mesa en un momento inolvidable.
                    </h3>
                </div>
                    </div>
                    <div className="aboutus-section-4" aria-hidden="true" role="presentation">
                        <div className="aboutus-section-4-image">
                            <img src="public/images/cheffs-image.webp" alt="cheffs team" />
                        </div>                        
                        <div className="aboutus-group">
                            <h3 className="aboutus-group-description">
                                Profesionales comprometidos con la excelencia en cada preparación.
                            </h3>
                            <button className="aboutus-button">
                                CONOCER MÁS
                            </button>
                        </div>
                    </div>
                </section>
            </section>
            </main>
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
        </div>
       
    </>
  )
}

