import React from 'react';
import "./css/FooterBanner.css";

const FooterBanner = ({buttons}) => {
    return (
        <div className="footer-banner">
            {buttons.map((button, index) => (
                <React.Fragment key={index}>{button}</React.Fragment>
            ))}
        </div>
    );
};

export default FooterBanner;