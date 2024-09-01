import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import './sharedStyles.css';
import arrowIcon from '../images/Arrow.png';


// Function to fetch school details by IDs
const fetchBookmarkedSchools = async (schoolIds) => {
  const schools = [];
  for (const id of schoolIds) {
    const schoolRef = ref(database, `schools/${id}`);
    const snapshot = await get(schoolRef);
    if (snapshot.exists()) {
      schools.push({
        id,
        name: snapshot.val().id // Ensure that the 'name' key is correct and exists in the data structure
      });
    } else {
      console.log(`No data available for school ID: ${id}`);
    }
  }
  return schools;
};



const Bookmarks = () => {
  const [bookmarkedSchools, setBookmarkedSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    if (bookmarks.length > 0) {
      fetchBookmarkedSchools(bookmarks).then(schools => {
        setBookmarkedSchools(schools);
        setIsLoading(false);
      }).catch(error => {
        console.error("Error fetching bookmarked schools:", error);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const filteredSchools = bookmarkedSchools.filter(school =>
    school.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>Bookmarks</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search bookmarks..."
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
        {isLoading ? (
          <div className="loading-message">Loading bookmarks...</div>
        ) : bookmarkedSchools.length > 0 ? (
          <div className="bookmark-list">
            {filteredSchools.length > 0 ? (
              filteredSchools.map(school => (
                <div key={school.id} className="list-item">
                  <Link to={`/schools/${school.id}`} className="staff-link">
                    <div className="staff-info">
                      <h3>{school.id}</h3>
                    </div>
                    <img src={arrowIcon} alt="arrow" className="arrow-icon" />
                  </Link>
                </div>
              ))
            ) : (
              <div>No bookmarks match your search.</div>
            )}
          </div>
        ) : (
          <div className="no-bookmarks-message">You can star schools on the schools page to save them here.</div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;