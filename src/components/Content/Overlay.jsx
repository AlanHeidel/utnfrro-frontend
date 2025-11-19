import { Link } from "react-router-dom";
import './Overlay.css'

export function Overlay () {
    return (
    <>
        <div className="overlay">
              <img src="public/images/image-overlay.webp" alt="Logo del restaurante" />
              <Link to="/menu" className="order-button montserrat">ORDENÁ</Link>
            </div>
    </>
    )
}
