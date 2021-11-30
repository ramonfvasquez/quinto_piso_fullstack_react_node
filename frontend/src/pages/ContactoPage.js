import '../styles/components/pages/ContactoPage.css';
import emailjs from 'emailjs-com';

const SERVICE_ID = 'ramvas1984';
const TEMPLATE_ID = 'template_oldzpue';
const USER_ID = 'user_Vi7ZU2F20neYEfYyuIuad';

function ContactoPage() {
  const handleOnSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target, USER_ID).then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
    e.target.reset();
  };

  return (
    <div className="contactopage-container">
      <div className="section-header contactopage-header">
        <h1>Contacto</h1>
        <p>Mandanos un mensaje. Tus comentarios nos ayudan a mejorar. :)</p>
      </div>
      <div className="section-body contactopage-body">
        <div className="column left">
          <a
            href="mailto:ciateatralquintopiso@yahoo.com.ar"
            className="contact-mail"
          >
            ciateatralquintopiso@yahoo.com.ar
          </a>
          <img src={require('../images/pages/contacto.jpg').default} alt="" />
        </div>
        <div className="column right">
          <form className="contact-form" onSubmit={handleOnSubmit}>
            <label htmlFor="name">
              Nombre<span>*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="William Shakespeare"
              required
            />
            <br />
            <label htmlFor="email">
              Correo<span>*</span>
            </label>
            <input
              type="text"
              name="email"
              placeholder="w.shakespeare@teatro.com"
              required
            />
            <br />
            <label htmlFor="web">Web</label>
            <input
              type="text"
              name="web"
              placeholder="www.instagram.com/shakespeare"
            />
            <br />
            <label htmlFor="msg">
              Mensaje<span>*</span>
            </label>
            <textarea
              name="msg"
              placeholder="Ser o no ser, esa es la cuestión..."
              required
            />
            <br />
            <button>Enviar</button>
            <br />
            <p className="contact-form-mandatory">*Datos obligatorios.</p>
          </form>
          <a
            href="mailto:ciateatralquintopiso@yahoo.com.ar"
            className="contact-mail"
          >
            ciateatralquintopiso@yahoo.com.ar
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactoPage;
