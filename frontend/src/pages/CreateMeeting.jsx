import { Outlet, useNavigate, useOutlet } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ShadowCalendarElement from "../components/ShadowCalendarElement";

function CreateMeeting() {

    const navigate = useNavigate();

    // TODO: handle creator page reload (if root then empty meeting data, if id then fetch meeting data from server)

    const handleSubmit = (event) => {
        event.preventDefault();

        const meetingData = {
            creatorId: uuidv4(),
            participantId: uuidv4(),
            title: event.target["meeting-title"].value,
            start: event.target["meeting-start"].value,
            end: event.target["meeting-end"].value,
            description: event.target["meeting-description"].value,
            location: event.target["meeting-location"].value,
            duration: event.target["meeting-duration"].value,
            showParticipants: event.target["show-participants"].checked,
        };

        // TODO: Send meetingData to the server

        navigate(`${meetingData.creatorId}`, { replace: false });
    };

return (
    <>
    <Outlet/>
    <form className="meeting-form" onSubmit={handleSubmit}>
        <div className="meeting-info">
            <h1>Meeting Information</h1>
            <div>
                <label htmlFor="meeting-title">Title:</label>
                <input type="text" id="meeting-title" name="meeting-title" required />
            </div>

            <div>
                <label htmlFor="meeting-description">Description:</label>
                <textarea id="meeting-description" name="meeting-description" rows="4" cols="50" required></textarea>
            </div>

            <div>
                <label htmlFor="meeting-location">Location:</label>
                <input type="text" id="meeting-location" name="meeting-location" required />
            </div>
        </div>
        <div>
            <h2>Meeting time configuration</h2>
            <div>
                <label htmlFor="meeting-time-interval">Time Interval:</label>
                <input type="date" id="meeting-start" name="meeting-start" defaultValue={new Date().toISOString().split("T")[0]} required />
                <input type="date" id="meeting-end" name="meeting-end" defaultValue={new Date().toISOString().split("T")[0]} required />
            </div>
            <div>
                <label htmlFor="meeting-duration">Duration:</label>
                <input type="time" id="meeting-duration" name="meeting-duration" defaultValue="01:30"/>
            </div>
            <ShadowCalendarElement/>
        </div>
        <div className="meeting-settings">
            <h1>Settings</h1>
            <div>
                <label htmlFor="show-participants">Show Participants:</label>
                <input type="checkbox" id="show-participants" name="show-participants" defaultChecked />
                <label htmlFor="allow-email-participants">Allow email participants:</label>
                <input type="checkbox" id="allow-email-participants" name="allow-email-participants" />
            </div>
        </div>
        {!useOutlet() && <button type="submit" className="create-meeting-button">Create Meeting</button>}
    </form>
    </>
);
}

export default CreateMeeting;