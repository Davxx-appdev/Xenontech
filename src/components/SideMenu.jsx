import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './SideMenu.css';

const SideMenu = ({isOpen, setIsOpen}) => {
  const [userEmail, setUserEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  useEffect(() => {
    const closeMenu = event => {
      if (isOpen && !event.target.closest('.side-menu') && !event.target.closest('.menu-toggle-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeMenu);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
    };
  }, [isOpen, setIsOpen]);

  const isSchoolDetailsPage = location.pathname.startsWith('/schools/');
  const isStaffDetailsPage = location.pathname.startsWith('/staff/');

  const handleBack = () => {
    navigate(-1);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}
      <nav className={`side-menu ${isOpen ? 'open' : 'closed'}`}>
        {isSchoolDetailsPage || isStaffDetailsPage ? (
          <button onClick={handleBack} className="back-button">
            Back
          </button>
        ) : (
          <button 
            onClick={toggleMenu} 
            className={`menu-toggle-button ${isOpen ? 'open' : ''} ${isHomePage ? 'home-page' : ''}`}
          >
            <div className="hamburger-icon">
              <div></div>
            </div>
          </button>
        )}
        <div className="menu-content">
          <ul>
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/schools" onClick={toggleMenu}>Schools</Link></li>
            <li><Link to="/workforms" onClick={toggleMenu}>Forms</Link></li>
            <li><Link to="/videos" onClick={toggleMenu}>Video Library</Link></li>
            <li><Link to="/staff" onClick={toggleMenu}>Staff Directory</Link></li>
            <li><Link to="/help" onClick={toggleMenu}>Get Help</Link></li>
            <li><Link to="/guides" onClick={toggleMenu}>Resources</Link></li>
            
            <li><Link to="/bookmarks" onClick={toggleMenu}>Bookmarks</Link></li>
            <li><Link to="/todolist" onClick={toggleMenu}>To-do List</Link></li>
            <li><Link to="/feedback" onClick={toggleMenu}>Feedback</Link></li>
          </ul>
          {userEmail && (
            <Link to="/" className="user-email-sidebar" onClick={toggleMenu}>
              {userEmail}
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default SideMenu;