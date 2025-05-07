import React from 'react';
import './css/ShareMeeting.css';

const ShareMeeting = () => {
    // TODO: create the meeting link

    // TODO: Make sure share event cant be spammed
    const [emails, setEmails] = React.useState(['']);

    const handleAddEmailInput = () => {
        setEmails([...emails, '']);
    };

    const handleEmailChange = (index, value) => {
        const updatedEmails = [...emails];
        updatedEmails[index] = value;
        setEmails(updatedEmails);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const notifyParticipants = (event) => {
        event.preventDefault();
        // TODO: Implement the logic to notify participants and creator
        // first alert the user that this will email the participants
        console.log('Notifying participants:', emails);
    }

    return (
        <div className="card">
            <div onSubmit={notifyParticipants} className="share-meeting-form">
                <h2>Sharing:</h2>
                <div className="link-container">
                    <input type="text" placeholder="Event Link" value="https://example.com/event" readOnly />
                    <button type="button" onClick={() => navigator.clipboard.writeText('https://example.com/event')}>Copy</button>
                    <button type="button" onClick={() => window.open('https://example.com/event', '_blank')}>Go To</button>
                </div>
                <p>Enter the email addresses of the participants you want to notify:</p>
                <div className="email-list">
                    {emails.map((email, index) => (
                        <div key={index} className="email-input-group">
                            <input
                                type="email"
                                placeholder="Enter participant email"
                                value={email}
                                onChange={(e) => handleEmailChange(index, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && isValidEmail(email)) {
                                        e.preventDefault();
                                        handleAddEmailInput();
                                        setTimeout(() => {
                                            document.querySelectorAll('input[type="email"]')[index + 1]?.focus();
                                        }, 0);
                                    }
                                }}
                            />
                            {index === emails.length - 1 ? (
                                <button 
                                    type="button" 
                                    onClick={handleAddEmailInput} 
                                    disabled={!isValidEmail(email)}
                                >+</button>
                            ) : (
                                <button className="delete-button" type="button" onClick={() => setEmails(emails.filter((_, i) => i !== index))}>-</button>
                            )}
                            {!isValidEmail(email) && email !== '' && (
                                <span style={{ color: 'red' }}>Invalid email</span>
                            )}
                        </div>
                    ))}
                </div>
                <p>Enter the organizer's email address so you don't loose access to the meeting controls</p>
                <div className="email-input-group">
                    <input type="email" placeholder="Enter your email" required />
                    <button type="button">Share Event</button>
                </div>
            </div>
        </div>
    );
};

export default ShareMeeting;