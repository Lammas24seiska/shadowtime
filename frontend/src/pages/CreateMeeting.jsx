import { Outlet, useNavigate, useOutlet } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ShadowCalendarElement from "../components/ShadowCalendarElement";
import { useEffect, useState, useRef } from "react";
import "./css/CreateMeeting.css";
import FooterBanner from "../components/FooterBanner";

function CreateMeeting() {

    const [isLocked, setIsLocked] = useState(false);
    const navigate = useNavigate();
    const outletExists = useOutlet();
    const formRef = useRef(null);
    let meetingData = {};

    // Set default start to today and end to a week after
    const today = new Date();
    const weekAfter = new Date(today);
    weekAfter.setDate(today.getDate() + 7);

    const [startDate, setStartDate] = useState(today.toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(weekAfter.toISOString().split("T")[0]);

    const toggleLock = (resubmit) => {
        if (resubmit && !isLocked) {
            resubmitForm();
        }
        setIsLocked(!isLocked);
    }

    useEffect(() => {
        if (!outletExists) {
            setIsLocked(false);
        }
    }, [outletExists]);

    // TODO: handle creator page reload (if root then empty meeting data, if id then fetch meeting data from server)
    // TODO: disable form if there is meeting data
    // TODO: go to error page if meeting data should exists but does not exist

    const resubmitForm = () => {
        const form = document.querySelector(".meeting-form");
        const formData = new FormData(form);
        
        meetingData.title = formData.get("meeting-title");
        meetingData.start = formData.get("meeting-start");
        meetingData.end = formData.get("meeting-end");
        meetingData.description = formData.get("meeting-description");
        meetingData.location = formData.get("meeting-location");
        meetingData.duration = formData.get("meeting-duration");
        meetingData.showParticipants = formData.get("show-participants") === "on" ? true : false;
        meetingData.allowEmail = formData.get("allow-email-participants") === "on" ? true : false;

        // TODO: Send meetingData to the server
        
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        meetingData = {
            creatorId: uuidv4(),
            participantId: uuidv4(),
            title: event.target["meeting-title"].value,
            start: startDate,
            end: endDate,
            description: event.target["meeting-description"].value,
            location: event.target["meeting-location"].value,
            duration: event.target["meeting-duration"].value,
            showParticipants: event.target["show-participants"].checked,
            allowEmail: event.target["allow-email-participants"].checked,
        };

        // TODO: Send meetingData to the server

        toggleLock(false);

        navigate(`${meetingData.creatorId}`, { replace: false });
    };

return (
    <>
    <form ref={formRef} className="meeting-form main-container" onSubmit={handleSubmit}>
        <div className="card-container">
            <Outlet/>
            <div className="meeting-info card">
                <div className="meeting-toolbar">
                    <h1>{!useOutlet() ? "Create meeting" : "Meeting information"}</h1>
                    {useOutlet() && <button type="button" className="edit-button" onClick={toggleLock}>{isLocked ? "Edit" : "Save Changes"}</button>}
                </div>
                <div className="label-input-group">
                    <label htmlFor="meeting-title">Title:</label>
                    <input disabled={isLocked} type="text" id="meeting-title" name="meeting-title" required />
                </div>

                <div className="label-input-group">
                    <label htmlFor="meeting-description">Description (optional)</label>
                    <textarea disabled={isLocked} id="meeting-description" name="meeting-description" rows="4" cols="50" style={{ resize: "vertical" }}></textarea>
                </div>

                <div className="label-input-group">
                    <label htmlFor="meeting-location">Location (optional)</label>
                    <input disabled={isLocked} type="text" id="meeting-location" name="meeting-location" />
                </div>
            </div>
            <div className="card">
                <div className="meeting-toolbar">
                    <h2>Meeting time configuration</h2>
                    {useOutlet() && <button type="button" className="edit-button" onClick={toggleLock}>{isLocked ? "Edit" : "Save Changes"}</button>}
                </div>
                <div className="meeting-time-config">
                    <div className="label-input-input-group">
                        <label htmlFor="meeting-time-interval">Time Interval (from - to)</label>
                        <div className="from-to-input">
                            <input
                                disabled={isLocked}
                                type="date"
                                id="meeting-start"
                                name="meeting-start"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                required
                            />
                            <div>-</div>
                            <input
                                disabled={isLocked}
                                type="date"
                                id="meeting-end"
                                name="meeting-end"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="label-input-group">
                        <label htmlFor="meeting-duration">Duration (hh:mm)</label>
                        <input disabled={isLocked} type="time" id="meeting-duration" name="meeting-duration" defaultValue="01:30"/>
                    </div>
                </div>
                <ShadowCalendarElement 
                    participantId={meetingData.participantId}
                    intervalStartDate={startDate}
                    intervalEndDate={endDate}
                />
            </div>
            <div className="meeting-settings card">
                <h1>Settings</h1>
                <div className="settings-options">
                    <div className="option-checkbox-group">
                        <label htmlFor="show-participants">Show Participants</label>
                        <input disabled={isLocked} type="checkbox" id="show-participants" name="show-participants" defaultChecked />
                    </div>
                    <div className="option-checkbox-group">
                        <label htmlFor="allow-email-participants">Allow email participants</label>
                        <input disabled={isLocked} type="checkbox" id="allow-email-participants" name="allow-email-participants" />
                    </div>
                </div>
            </div>
            
        </div>
    </form>
    <FooterBanner
        buttons={
            !useOutlet()
                ? [
                    <button
                        key="create"
                        type="button"
                        className="create-meeting-button"
                        onClick={() => formRef.current && formRef.current.requestSubmit()}
                    >
                        Create Meeting
                    </button>
                ]
                : []
        }
    />
    </>
);
}

export default CreateMeeting;