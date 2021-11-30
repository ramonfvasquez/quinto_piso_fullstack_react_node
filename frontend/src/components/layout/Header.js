import '../../styles/components/layout/Header.css';
import Nav from './Nav';

const Header = () => {
    return (
        <div className='header-container'>
            <img src='http://localhost:3000/images/icons/theater-masks.png' alt='' className='logo' />
            <h1>Compañía Teatral Quinto Piso</h1>
            <Nav />
        </div>
    );
};

export default Header;
