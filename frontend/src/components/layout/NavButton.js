import { Link } from 'react-router-dom';
import '../../styles/components/layout/NavButton.css';

const NavButton = ({ text, path, className }) => {
    const handleButtonClick = () => {
        window.scrollTo(0, 0);
    }

    return (
        <Link to={path} style={{ textDecoration: 'none' }}>
            <div className='nav-btn-container'>
                <button className={`nav-btn ${className}`} onClick={handleButtonClick}>{text}</button>
            </div>
        </Link>
    );
};

export default NavButton;
