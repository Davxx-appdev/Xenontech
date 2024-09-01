import React, { useState } from 'react';
import './sharedStyles.css';

const CalendarButton = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const calendarItems = [
    { name: 'Open Google Calendar', action: () => window.open('https://calendar.google.com', '_system') }
  ];

  const filteredItems = calendarItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container-noscroll">
      <header className="header">
        <div className="header-content">
          <h1>Calendar</h1>
          <input
            type="text"
            placeholder="Search calendar items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>
      <div className="list-container">
        {filteredItems.map((item, index) => (
          <div key={index} className="list-item" onClick={item.action}>
            {item.name}
          </div>
        ))}
        {filteredItems.length === 0 && <div>No items found.</div>}
      </div>
    </div>
  );
};

export default CalendarButton;
