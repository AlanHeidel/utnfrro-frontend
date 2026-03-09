import { Link } from "react-router-dom";
import "./About.css";

const values = [
  {
    title: "Tradicion viva",
    description:
      "Respetamos las tecnicas clasicas de parrilla y las llevamos a una experiencia actual.",
  },
  {
    title: "Producto real",
    description:
      "Seleccionamos cortes, vinos y vegetales de origen controlado para cuidar cada detalle.",
  },
  {
    title: "Servicio humano",
    description:
      "Nuestro equipo prioriza cercania, tiempos claros y una atencion consistente en todo momento.",
  },
];

const milestones = [
  { year: "2016", text: "Abrimos nuestras puertas con una carta corta y foco en parrilla." },
  { year: "2019", text: "Ampliamos salon y terraza, sumando una cava de etiquetas locales." },
  { year: "2022", text: "Lanzamos menu digital y una operacion mas precisa por mesa." },
  { year: "2025", text: "Consolidamos un equipo estable y una propuesta integral de reservas." },
];

const teamSlides = [
  {
    name: "Sofia R.",
    role: "Jefa de cocina",
    image: "/images/cheffs-image.webp",
  },
  {
    name: "Martin L.",
    role: "Parrillero",
    image: "/images/parrilla-image.webp",
  },
  {
    name: "Valentina C.",
    role: "Sala y reservas",
    image: "/images/vinos-image.webp",
  },
  {
    name: "Nicolas A.",
    role: "Produccion",
    image: "/images/parrilla-image-4.webp",
  },
];

export function About() {
  return (
    <section className="about-page">
      <div className="about-hero">
        <div className="about-hero__content">
          <p className="about-eyebrow">SOBRE NOSOTROS</p>
          <h1>Una casa de parrilla, equipo y oficio.</h1>
          <p>
            Nacimos para hacer simple lo importante: buen producto, buena
            coccion y una experiencia calida. Todo lo que ves en mesa esta
            pensado para que vuelva a pasar.
          </p>
          <div className="about-hero__actions">
            <Link className="about-btn about-btn--primary" to="/reservas">
              Reservar mesa
            </Link>
            <Link className="about-btn about-btn--ghost" to="/menu">
              Ver menu
            </Link>
          </div>
        </div>
        <div className="about-hero__media">
          <img src="/images/card-image.png" alt="Interior del restaurante" />
        </div>
      </div>

      <div className="about-stats">
        <article>
          <strong>9+</strong>
          <span>Anos de recorrido</span>
        </article>
        <article>
          <strong>30+</strong>
          <span>Personas en el equipo</span>
        </article>
        <article>
          <strong>1200+</strong>
          <span>Servicios por mes</span>
        </article>
      </div>

      <div className="about-values">
        {values.map((value) => (
          <article key={value.title} className="about-value-card">
            <h3>{value.title}</h3>
            <p>{value.description}</p>
          </article>
        ))}
      </div>

      <div className="about-timeline">
        <h2>Como fuimos creciendo</h2>
        <div className="about-timeline__track">
          {milestones.map((item) => (
            <article key={item.year} className="about-timeline__item">
              <span>{item.year}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="about-team">
        <h2>Equipo</h2>
        <p>
          Profesionales de cocina y sala trabajando sincronizados para sostener
          calidad en cada servicio.
        </p>
        <div className="about-team__slider">
          <div className="about-team__track">
            {[...teamSlides, ...teamSlides].map((member, index) => (
              <article className="about-team-card" key={`${member.name}-${index}`}>
                <img src={member.image} alt={member.name} />
                <div>
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
