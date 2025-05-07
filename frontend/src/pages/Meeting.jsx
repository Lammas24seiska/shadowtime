import React from 'react';
import { Outlet } from 'react-router-dom';
import Banner from '../components/Banner';
import './css/Meeting.css';

const Meeting = () => {
    return (
        <div className="screen">
            <Banner/>
            <Outlet/>
        </div>
    );
};

export default Meeting;