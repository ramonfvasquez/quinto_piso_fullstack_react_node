import { useState } from 'react';
import '../../styles/components/layout/Button.css';
import Modal from './Modal';

const Button = ({ text, playTitle, content, className }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleButtonClick = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  return (
    <div>
      <div className="btn-container" onClick={() => handleButtonClick(content)}>
        <button className={`btn ${className}`}>{text}</button>
      </div>
      {modalVisible ? (
        <Modal
          playTitle={playTitle}
          title={text}
          content={modalContent}
          hasSubTitle={true}
          onModalClose={() => setModalVisible(false)}
        />
      ) : null}
    </div>
  );
};

export default Button;
