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

import React from "react"; 
import { auth, provider } from "../../firebase-config.js";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuth }) {
  let navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      navigate("/");
    });
  };

  return (
    <div className="loginPage">
      <p>Sign In With Google to Continue</p>
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
