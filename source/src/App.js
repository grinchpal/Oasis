import './App.css';
import './index.css';
import { Container } from "react-bootstrap"
//components
import Map from './MapComponent/Map';
import Signup from './SignupComponent/Signup';

function App() {
  return (
    <main>
      <Signup/>
      <Container className="d-flex aligh-item-center justify-content-center" style ={{midHeight:"100vh"}}>
        <Signup/>
      </Container>
    </main>
  );
}

export default App;
