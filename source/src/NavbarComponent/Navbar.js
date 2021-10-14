import './Navbar.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Resources from '../ResourcesPageComponent/Resources';
import Account from '../AccountPageComponent/Account';
import Map from '../LandingPageComponent/Map';

function setRoute(path) {
    window.location.href = path;
}

export default function Navbar() {
    return (
        <>
            <Router>
                <ul>
                    <a className="logo" onClick={() => setRoute('/')}>Oasis</a>
                    <li>
                        <a onClick={() => setRoute('/resources')}>Resources</a>
                    </li>
                    <li>
                        <a onClick={() => setRoute('/account')}>Account</a>
                    </li>
                </ul>
                <Route exact path="/resources" component={Resources} />
                <Route exact path="/account" component={Account} />
                <Route exact path="/" component={Map} />
            </Router>
        </>

    );
}