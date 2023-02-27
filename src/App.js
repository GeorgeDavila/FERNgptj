import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";
import Wryyt from "./Wryyt";
import TTSreader from "./TTSreader";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/wryyt" element={<Wryyt />} />
          <Route exact path="/read" element={<TTSreader />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
