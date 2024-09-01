import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { CSSTransition } from 'react-transition-group';

const SchoolDetails = () => {
  const { schoolId } = useParams();
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize notes from localStorage or set to empty string if not found
  const [notes, setNotes] = useState(localStorage.getItem(`notes-${schoolId}`) || '');
  
  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    const schoolRef = ref(database, `schools/${schoolId}`);
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setIsBookmarked(bookmarks.includes(schoolId));

    onValue(schoolRef, (snapshot) => {
      const details = snapshot.val();
      if (details) {
        setSchoolDetails({
          name: schoolId,
          ...details
        });
        setError(null);
      } else {
        setError('No details available for this school.');
        setSchoolDetails(null);
      }
      setInProp(true); // Activate the transition effect when data is loaded
    }, { onlyOnce: true });

    return () => setInProp(false); // Deactivate the transition on component unmount
  }, [schoolId]);

  useEffect(() => {
    // Save notes to localStorage whenever they change
    localStorage.setItem(`notes-${schoolId}`, notes);
  }, [notes, schoolId]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    if (bookmarks.includes(schoolId)) {
      const newBookmarks = bookmarks.filter(id => id !== schoolId);
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(false);
    } else {
      bookmarks.push(schoolId);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  return (
    <CSSTransition in={inProp} timeout={500} classNames="page-transition" nodeRef={nodeRef} unmountOnExit>
      <div ref={nodeRef} className="school-details-container">
        <header className="school-details-header1">
          <h1>{schoolDetails ? schoolDetails.name : 'Loading School...'}</h1>
          <button onClick={toggleBookmark} className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}>
            <div className="star-icon"></div>
          </button>
        </header>
        <div className="details-section">
          {schoolDetails ? (
            <>
              <h2 className="current-usage">DETAILS</h2>
              <div className="detail-item">
                <span className="detail-item-label">Plan:</span>
                <span className="detail-item-value">{schoolDetails.column1}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item-label">Visit Frequency:</span>
                <span className="detail-item-value">{schoolDetails.column3}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item-label">Pool Hours:</span>
                <span className="detail-item-value">{schoolDetails.column2}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item-label">Technician:</span>
                <span className="detail-item-value">{schoolDetails.column4}</span>
              </div>
              <div className="current-usage">
  <h2 className="usage-header">CURRENT USAGE</h2>
  <div className="detail-item">
    <span className="detail-item-label">Period:</span>
    <span className="detail-item-value">{schoolDetails.column5}</span>
  </div>
  <div className="detail-item">
    <span className="detail-item-label">Hours Used:</span>
    <span className="detail-item-value">{schoolDetails.column6}</span>
  </div>
  <div className="detail-item">
    <span className="detail-item-label">Hours Left:</span>
    <span className="detail-item-value">{schoolDetails.column7}</span>
  </div>
  <div className="last-updated">
    <span>Last Synced: {schoolDetails.column8}</span>
    <p className="usage-note">Any visits made this week are not yet reflected in the usage data.</p>
  </div>
</div>
             
              <textarea
                className="notes-input"
                value={notes}
                onChange={handleNotesChange}
                placeholder="Add notes here..."
              />
              
            </>
          ) : (
            <p>{error || 'Loading details...'}</p>
          )}
        </div>
      </div>
    </CSSTransition>
  );
};

export default SchoolDetails;
