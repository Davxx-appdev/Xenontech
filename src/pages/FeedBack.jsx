import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Ensure you import auth correctly from your Firebase config
import './sharedStyles.css'; // Ensure you import the shared styles

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState(''); // State to store user's email
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if the form is submitting

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email); // Set the user email from Firebase Auth
    }
  }, []);

  const handleSendFeedback = () => {
    if (!message.trim()) {
      alert("Please enter some feedback before submitting.");
      return;
    }
    setIsSubmitting(true); // Disable the button as the request is processing
    const feedbackData = {
      email: userEmail,
      message
    };

    fetch('https://us-central1-xapp-firebase.cloudfunctions.net/sendFeedbackEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feedbackData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setSubmissionStatus('success');
      setIsSubmitting(false); // Re-enable the button once the request is successful
    })
    .catch((error) => {
      console.error('Error:', error);
      setSubmissionStatus('error');
      setIsSubmitting(false); // Re-enable the button if there's an error
    });
  };

  if (submissionStatus === 'success') {
    return (
      <div className="feedback-success-overlay">
        <h1>Thank you for your feedback!</h1>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <header className="todo-header">
        <h1>Feedback</h1>
      </header>
      <div className="school-details-container">
        <div className="details-section-feedback">
          <div className="feedback-form">
            <p1>We love to hear your thoughts! If you have any comments or suggestions on the app, feel free to let us know!</p1>
            <textarea
              placeholder="Type your comments or suggestions here.."
              rows="10"
              className="feedback-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting} // Disable textarea when submitting
            ></textarea>
            <button
              className="submit-button"
              onClick={handleSendFeedback}
              disabled={isSubmitting} // Disable the button when submitting
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
