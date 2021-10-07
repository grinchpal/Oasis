import './Navbar.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import test from '../TestPage/test';
import test2 from '../TestPage/test2';

function setRoute(path) {
    window.location.href = path;
}

function Navbar() {
    return (
        <>
            <Router>
                <ul>
                    <a className="logo" onClick={() => setRoute('/')}>Oasis</a>
                    <li>
                        <a onClick={() => setRoute('/test')}>Test</a>
                    </li>
                    <li>
                        <a onClick={() => setRoute('/test2')}>Test2</a>
                    </li>
                </ul>
                <Route exact path="/test" component={test} />
                <Route exact path="/test2" component={test2} />
            </Router>
        </>

    );
}

export default Navbar;