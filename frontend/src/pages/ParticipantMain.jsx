import React from 'react';
import ShadowCalendarElement from '../components/ShadowCalendarElement';
import FooterBanner from '../components/FooterBanner';
import './css/ParticipantMain.css';

const ParticipantMain = (props) => {
    // TODO: get meeting data from the server and display it here (handle if creator or participant)

    const isCreator = props.creator || false;
    
    const allowEmail = isCreator || false; //TODO: replace with actual logic to determine if the user is allowed to email participants

    const periodStart = new Date();
    const periodEnd = new Date(periodStart); // temp
    periodEnd.setDate(periodEnd.getDate() + 1); // temp

    return (
        <>
            <div className="card-container main-container">
                <div className="meeting-info card">
                    <div className="meeting-toolbar">
                        <h1>Placeholder meeting</h1>
                        <div className="meeting-toolbar-buttons">
                            <button type="button" id="edit-button">Edit</button>
                            {allowEmail && <button type="button" id="email-participants-button">Email participants</button>}
                            <button type="button" id="export-button">Export</button>
                            <button type="button" id="share-button">Share</button>
                            <button type="button" id="copy-link-button">Copy link</button>
                        </div>
                    </div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <div>Meeting location: Tampere</div>
                    <div>Meeting organizer: aarni.akkala@gmail.com</div>
                </div>
                <div className="meeting-time card">
                    <h2>Meeting time configuration</h2>
                    <div className="meeting-time-config">
                        <div className="label-input-input-group">
                            <label htmlFor="meeting-time-interval">Time Interval (from - to)</label>
                            <div className="from-to-input">
                                <input type="date" id="meeting-start" name="meeting-start" defaultValue={periodStart.toISOString().split("T")[0]} readOnly />
                                <div>-</div>
                                <input type="date" id="meeting-end" name="meeting-end" defaultValue={periodEnd.toISOString().split("T")[0]} readOnly  />
                            </div>
                        </div>
                        <div className="label-input-group">
                            <label htmlFor="meeting-duration">Duration (hh:mm)</label>
                            <input type="time" id="meeting-duration" name="meeting-duration" defaultValue="01:30" readOnly />
                        </div>
                    </div>
                    <ShadowCalendarElement periodStart={periodStart} periodEnd={periodEnd} participantID={"PLACEHOLDER"}/> {/*TODO: Temporary ID, replace with actual participant ID */}
                </div>
            
            </div>
            <FooterBanner buttons={isCreator ? [
                <button type="button" id="create-poll">Create poll</button>,
                <button type="button" id="choose-time">Choose time</button>,
                <button type="button" id="send-reminder">Send reminder</button>
            ]: []} />
        </>
    );
};

export default ParticipantMain;