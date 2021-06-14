import React, { useEffect } from "react";

type ModalProps = {
  isActive: boolean
  onClose: Function
  children: React.ReactNode
  title?: string
}

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  useEffect(() => {
    if (props.isActive) {
      document.querySelector('body')!.classList.add('modal-open');
    }

    return () => {
      document.querySelector('body')!.classList.remove('modal-open');
    }
  }, [props.isActive]);

  function handleClose(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  }

  return (
    <div className={"modal-overlay" + (props.isActive ? " modal-overlay--active" : "")} onClick={handleClose}>
      <div className={`modal ${props.isActive ? "modal--active" : ""}`}>
        <div className={"modal__content"}>
          <div className={"modal__close-btn"} onClick={handleClose}>×</div>
          {props.title && (
            <div className={"modal__title"}>{props.title}</div>
          )}
          {props.children}
        </div>
      </div>
    </div>
  )
};

export default Modal;