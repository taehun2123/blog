import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(2, 6, 23, 0.68);
`;

const ModalContainer = styled(motion.div)`
  padding: 3em;
  background: rgba(15, 23, 42, 0.94);
  border: 1px solid var(--surface-border-color);
  color: var(--text-main-color);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  gap: 1em;
`;

const ModalInput = styled.input`
outline: none;
border-radius: 0.2em;
border: 1px solid var(--surface-border-color);
background: var(--background-input-color);
color: var(--text-main-color);
padding: 1rem;
font-size: 1.2em;
`
const modalVariants = {
  hidden: { opacity: 0, y: "100vh" },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100vh" }
};

const ImageModal = ({
  api,
  accept = "image/*",
  isOpen,
  onClose,
  handleFileChange,
  title = "이미지 업로드",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <ModalContainer
            variants={modalVariants}
            transition={{ duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{title}</h2>
            <ModalInput type="file" accept={accept} onChange={(e)=>handleFileChange(e, api)} />
          </ModalContainer>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
