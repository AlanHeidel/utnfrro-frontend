import videoBackground from '../assets/videos/background.mp4';
import { Header } from '../components/Header/Header.jsx';
import { Footer } from '../components/Footer/Footer.jsx';
import './Menu.css';

export function Menu() {
  return (
    <>
      <video autoPlay muted playsInline loop id="videoBackground" aria-hidden="true" role="presentation">
        <source src={videoBackground} type="video/mp4" />
      </video>

    
      <div
        className="menu-overlay"
        style={{ backgroundImage: "url('/images/Carta-menu.png')" }}
        aria-hidden="true"
        role="presentation"
      />

     
      <div className="content">
        <Header />
        <Footer />
      </div>
    </>
  );
}
