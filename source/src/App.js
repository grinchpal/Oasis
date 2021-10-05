import logo from './logo.svg';
import './App.css';
import Signup from './SignupComponent/Signup';
import { Container } from "react-bootstrap"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. dddd
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Container className="d-flex aligh-item-center justify-content-center" style ={{midHeight:"100vh"}}>
        <Signup/>
      </Container>
    </div>
  );
}

export default App;
