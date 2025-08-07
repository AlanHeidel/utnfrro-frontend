import './GridRecomendados.css';

export function GridRecomendados({ product }) {
    return (
        <>
            <div className="gallery-grid">
                <div className="gallery-item item-1">
                    <img src="./public/images/asado.webp" alt="Asado 1" />
                </div>
                <div className="gallery-item item-2">
                    <img src="./public/images/asado.webp" alt="Asado 2" />
                </div>
                <div className="gallery-item item-3">
                    <img src="./public/images/asado.webp" alt="Asado 3" />
                </div>
                <div className="gallery-item item-4">
                    <img src="./public/images/asado.webp" alt="Asado 4" />
                </div>
                <div className="gallery-item item-5">
                    <img src="./public/images/asado.webp" alt="Asado 5" />
                </div>
                <div className="gallery-item item-6">
                    <img src="./public/images/asado.webp" alt="Asado 6" />
                </div>
            </div>
        </>
    )
}