import './AboutUs.css'

export function AboutUs() {
  return (
    <>
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
              Son una parte esencial de nuestra propuesta. Cada etiqueta fue cuidadosamente seleccionada para acompañar nuestros platos y realzar la experiencia en cada copa. Desde pequeños productores hasta bodegas reconocidas.<br /><br />
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
    </>
  )
}