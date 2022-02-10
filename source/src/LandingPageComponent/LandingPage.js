import './LandingPage.css';
import Filters from './FiltersComponent/Filters';
import Map from './MapComponent/Map';
import CreatePost from '../AccountPageComponent/SignupComponent/CreatePost';
// import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "../AccountPageComponent/SignupComponent/Home";

import Login from "../AccountPageComponent/SignupComponent/Login";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
export default function LandingPage() {
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

    const signUserOut = () => {
      signOut(auth).then(() => {
        localStorage.clear();
        setIsAuth(false);
        window.location.pathname = "/login";
      });
    };
    return (
        <Router>
            <div className="modal-body row">
                <div className="col-lg-3 col-md-3 col-sm-3">
                    <h3>I am looking for...</h3>
                    <Filters />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-3">
                    <Map />
                </div>
                <div className="col-lg-3 col-md-3 col-sm-3">
                    <h3 className="center">Results</h3>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-3">
                    <CreatePost />
                </div>
            </div>
            <Routes>
                <Route path="/" element={<Home isAuth={isAuth} />} />
                <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
                <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
            </Routes>
      
            </Router> 
            
    );
}