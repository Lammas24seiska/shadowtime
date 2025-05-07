import React from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';

// TODO: create a proper non-chatgpt main menu

const Home = () => {
    return (
        <div>
            <Banner/>
            <div>
                Welcome to the main menu! This section provides an overview of the features available on this page. 
                You can use this menu to navigate through various options and perform different actions. 
                Whether you're here to plan a meeting, check your schedule, or explore other functionalities, 
                this is the starting point for all your activities.

                Planning a meeting has never been easier. With just a few clicks, you can set up a meeting, 
                invite participants, and manage your agenda. This feature is designed to save you time and 
                make your workflow more efficient.

                If you're new here, take a moment to familiarize yourself with the layout and options available. 
                Each section is designed to be intuitive and user-friendly, ensuring that you can accomplish 
                your tasks without any hassle.
            </div>
            <Link to="/meeting/create">
                <button className="plan-meeting">Plan meeting</button>
            </Link>
            <div>
                After clicking the "Plan meeting" button, you'll be guided through a step-by-step process 
                to create a meeting. This process includes selecting a date and time, adding participants, 
                and specifying the agenda. Make sure to double-check all the details before finalizing your meeting.

                Once your meeting is planned, you can view it in your schedule. The schedule feature allows you 
                to keep track of all your upcoming meetings and events. You can also edit or cancel meetings 
                if your plans change.

                Remember, effective planning is key to successful meetings. Use the tools provided here to 
                ensure that your meetings are productive and well-organized.
            </div>
            <div>
                In addition to planning meetings, this page offers a variety of other features. For example, 
                you can access your personal profile to update your information or change your settings. 
                You can also explore the help section for tips and tutorials on how to use this platform effectively.

                If you have any questions or encounter any issues, don't hesitate to reach out to our support team. 
                We're here to help you make the most of your experience. You can contact us via email, phone, 
                or live chat.

                Thank you for choosing our platform. We hope you find it useful and enjoyable to use. 
                Your feedback is always welcome, so feel free to share your thoughts and suggestions with us.
            </div>
        </div>
    );
};

export default Home;