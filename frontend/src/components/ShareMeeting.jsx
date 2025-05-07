import React from 'react';

const ShareMeeting = () => {
    // TODO: create the meeting link
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
        <div>
            <div>
                <form onSubmit={notifyParticipants}>
                    <h2>Sharing:</h2>
                    <div>
                        <input type="text" placeholder="Event Link" value="https://example.com/event" readOnly />
                        <button type="button" onClick={() => navigator.clipboard.writeText('https://example.com/event')}>Copy</button>
                        <button type="button" onClick={() => window.open('https://example.com/event', '_blank')}>Go To</button>
                    </div>
                    <div>
                        {emails.map((email, index) => (
                            <div key={index}>
                                <input
                                    type="email"
                                    placeholder="Enter email"
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
                                    <button type="button" onClick={() => setEmails(emails.filter((_, i) => i !== index))}>-</button>
                                )}
                                {!isValidEmail(email) && email !== '' && (
                                    <span style={{ color: 'red' }}>Invalid email</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <input type="email" placeholder="Enter your email" required />
                    <button type="submit">Share Event</button>
                </form>
            </div>
        </div>
    );
};

export default ShareMeeting;