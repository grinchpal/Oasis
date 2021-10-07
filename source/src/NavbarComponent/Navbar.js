import './Navbar.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import test from '../TestPage/test';
import test2 from '../TestPage/test2';

function setRoute(path) {
    window.location.href = path;
}

function addRoute(path) {
    window.location.href = window.location.pathname + path;
}

function Navbar() {
    return (
        <>
            <div>
                <Router>
                    <ul>
                        <li>
                            <a onClick={() => setRoute('/test')}>Test</a>
                        </li>
                        <li>
                            <a onClick={() => addRoute('/test2')}>Test2</a>
                        </li>
                    </ul>
                    <Route path="/test" component={test} />
                    <Route path="/test2" component={test2} />
                </Router>
            </div>
        </>
    );
}

export default Navbar;