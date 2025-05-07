import React from 'react';
import { Link } from 'react-router-dom';

// TODO: create a proper 404 page

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound;