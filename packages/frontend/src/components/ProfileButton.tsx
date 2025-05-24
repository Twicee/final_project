import React, { useState } from 'react';
import AuthModal from './AuthModal';

const ProfileButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label="Open profile menu"
        className="profile-button"
      >
        <img
          src="/images/default_image.jpg"
          alt="Profile"
          className="profile-avatar"
        />
      </button>

      {open && <AuthModal onClose={handleClose} />}
    </>
  );
};

export default ProfileButton;
