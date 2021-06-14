import React, { useEffect, useState } from "react";
import Modal from "src/app/components/commons/Modal";

const modalService = {
  currentHandler: Function,
  closeFn: Function,
  register: function (fn: any, closeFn: any) {
    this.currentHandler = fn;
    this.closeFn = closeFn;
  },
  show: function (Component: React.ComponentType<any>, props = {}, onClose?: any) {
    this.currentHandler(
      // @ts-ignore
      (close: any) => <Component close={close} {...props} />,
      onClose,
      props,
    )
  },
  close: function () {
    if (this.closeFn !== null) {
      this.closeFn()
    }
  }
};

const ModalListener = () => {
  const [modalContent, setModalContent] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [onClose, setOnClose] = useState<Function | null>(null);
  const [props, setProps] = useState({});

  const close = () => {
    if (onClose != null) onClose();
    setIsActive(false);
    setTimeout(() => {
      setModalContent("");
    }, 200);
    setOnClose(null);
  };

  useEffect(() => {
    modalService.register((content: any, onClose: any, modalProps: any) => {
      setOnClose(() => onClose);
      setProps(modalProps);
      setModalContent(content(close));
      setIsActive(true);
    }, close)
  }, []); // eslint-disable-line

  return (
    <Modal isActive={isActive} {...props} onClose={close}>
      {modalContent}
    </Modal>
  )
};

export { modalService, ModalListener }