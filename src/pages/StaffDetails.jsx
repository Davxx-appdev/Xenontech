import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../components/SideMenu"; // Ensure CSS is appropriately linked
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { CSSTransition } from 'react-transition-group'; // Import CSSTransition

const StaffDetails = () => {
  const { staffId } = useParams();
  const [personDetails, setPersonDetails] = useState(null);
  const [error, setError] = useState(null);
  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null); // Create a ref here

  useEffect(() => {
    const personRef = ref(database, `teamDirectory/${staffId}`);
    onValue(personRef, (snapshot) => {
      const details = snapshot.val();
      if (details) {
        try {
          if (!details.column1 || !details.column2 || !details.column3) {
            throw new Error('Missing essential staff details');
          }
          setPersonDetails({
            name: staffId,
            position: details.column1,
            email: details.column2,
            phone: details.column3,
            facebookLink: details.column4,
            photoLink: details.column5
          });
          setInProp(true); // Trigger the transition in
        } catch (error) {
          setError(error.message);
        }
      } else {
        setError('Staff details not found.');
      }
    }, {
      onlyOnce: true
    });
    return () => setInProp(false); // Clean up to trigger the transition out
  }, [staffId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <CSSTransition in={inProp} timeout={500} classNames="page-transition" nodeRef={nodeRef} unmountOnExit>
      <div ref={nodeRef} className="staff-details-container">
        {personDetails ? (
          <>
            <div className="staff-header">
              {personDetails.photoLink && (
                <img src={personDetails.photoLink} alt={personDetails.name} className="staff-photo-details" />
              )}
              <div className="staff-info-details">
                <h1 className="staff-name">{personDetails.name}</h1>
                <p className="position-text">{personDetails.position}</p>
              </div>
            </div>
            <div className="staff-body">
              <div className="staff-detail-item">
                <span className="staff-detail-label">Email:</span>
                <a href={`mailto:${personDetails.email}`} className="staff-detail-link">{personDetails.email}</a>
              </div>
              <div className="staff-detail-item">
                <span className="staff-detail-label">Phone:</span>
                <span>{personDetails.phone}</span>
              </div>
              {personDetails.facebookLink && (
                <div className="staff-detail-item">
                  <span className="staff-detail-label">{personDetails.name} on Facebook:</span>
                  <a href={personDetails.facebookLink} target="_blank" rel="noopener noreferrer" className="staff-detail-link">Profile</a>
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Loading details...</p>
        )}
      </div>
    </CSSTransition>
  );
};

export default StaffDetails;
