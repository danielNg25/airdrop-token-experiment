import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Register from "./components/Register.jsx";
import Claim from "./components/Claim.jsx";
function App() {
    return (
      <Router>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="App">
                            <Claim />
                            
                        </div>
                    }
                ></Route>
            </Routes>
        </Router>
    );
}

export default App;
