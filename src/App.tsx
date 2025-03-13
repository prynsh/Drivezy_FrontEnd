
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/DashBoard";
import Signin from "./components/signIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;