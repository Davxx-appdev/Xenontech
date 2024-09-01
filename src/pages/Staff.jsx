import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./sharedStyles.css";
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import arrowIcon from '../images/Arrow.png'; 

const Staff = () => {
  const [staffData, setStaffData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error, setError] = useState(null);  // Define error directly with useState
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const staffRef = ref(database, 'teamDirectory');
    onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        try {
          const dataArray = Object.keys(data).map(key => {
            if (!data[key] || !data[key].column1) {
              throw new Error("Missing staff information for key: " + key);
            }
            return {
              id: key,
              name: key,
              details: {
                ...data[key],
                photoLink: data[key].column5 || 'default-image-url.jpg'
              }
            };
          });
          setStaffData(dataArray);
          localStorage.setItem('staffData', JSON.stringify(dataArray));
          setIsDataLoaded(true);
        } catch (e) {
          setError(e.message);
          setIsDataLoaded(true);
        }
      } else {
        setIsDataLoaded(true);
        setError("No staff data available.");
      }
    }, {
      onlyOnce: true
    });
  }, []);  // Removed setError from dependency array as it's not required to be dynamic

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const filteredStaff = staffData.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>Staff Directory</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search staff..."
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
      {!isDataLoaded ? (
        <div className="loading-message">Loading staff data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="staff-list">
          {filteredStaff.map(person => (
            <div key={person.id} className="list-item">
              <Link to={`/staff/${person.id}`} className="staff-link">
                {person.details.photoLink && (
                  <img src={person.details.photoLink} alt={person.name} className="staff-photo" />
                )}
                <div className="staff-info">
                  <h3>{person.name}</h3>
                  <p>{person.details.column1}</p> {/* Assuming column1 is the position */}
                </div>
                <img src={arrowIcon} alt="arrow" className="arrow-icon" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Staff;
