import videoBackground from '../assets/videos/background.mp4'
import { Header } from '../components/Header/Header.jsx'
import { Footer } from '../components/Footer/Footer.jsx'

export function About () {
    return (
    <>
        <video autoPlay muted playsInline loop id="videoBackground" aria-hidden="true" role="presentation">
                    <source src= {videoBackground} type="video/mp4" />
                </video>
                <div className='content'>
                  < Header /> 
                < Footer />
                </div>
    </>
    )
}