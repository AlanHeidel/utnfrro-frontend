import './BurgerButton.css'

function BurgerButton({ isOpen, toggle, className= ''}) {    
    return (
        <button 
        className={`${className} ${isOpen ? 'open' : ''}`}
        onClick={toggle}
        >
            <span className="top"></span>
            <span className="middle"></span>
            <span className="bottom"></span>
        </button>
    );
}

export default BurgerButton;