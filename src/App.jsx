import videoBackground from './assets/videos/background.mp4'
import './App.css'
import { Header } from './components/Header/Header.jsx'
import { Overlay } from './components/Content/Overlay.jsx'
import { AboutUs } from './components/Content/AboutUs.jsx'
import { Footer } from './components/Footer/Footer.jsx'

export function App() {
  return (
    <>
      <video autoPlay muted playsInline loop id="videoBackground" aria-hidden="true" role="presentation">
            <source src= {videoBackground} type="video/mp4" />
        </video>
        <div className='content'>
          < Header />
          <main>
            < Overlay />
            <section className="scroll-content">
              < AboutUs />
            </section>
            </main>
            < Footer />
        </div>
    </>
  )
}

