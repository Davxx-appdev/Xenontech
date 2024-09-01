import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';

const AppLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  return (
    <div className={`app-container ${isMenuOpen ? 'menu-open' : ''}`}>
      <SideMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <div className="content">{children}</div>
    </div>
  );
};

export default AppLayout;