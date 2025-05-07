import React from 'react';
import './css/Banner.css'; 
import { Link } from 'react-router-dom';

// TODO: implement login and signup functionality

const Banner = () => {
    return (
        <div className="banner">
            <Link to="/">ShadowTime</Link>
            <div className="login-signup">
                <button className="login-button">Login</button>
                <button className="signup-button">Sign Up</button>
            </div>
        </div>
    );
};

export default Banner;