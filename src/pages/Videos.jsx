import React, { useState, useEffect } from "react";
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import './sharedStyles.css';
import arrowIcon from '../images/Arrow.png';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [clickedVideo, setClickedVideo] = useState(null); // Corrected to allow state change
  const [searchTerm, setSearchTerm] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const videoRef = ref(database, 'videoLibrary');
    onValue(videoRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const videosArray = Object.keys(data).map(key => ({
            title: key,
            link: data[key].column1, // Assuming column1 holds the YouTube link
            date: data[key].column3.split('T')[0] // Extracting and formatting date
          }));
          setVideos(videosArray);
        }
        setIsDataLoaded(true);
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError('Failed to load video data.');
        setIsDataLoaded(true);
      }
    }, { onlyOnce: true });
  }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Define handleClick function
  const handleClick = (videoTitle) => {
    setClickedVideo(videoTitle); // Set the clicked video
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>Video Library</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={handleClearSearch} className="clear-search">
                ×
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="content">
        <div className="staff-list">
          {!isDataLoaded ? (
            <div className="loading-message">Loading video data...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            filteredVideos.map((video, index) => (
              <div key={index} className={`list-item ${clickedVideo === video.title ? "active" : ""}`}
                   onClick={() => handleClick(video.title)}>
                <a href={video.link} target="_blank" rel="noopener noreferrer" className="staff-link">
                  <div className="staff-info">
                    <h3>{video.title}</h3>
                    <p className="position">{video.date}</p>
                  </div>
                  <img src={arrowIcon} alt="arrow" className="arrow-icon" />
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Videos;
