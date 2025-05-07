import React from 'react';
import { Outlet } from 'react-router-dom';
import Banner from '../components/Banner';

const Meeting = () => {
    return (
        <div>
            <Banner/>
            <Outlet/>
        </div>
    );
};

export default Meeting;