import '../../styles/components/layout/CloseButton.css';

const CloseButton = ({ onModalClose }) => {
    const handleButtonClickClose = e => {
        e.preventDefault();
        if (onModalClose) onModalClose();
    };

    return (
        <div className='close-btn-container'>
            <span className="close-btn" onClick={handleButtonClickClose}>X</span>
        </div>           
    );
};

export default CloseButton;