import React from 'react';
import ShadowCalendarElement from '../components/ShadowCalendarElement';

const ParticipantMain = (props) => {
    // TODO: get meeting data from the server and display it here (handle if creator or participant)

    const isCreator = props.creator || false;
    
    const allowEmail = isCreator || false; //TODO: replace with actual logic to determine if the user is allowed to email participants

    const periodStart = new Date();
    const periodEnd = new Date(periodStart); // temp
    periodEnd.setDate(periodEnd.getDate() + 1); // temp

    return (
        <>
        <div>
            <h1>Placeholder meeting</h1>
            <div id="meeting-toolbar">
                <button id="edit-button">Edit</button>
                {allowEmail && <button id="email-participants-button">Email participants</button>}
                <button id="export-button">Export</button>
                <button id="share-button">Share</button>
                <button id="copy-link-button">Copy link</button>
            </div>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div>Meeting location: Tampere</div>
            <div>Meeting organizer: aarni.akkala@gmail.com</div>
        </div>
        <div>
            <h2>Meeting time configuration</h2>
            <div>
                <label htmlFor="meeting-time-interval">Time Interval:</label>
                <input type="date" id="meeting-start" name="meeting-start" defaultValue={periodStart.toISOString().split("T")[0]} required />
                <input type="date" id="meeting-end" name="meeting-end" defaultValue={periodEnd.toISOString().split("T")[0]} required />
            </div>
            <div>
                <label htmlFor="meeting-duration">Duration:</label>
                <input type="time" id="meeting-duration" name="meeting-duration" defaultValue="01:30"/>
            </div>
            <ShadowCalendarElement periodStart={periodStart} periodEnd={periodEnd} participantID={"PLACEHOLDER"}/> {/*TODO: Temporary ID, replace with actual participant ID */}
        </div>
        {isCreator && <div className="action-banner">
            <button id="create-poll">Create poll</button>
            <button id="choose-time">Choose time</button>
            <button id="send-reminder">Send reminder</button>
        </div>}
        </>
    );
};

export default ParticipantMain;