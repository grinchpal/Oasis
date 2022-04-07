import { Container } from "react-bootstrap";
//import Signup from "./SignupComponent/Signup";
import users from "./SignupComponent/users";

export default function Account() {
    return (
        <>
            <users />
            <Container className="d-flex aligh-item-center justify-content-center" style={{ midHeight: "100vh" }}>
            </Container>
        </>
    );
}