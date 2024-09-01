import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";  // Import database functions

const firebaseConfig = {
  apiKey: "AIzaSyDvHcfSTj0n_PiPyOvZBGNK85itjSL1718",
  authDomain: "xapp-firebase.firebaseapp.com",
  projectId: "xapp-firebase",
  storageBucket: "xapp-firebase.appspot.com",
  messagingSenderId: "155410445675",
  appId: "1:155410445675:web:108dd56b90914494eac82e",
  measurementId: "G-RC7B0R67BR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);  // Ensure the auth module uses the initialized app
export const googleAuthProvider = new GoogleAuthProvider();

// Initialize the database with the correct URL for your region
export const database = getDatabase(app, "https://xapp-firebase-default-rtdb.asia-southeast1.firebasedatabase.app");

export default app;
