import { useState } from 'react';
import '../../styles/components/layout/ReadMoreButton.css';
import Modal from './Modal';

const ReadMoreButton = ({ text, author, date, postTitle, content, className }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleButtonClick = (content) => {
        setModalContent(content);
        setModalVisible(true);
    }

    return (
        <div>
            <div className='read-more-btn' onClick={() => handleButtonClick(content)}>
                {text}
            </div>
            {modalVisible ? <Modal playTitle={postTitle} author={author} title={text} date={date} content={modalContent} hasSubTitle={false} onModalClose={() => setModalVisible(false)} /> : null}
        </div>
    );
};

export default ReadMoreButton;
