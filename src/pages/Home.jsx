import videoBackground from '../assets/videos/background.mp4'
import { Overlay } from '../components/Content/Overlay.jsx'
import { AboutUs } from '../components/Content/AboutUs.jsx'
import { Recomendados } from '../components/Content/Recomendados.jsx';

export function Home() {
  return (
    <>
      <video autoPlay muted playsInline loop id="videoBackground" aria-hidden="true" role="presentation">
        <source src={videoBackground} type="video/mp4" />
      </video>
      <main className="main-content">
        < Overlay />
        <section className="scroll-content">
          < AboutUs />
          < Recomendados />
        </section>
      </main>
    </>);

}