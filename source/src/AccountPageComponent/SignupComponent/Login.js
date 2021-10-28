// import {useRef} from 'react'
// import {Form, Button, Card } from 'react-bootstrap'

// import React from 'react'

// export default function Signup() {
    
//     const emailRef=useRef()
//     const passwordRef=useRef()
//     const passwordConfirmRef=useRef()

//     return (
//         <>
//            <Card.Body>
//                 <h2 className = "text-center mb-4">Sign Up</h2>
//                 <Form>
//                     <Form.Group id="email">
//                         <Form.Label>Email</Form.Label>
//                         <Form.Control type="email" ref = {emailRef} required />
//                     </Form.Group>
//                     <Form.Group id="password">
//                         <Form.Label>Password</Form.Label>
//                         <Form.Control type="password" ref = {passwordRef} required />
//                     </Form.Group>
//                     <Form.Group id="password-confirm">
//                         <Form.Label>Password Confirmation</Form.Label>
//                         <Form.Control type="password" ref = {passwordConfirmRef} required />
//                     </Form.Group>
//                     <Button className="w-100" type="submit">Sign Up</Button>
//                 </Form>
//            </Card.Body>
//            <div className="w-100 text-center mt-2">
//                Already have an account? Log In
//            </div>
//         </>
//     )
// }

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) history.replace("/dashboard");
  }, [user, loading]);
  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => signInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Login;