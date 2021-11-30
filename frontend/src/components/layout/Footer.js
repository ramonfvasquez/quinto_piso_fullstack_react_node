import '../../styles/components/layout/Footer.css';

const Footer = () => {
    return (
        <div className='footer-container'>
            <a href='https://www.facebook.com/ciateatralquintopiso/'>
                <img src={require('../../images/icons/facebook.png').default} alt='' className='icon' />
            </a>
            <a href='https://www.instagram.com/ciateatralquintopiso/'>
                <img src={require('../../images/icons/instagram.png').default} alt='' className='icon' />
            </a>
            <a href='https://twitter.com/ciateatral5piso'>
                <img src={require('../../images/icons/twitter.png').default} alt='' className='icon' />
            </a>
            <p>Compañía Teatral Quinto Piso - 2021</p>
        </div>
    );
};

export default Footer;
