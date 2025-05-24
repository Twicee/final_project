import React, { useId, useRef, useEffect } from 'react';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const emailId = useId();
  const passId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div role="dialog" aria-modal="true" className="modal" ref={modalRef}>
        <h2>Log In</h2>
        <form className="auth-form" onSubmit={e => e.preventDefault()}>
          <label htmlFor={emailId}>Email</label>
          <input id={emailId} type="email" required />

          <label htmlFor={passId}>Password</label>
          <input id={passId} type="password" required />

          <div className="auth-buttons">
            <button type="submit" className="btn-submit">
              Sign In
            </button>
            <button type="button" className="btn-secondary" onClick={() => {/* trigger create account flow */}}>
              Create Account
            </button>
          </div>
        </form>
        <button
          aria-label="Close"
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
