import './App.css';
import './index.css';
import {BrowserRouter as Router, RouteProps, Route, Link } from "react-router-dom";
//components
import Navbar from './NavbarComponent/Navbar';

export default function App() {
  return (
    <>
      <div className="basePage">
        <Navbar />
      </div>
    </>
  );
}
