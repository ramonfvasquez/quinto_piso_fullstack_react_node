import '../../styles/components/layout/Nav.css';
import NavButton from './NavButton';

const Nav = () => {
    return (
        <div className='nav-container'>
            <NavButton text='Inicio' path='/' className='gold' />
            <NavButton text='Blog' path='/blog' className='orangered' />
            <NavButton text='Obras' path='/obras' className='purple' />
            <NavButton text='Nosotros' path='/nosotros' className='royalblue' />
            <NavButton text='Contacto' path='/contacto' className='green' />
        </div>
    );
};

export default Nav;
