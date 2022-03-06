import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Register from "./components/Register.jsx";
import Claim from "./components/Claim.jsx";
import { useSelector } from "react-redux";
import { tokenSelector } from "./app/reducer/authSlice";
import { STARTING_DAY } from "./const";
import { convertToUnixTime } from "./utils.ts";
function App() {
    const token = useSelector(tokenSelector);
    return (
        <Router>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="App">
                            {" "}
                            {token ? (
                                <>{convertToUnixTime(Date.now()) > STARTING_DAY ? <Claim /> : <Register />}</>
                            ) : (
                                <div className="margin-top-5percent Random-amount"> Connect Metamask first </div>
                            )}
                        </div>
                    }
                ></Route>{" "}
            </Routes>{" "}
        </Router>
    );
}

export default App;
