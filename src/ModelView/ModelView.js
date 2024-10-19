import React from "react";
import "./ModelView.css"; // Ensure this CSS file exists

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children} {/* Render any children passed to the modal */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
