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
  background-color: rgba(0, 0, 0, 0.2);
`;

const ModalContainer = styled(motion.div)`
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 300px;
  max-width: 80%;
  gap: 1em;
`;

const ModalInput = styled.input`
outline: none;
border-radius: 0.2em;
border: 1px solid lightgray;
padding: 1rem;
font-size: 1.2em;
`
const Button = styled.button`
  padding: 1em 2em;
  background: var(--button-main-color);
  border-radius: 0.5em;
  cursor: pointer;
  border: none;
  color: white;
  font-weight: 750;
  transition: background 0.5s;
  &:hover {
    background: var(--button-hover-color);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const modalVariants = {
  hidden: { opacity: 0, y: "100vh" },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100vh" }
};

const ImageModal = ({api, isOpen, onClose, handleFileChange }) => {
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
            <ModalInput type="file" accept="image/*" onChange={(e)=>handleFileChange(e, api)} />
          </ModalContainer>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
