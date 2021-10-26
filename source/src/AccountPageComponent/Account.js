import { Container } from "react-bootstrap";
import Signup from "./SignupComponent/Signup";

export default function Account() {
    return (
        <>
            <Signup />
            <Container className="d-flex aligh-item-center justify-content-center" style={{ midHeight: "100vh" }}>
            </Container>
        </>
    );
}