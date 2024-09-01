import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./sharedStyles.css";
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import arrowIcon from '../images/Arrow.png';

const Schools = () => {
  const [schoolsData, setSchoolsData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const schoolsRef = ref(database, 'schools');
    onValue(schoolsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setSchoolsData(dataArray);
          localStorage.setItem('schoolsData', JSON.stringify(dataArray));
        }
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching schools data:', error);
        setError('Failed to load school data.');
        setIsDataLoaded(true);
      }
    }, { onlyOnce: true });
  }, []);

  const filteredSchools = schoolsData.filter(school =>
    school.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add this function to handle clearing the search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>Schools</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search schools..."
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
        {!isDataLoaded ? (
          <div className="loading-message">Loading schools data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="staff-list">
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school, index) => (
                <div key={index} className="list-item">
                  <Link to={`/schools/${school.id}`} className="staff-link">
                    <div className="staff-info">
                      <h3>{school.id}</h3>
                    </div>
                    <img src={arrowIcon} alt="arrow" className="arrow-icon" />
                  </Link>
                </div>
              ))
            ) : (
              <div>No schools match your search.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schools;