import React, { useState, useEffect } from "react";
import "./sharedStyles.css";
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import arrowIcon from '../images/Arrow.png'; // Ensure this path matches the location of your arrow icon

const WorkForms = () => {
  const [formData, setFormData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const formsRef = ref(database, 'forms');
    onValue(formsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        try {
          let dataArray = Object.keys(data).map(key => ({
            id: key,
            title: key,
            link: data[key].column1,
            description: data[key].column2 || "",
            index: data[key].index // Capture the index for sorting
          }));

          dataArray = dataArray.sort((a, b) => a.index - b.index);
          setFormData(dataArray);
          setIsDataLoaded(true);
        } catch (e) {
          setError(`Error loading forms: ${e.message}`);
          setIsDataLoaded(true);
        }
      } else {
        setError("No forms data available.");
        setIsDataLoaded(true);
      }
    }, {
      onlyOnce: true
    });
  }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const filteredForms = formData.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="app-container-noscroll">
      <header className="header">
        <div className="header-content">
          <h1>Forms</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search forms..."
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
        <div className="loading-message">Loading forms...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="list-container">
          {filteredForms.map(form => (
            <div key={form.id} className="list-item">
              {form.link && form.link !== "Coming Soon" ? (
                <a href={form.link} target="_blank" rel="noopener noreferrer" className="staff-link">
                  <div className="staff-info">
                    <h3>{form.title}</h3>
                    {form.description && <p>{form.description}</p>}
                  </div>
                  <img src={arrowIcon} alt="arrow" className="arrow-icon" />
                </a>
              ) : (
                <div className="staff-info">
                  <h3>{form.title}</h3>
                  <p>{form.link || "Coming Soon"}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkForms;
