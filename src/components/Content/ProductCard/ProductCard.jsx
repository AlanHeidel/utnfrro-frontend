import './ProductCard.css'

export function ProductCard({ product }) {
    return (
        <>
            <div className="product-card">
                <div className='product-card-content'>
                    <img src="./public/images/asado.webp" alt="asado image" />
                    <div className='product-card-description'>
                        <h3 className="product-card-title">Nombre del plato</h3>
                        <h3 className="product-card-price">$1000,00</h3>
                    </div>
                    <div className="product-card-hover-description">
                        <p className="product-card-description">Descripción del plato. Ingredientes. Y otros datos mas.</p>
                        <button className='button-card'>Ver mas</button>
                    </div>
                </div>
            </div>
        </>

    );
}