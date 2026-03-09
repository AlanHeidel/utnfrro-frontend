import "./AboutUs.css";
import { Link } from "react-router-dom";

export function AboutUs() {
  return (
    <>
      <section id="aboutus" className="aboutus">
        <div
          className="aboutus-section-1-1"
          aria-hidden="true"
          role="presentation"
        >
          <h2 className="aboutus-title" aria-labelledby="aboutus-title">
            SOBRE NOSOTROS
          </h2>
        </div>
        <div
          className="aboutus-section-4"
          aria-hidden="true"
          role="presentation"
        >
          <div className="aboutus-section-4-image">
            <img src="/images/cheffs-image.webp" alt="cheffs team" />
          </div>
          <div className="aboutus-group">
            <h3 className="aboutus-group-description">
              Profesionales comprometidos con la excelencia en cada preparación.
            </h3>
            <Link to="/nosotros" className="aboutus-button">
              CONOCER MÁS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
