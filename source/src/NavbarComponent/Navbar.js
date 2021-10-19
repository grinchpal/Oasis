import './Navbar.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Resources from '../ResourcesPageComponent/Resources';
import Account from '../AccountPageComponent/Account';
import Map from '../LandingPageComponent/Map';
import OasisLogo from '../assets/oasisLogo.PNG';

function setRoute(path) {
    window.location.href = path;
}

export default function Navbar() {
    //const heightWidthRatio = 538 / 485; //prevent distortion
    //const logoHeight = 50; //in pixels
    //const logoWidth = logoHeight * heightWidthRatio;
    return (
        <>
            <Router>
                <ul>
                    <button className="logo" onClick={() => setRoute('/')}>
                        <img src={OasisLogo} alt="Oasis" />
                    </button>
                    <li>
                        <button onClick={() => setRoute('/resources')}>Resources</button>
                    </li>
                    <li className="rightPadding">
                        <button onClick={() => setRoute('/account')}>Account</button>
                    </li>
                </ul>

                <Route exact path="/resources" component={Resources} />
                <Route exact path="/account" component={Account} />
                <Route exact path="/" component={Map} />
            </Router>
        </>

    );
}