import React, { createContext, useContext, useState, useEffect } from 'react';

const GoogleApiContext = createContext();

export const useGoogleApi = () => useContext(GoogleApiContext);

export const GoogleApiProvider = ({ children }) => {
  const [gapiLoaded, setGapiLoaded] = useState(false);

  useEffect(() => {
    const loadGapi = () => {
      if (window.gapi) {
        initializeGapi();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        // Ensure gapi is not just loaded but also ready to use
        window.gapi.load('client', initializeGapi);
      };
      script.onerror = (error) => {
        console.error('Error loading GAPI client script:', error);
      };
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    const retryInitialize = (attempt = 0) => {
      if (attempt < 3) {  // Retry up to 3 times
        setTimeout(() => {
          console.log(`Retrying Google API initialization: Attempt ${attempt + 1}`);
          window.gapi.load('client', () => initializeGapi(attempt + 1));
        }, 2000 * attempt);  // Exponential backoff
      }
    };

    const initializeGapi = (attempt = 0) => {
      window.gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest"]
      }).then(() => {
        setGapiLoaded(true);
      }).catch(error => {
        console.error('Error initializing GAPI client:', error);
        retryInitialize(attempt);
      });
    };
    loadGapi();

    return () => {
      // Cleanup the script to avoid any duplicates in future re-renders
      const script = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <GoogleApiContext.Provider value={{ gapiLoaded }}>
      {children}
    </GoogleApiContext.Provider>
  );
};
