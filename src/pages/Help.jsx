import React, { useState, useEffect } from 'react';
import './sharedStyles.css';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import messengerIcon from '../images/messenger-icon.png';
import googleChatIcon from '../images/Google_Chat.png';

const Help = () => {
  const [helpData, setHelpData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error] = useState(null); // Make sure to manage the state for errors
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const helpRef = ref(database, 'getHelp');
    onValue(helpRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.keys(data).map(key => {
          const parts = key.split(',');
          let rawDescriptions = data[key]?.column1 || '';
          rawDescriptions = rawDescriptions.trim();
          if (rawDescriptions.startsWith('➤')) {
            rawDescriptions = rawDescriptions.slice(1).trim();
          }
          const descriptionParts = rawDescriptions.split('➤').map(part => part.trim()).filter(part => part !== '');
          return {
            name: parts[0],
            role: parts.length > 1 ? parts[1].trim() : '',
            descriptions: descriptionParts,
            link: data[key]?.column2 || '',
            additionalInfo: data[key]?.column3 || ''
          };
        });
        setHelpData(dataArray);
        localStorage.setItem('helpData', JSON.stringify(dataArray));
      }
      setIsDataLoaded(true);
    }, {
      onlyOnce: true
    });
  }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const linkLabel = (url) => {
    if (url.startsWith('https://www.facebook.com/') || url.startsWith('http://m.me')) {
      return { label: <img src={messengerIcon} alt="Messenger" style={{ width: '24px', height: '24px' }} />, noBullet: true };
    } else if (url.startsWith('https://chat.google.com')) {
      return { label: <img src={googleChatIcon} alt="Google Chat" style={{ width: '24px', height: '24px' }} />, noBullet: true };
    } else {
      return { label: 'Contact', noBullet: false }; // Default text if URL does not match any case
    }
  };
  
  const filteredHelpData = helpData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descriptions.some(desc => desc.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.additionalInfo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container help-page">
      <header className="header">
        <div className="header-content">
          <h1>Get Help</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search help topics..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={handleClearSearch} className="clear-search">
                ×
              </button>
            )}
          </div>
        </div>
      </header>
      {error ? (
        <div className="error-message">{error}</div>
      ) : !isDataLoaded ? (
        <div className="loading-message">Loading help data...</div>
      ) : (
        <div className="help-list">
          {filteredHelpData.map((item, index) => (
            <div key={index} className="help-item">
              <h3>{item.name} - {item.role}</h3>
              <ul>
                {item.descriptions.map((desc, idx) => (
                  <li key={idx} className={desc.startsWith("Available") ? "no-bullet" : ""}>
                    {desc}
                  </li>
                ))}
                {item.link && (
                  <li className={linkLabel(item.link).noBullet ? "no-bullet" : ""}>
                    <a href={item.link}>{linkLabel(item.link).label}</a>
                  </li>
                )}
                {item.additionalInfo && <li>{item.additionalInfo}</li>}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Help;
