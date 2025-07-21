import videoBackground from './assets/videos/background.mp4'
import './App.css'
import { Header } from './components/Header.jsx'
import { Overlay } from './components/Overlay.jsx'
import { AboutUs } from './components/AboutUs.jsx'
import { Footer } from './components/Footer.jsx'

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

