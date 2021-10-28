import Login from "./SignupComponent/Login";
import Register from "./SignupComponent/Register";
import Dashboard from "./SignupComponent/Dashboard"; 
import Reset from "./SignupComponent/Reset";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Switch } from "react-router";
import React from 'react'
import ReactDOM from 'react-dom'
export default function Account() {
    return (
        <>
        {/* //     <Signup />
        //     <Container className="d-flex aligh-item-center justify-content-center" style={{ midHeight: "100vh" }}>
        //     </Container> */}
    
        <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/reset" component={Reset} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
      </>
    );
}