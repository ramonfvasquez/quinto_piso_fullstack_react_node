import '../styles/components/pages/HomePage.css';

function HomePage() {
    return (
        <div className='homepage-container'>
            <img src={require('../images/pages/main.jpg').default} alt='' className="homepage-img" />
            <div className='section-body homepage-body'>
                <h1>Este es un posteo en la HomePage</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut accumsan massa, vel finibus lacus. Donec porta arcu eget arcu accumsan ultricies. Maecenas vitae sodales turpis. Praesent a elit mi. Nunc sapien nisl, fermentum a maximus sed, malesuada a nibh. Proin ut sem vel dui blandit faucibus. Ut scelerisque mattis vulputate. Suspendisse eget vehicula magna, ut bibendum lectus.
                    <br />
                    <br />
                    Aenean eu nisi nunc. Praesent efficitur, tortor ac venenatis mattis, nisi tellus hendrerit mi, et tristique ipsum sapien at leo. Nullam facilisis lorem ut est ultrices, vitae ultricies nisi condimentum. Vestibulum neque enim, suscipit vitae vestibulum ut, pretium et magna. Nulla eros urna, tincidunt eu vehicula ac, volutpat in augue. Curabitur sollicitudin ut velit ac finibus. Quisque imperdiet justo ac fringilla iaculis. Vivamus sodales venenatis laoreet. Pellentesque convallis rhoncus ipsum, in vulputate nulla iaculis in. Vestibulum gravida mi eget orci volutpat pulvinar. Curabitur cursus, ligula a fringilla molestie, nisl nisi tempor velit, sed rutrum odio metus eu nibh. Duis turpis erat, rhoncus in imperdiet a, semper sit amet nunc. Maecenas eget nulla nisi.
                    <br />
                    <br />
                    Sed semper, ligula at pulvinar tempus, nisl nisl sodales elit, at scelerisque nulla velit id lectus. Phasellus vehicula eu libero eu tempor. Curabitur feugiat neque sit amet mauris finibus consectetur. Aliquam efficitur, lectus sed suscipit fermentum, mi metus tincidunt leo, a sagittis arcu ligula et ex. Etiam turpis augue, maximus sit amet bibendum ac, dapibus dapibus dolor. Quisque posuere consectetur nisl vel vulputate. Nullam a suscipit ipsum, at eleifend leo. In vehicula ipsum nec leo vestibulum vulputate. Nulla commodo aliquet lacus condimentum congue.
                    <br />
                    <br />
                    Praesent id vehicula massa. Etiam quis eleifend eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed sed tellus egestas, mattis neque vitae, euismod dolor. Proin vestibulum gravida ligula, eu posuere justo cursus eu. Suspendisse potenti. Nam a congue justo. Aliquam rutrum tempor eros. Nullam pretium tincidunt tellus eget dictum. Phasellus sed porttitor mi. Fusce dignissim porta lobortis. Nullam faucibus sed nisl in gravida. Fusce accumsan erat lacus, ac rhoncus purus semper vulputate. Sed ullamcorper vehicula tortor. Vivamus faucibus risus nec neque fermentum luctus. Pellentesque eu ligula tellus.
                    <br />
                    <br />
                    Donec viverra, risus vitae ornare bibendum, justo lectus tincidunt nunc, et convallis nibh purus id lectus. Quisque consectetur venenatis ligula vel dapibus. Quisque mi orci, pellentesque sit amet sodales vel, aliquet in nunc. Cras cursus, nulla eu maximus tristique, ex mi dapibus est, ac volutpat metus mi sed turpis. Aenean felis mi, pharetra quis mauris faucibus, dictum facilisis elit. Ut tempor nec metus et scelerisque. Aenean rhoncus scelerisque ipsum eu elementum.
                </p>
            </div>
        </div>
    );
};

export default HomePage;
