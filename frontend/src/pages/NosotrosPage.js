import '../styles/components/pages/NosotrosPage.css';

function NosotrosPage() {
    const texto = `
        La compañía se gestó en el año 2004 con el objetivo de llevar a escena obras teatrales que ejerzan un fuerte análisis y/o crítica a las grandes estructuras sociales contemporáneas. De esta forma la selección de materiales implicó en todos los casos, un exhaustivo trabajo de investigación teórico y escénico.

        Uno de los pilares fundamentales fueron los textos elegidos y por consiguiente los autores: Roberto Arlt, Albert Camus, Peter Weiss, Jean Genet, Giuseppe Cafiero, Jean Paul Sarte, Sergio Vodanovic y Máximo Gorki. Esta diversidad nos abrió la posibilidad de que cada nuevo proyecto implicara la búsqueda de una nueva poética para llegar a la puesta en escena y esto influyó en el trabajo de los actores y en su entrenamiento.

        Con más de quince años de trabajo, hemos configurado una dirección clara en relación a los espectáculos que queremos llevar adelante y un compromiso sólido con el hecho artístico.
    `

    return (
        <div className='nosotrospage-container'>
            <div className='section-header nosotrospage-header'>
                <h1>Nosotros</h1>
            </div>
            <div className='section-body nosotrospage-body'>
                <div className='column left'>
                    <p className='nosotrospage-text'>{texto}</p>
                </div>
                <div className='column right'>
                    <div className='collage-container'>
                        <div className='row row1'>
                            <img src={require('../images/pages/nosotros-001.jpg').default} alt='' />
                            <img src={require('../images/pages/nosotros-002.jpg').default} alt='' />
                            <img src={require('../images/pages/nosotros-003.jpg').default} alt='' />
                        </div>
                        <div className='row row2'>
                            <img src={require('../images/pages/nosotros-004.jpg').default} alt='' />
                            <img src={require('../images/pages/nosotros-005.jpg').default} alt='' />
                            <img src={require('../images/pages/nosotros-006.jpg').default} alt='' />
                        </div>
                        <div className='row row3'>
                            <img src={require('../images/pages/nosotros-007.jpg').default} alt='' />
                            <img src={require('../images/pages/nosotros-008.jpg').default} alt='' />
                            <img src={require('../images/pages/nosotros-009.jpg').default} alt='' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NosotrosPage;
