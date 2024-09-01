import React, { useState, useEffect } from "react";
import "./sharedStyles.css";
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import arrowIcon from '../images/Arrow.png'; // Ensure this path matches the location of your arrow icon

const Resources = () => {
  const [resourcesData, setResourcesData] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const resourcesRef = ref(database, 'helpfulGuides');
    onValue(resourcesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        try {
          const dataArray = Object.keys(data).map(key => {
            if (!data[key] || !data[key].column1) {
              throw new Error("Missing resource information for key: " + key);
            }
            return {
              id: key,
              title: key,
              author: data[key].column1,
              link: data[key].column2
            };
          });
          setResourcesData(dataArray);
          setFilteredResources(dataArray);
          setIsDataLoaded(true);
        } catch (e) {
          setError(e.message);
          setIsDataLoaded(true);
        }
      } else {
        setIsDataLoaded(true);
        setError("No resource data available.");
      }
    }, {
      onlyOnce: true
    });
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = resourcesData.filter(item =>
      item.title.toLowerCase().includes(lowercasedFilter) ||
      item.author.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredResources(filteredData);
  }, [searchTerm, resourcesData]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>Resources</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Resources..."
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
      {!isDataLoaded ? (
        <div className="loading-message">Loading resources...</div>
      ) : (
        <div className="list-container">
          {filteredResources.map((resource, index) => (
            <div key={index} className="list-item">
              <a href={resource.link} target="_blank" rel="noopener noreferrer" className="staff-link">
                <div className="staff-info">
                  <h3>{resource.title}</h3>
                  <p>{resource.author}</p>
                </div>
                <img src={arrowIcon} alt="arrow" className="arrow-icon" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
