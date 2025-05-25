import { useState, useCallback } from 'react';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Re-enable body scroll when modal is closed
    document.body.style.overflow = 'unset';
    
    // Clear modal data after animation completes
    setTimeout(() => {
      setModalData(null);
    }, 300);
  }, []);

  // Clean up body styles when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
  };
};

export default useModal;
