import './BurgerButton.css'
import { useNavigate } from 'react-router-dom';

function BurgerButton({ isOpen, toggle, className = '' }) {
    const navigate = useNavigate();

    const handleClick = () => {
        toggle();            
        navigate('/');       
    };

    return (
        <button 
            className={`${className} ${isOpen ? 'open' : ''}`}
            onClick={handleClick}
        >
            <span className="top"></span>
            <span className="middle"></span>
            <span className="bottom"></span>
        </button>
    );
}

export default BurgerButton;
