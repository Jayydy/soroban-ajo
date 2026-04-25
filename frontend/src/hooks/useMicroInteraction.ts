import { useState, useCallback } from 'react';

export const useMicroInteraction = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerSuccess = useCallback(() => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }, []);

  const triggerError = useCallback(() => {
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  }, []);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  }, []);

  return {
    showSuccess,
    showError,
    showConfetti,
    triggerSuccess,
    triggerError,
    triggerConfetti,
  };
};
