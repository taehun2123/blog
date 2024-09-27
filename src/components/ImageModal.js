import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
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


const ImageModal = ({ isOpen, onClose, onImageSelect }) => {
  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, y: "100vh" },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100vh" }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <ModalOverlay 
    variants={modalVariants}
    transition={{ duration: 0.5 }}
    onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>이미지 업로드</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImageModal;