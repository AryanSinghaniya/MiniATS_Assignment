import { useEffect, useRef } from 'react';

/**
 * Modal - accessible dialog wrapper with backdrop click and Escape key to close
 *
 * @param {boolean} isOpen - controls visibility
 * @param {Function} onClose - called to close the modal
 * @param {string} title - modal heading
 * @param {ReactNode} children - modal body content
 * @param {string} size - 'sm' | 'md' | 'lg' (default 'md')
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const backdropRef = useRef(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent scrolling body when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      className="modal-backdrop"
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`modal modal--${size}`}>
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
