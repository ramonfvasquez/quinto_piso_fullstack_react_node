import '../../styles/components/layout/Modal.css';
import CloseButton from './CloseButton';

const Modal = ({
  title,
  author,
  date,
  playTitle,
  hasSubTitle,
  content,
  onModalClose,
}) => {
  const subTitle = () => {
    if (hasSubTitle)
      return <h2 className="modal-subtitle">{title.toUpperCase()}</h2>;
  };

  const postAuthor = () => {
    if (author) {
      return <p className="modal-author">por {author}</p>;
    }
  };

  const postDate = () => {
    if (date) {
      return <p className="modal-date">{date}</p>;
    } else {
      return <p className="modal-empty">.</p>;
    }
  };

  return (
    <div className="overlay">
      <div className="modal-container">
        <CloseButton onModalClose={onModalClose} />
        {postDate()}
        <div className="modal-header">
          <div className="modal-header-title">
            <h1 className="modal-title">{playTitle}</h1>
            {postAuthor()}
            {subTitle()}
          </div>
        </div>
        <div className="modal-body">{content}</div>
      </div>
    </div>
  );
};

export default Modal;
