import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import "./sharedStyles.css"; 
import xtechImage from '../images/xtech_logo.png';
import schoolsImage from '../images/Schools.png';
import bookmarksImage from '../images/Bookmarks.png';
import formsImage from '../images/Forms.png';
import todoListImage from '../images/To-do List.png';
import videosImage from '../images/Videos.png';
import resourcesImage from '../images/Resources.png';
import staffImage from '../images/Staff.png';
import getHelpImage from '../images/Get Help.png';
import feedbackImage from '../images/Feedback.png';

const pageLinks = [
  { name: 'Schools', path: '/schools', image: schoolsImage },

  { name: 'Forms', path: '/workforms', image: formsImage },

  { name: 'Videos', path: '/videos', image: videosImage },

  { name: 'Staff', path: '/staff', image: staffImage },

  { name: 'Help', path: '/help', image: getHelpImage },
  
  { name: 'Resources', path: '/guides', image: resourcesImage },
  { name: 'Bookmarks', path: '/bookmarks', image: bookmarksImage },
  { name: 'To-Do List', path: '/todolist', image: todoListImage },
  { name: 'Feedback', path: '/feedback', image: feedbackImage },
];

const Home = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allContentLoaded, setAllContentLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const imageUrls = [
      xtechImage,
      ...pageLinks.map(link => link.image)
    ];

    let loadedImages = 0;
    const totalImages = imageUrls.length;

    const imageLoaded = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        setAllContentLoaded(true);
      }
    };

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = imageLoaded;
      img.onerror = imageLoaded;
    });
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/login");
    }).catch(error => {
      console.error("Error during sign out:", error);
    });
  };

  return (
    <div className="app-container-home">
      {isLoading || !allContentLoaded ? (
        <div className="loading-screen">
          <p>Loading...</p>
        </div>
      ) : user ? (
        <>
          <div className="top-bar">
            <div className="user-info">
              {user.photoURL && <img src={user.photoURL} alt="profile" className="profile-pic-small" />}
            </div>
          </div>
          <div className="logo-container">
            <img src={xtechImage} alt="XTech Logo" className="xtech-logo" />
          </div>
          <div className="content-nosearch-home">
            <div className="page-links-container">
              {pageLinks.map((link, index) => (
                <Link key={index} to={link.path} className="page-link-box">
                  <img src={link.image} alt={link.name} className="page-link-icon" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
            <button onClick={handleLogout} className='logout-btn'>Logout</button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Home;