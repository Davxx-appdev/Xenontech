import React from 'react';
import GoogleButton from 'react-google-button';
import { auth, googleAuthProvider } from '../firebase';
import { signOut, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logoImage from '../images/Logo_1.png'; // Importing logo image
import xtechImage from '../images/xtech.jpg'; // Importing secondary image
import "./sharedStyles.css";

const Login = () => {
  const navigate = useNavigate();
  const allowedDomain = "@xenontech.com.au";

  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then(result => {
        if (result.user.email.endsWith(allowedDomain)) {
          console.log("Login successful:", result);
          localStorage.setItem('token', result.user.accessToken);
          localStorage.setItem('user', JSON.stringify(result.user));
          navigate("/");
        } else {
          console.error("Invalid email domain.");
          signOut(auth).then(() => {
            alert("Please use a @xenontech.com.au email address to log in.");
          }).catch(error => {
            console.error("Error signing out user:", error);
          });
        }
      })
      .catch(error => {
        console.error("Error during Google sign-in:", error);
      });
  };

  return (
    <div className="login-container">
      <img src={logoImage} alt="App Logo" className="app-logo" />
      <img src={xtechImage} alt="Xenontech" className="xtech-image" />
      <GoogleButton onClick={handleSignInWithGoogle} className="google-btn" />
    </div>
  );
};

export default Login;
