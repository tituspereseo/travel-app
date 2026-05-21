import React, { useState, useEffect } from "react";
import "./Modal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "alert",
  onConfirm,
  onCancel,
  inputPlaceholder = "",
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen && type === "prompt") {
      setInputValue("");
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === "prompt") {
      onConfirm(inputValue);
    } else if (type === "confirm") {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <div className="custom-modal-overlay" onClick={handleCancel}>
      <div
        className="custom-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-modal-header">
          <div className="custom-modal-icon">
            {type === "alert" && <i className="fas fa-info-circle"></i>}
            {type === "confirm" && <i className="fas fa-question-circle"></i>}
            {type === "prompt" && <i className="fas fa-edit"></i>}
          </div>
          <h3>{title}</h3>
          <button className="custom-modal-close" onClick={handleCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="custom-modal-body">
          <p>{message}</p>
          {type === "prompt" && (
            <input
              type="text"
              className="custom-modal-input"
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
          )}
        </div>

        <div className="custom-modal-footer">
          {type === "alert" && (
            <button className="custom-modal-btn primary" onClick={handleCancel}>
              OK
            </button>
          )}

          {type === "confirm" && (
            <>
              <button
                className="custom-modal-btn secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="custom-modal-btn primary"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </>
          )}

          {type === "prompt" && (
            <>
              <button
                className="custom-modal-btn secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="custom-modal-btn primary"
                onClick={handleConfirm}
              >
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const useModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    inputPlaceholder: "",
  });

  const showAlert = (title, message) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: "alert",
        title,
        message,
        onConfirm: resolve,
        onCancel: resolve,
      });
    });
  };

  const showConfirm = (title, message) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: "confirm",
        title,
        message,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  const showPrompt = (title, message, placeholder = "") => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: "prompt",
        title,
        message,
        inputPlaceholder: placeholder,
        onConfirm: (value) => resolve(value),
        onCancel: () => resolve(null),
      });
    });
  };

  const ModalComponent = () => (
    <Modal
      isOpen={modalState.isOpen}
      type={modalState.type}
      title={modalState.title}
      message={modalState.message}
      onConfirm={modalState.onConfirm}
      onCancel={modalState.onCancel}
      inputPlaceholder={modalState.inputPlaceholder}
      onClose={() => setModalState({ ...modalState, isOpen: false })}
    />
  );

  return { showAlert, showConfirm, showPrompt, ModalComponent };
};

export default Modal;
