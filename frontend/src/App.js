import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Register from "./components/Register.jsx";
import Claim from "./components/Claim.jsx";
import { Provider as ReduxProvider } from "react-redux";
import { useSelector } from "react-redux";
import {
    tokenSelector,
} from "./app/reducer/authSlice";
function App() {
    const token = useSelector(tokenSelector);
    return (
        <Router>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={<div className="App">{token ? <Claim /> : <div>Connect Metamask first</div>}</div>}
                ></Route>
            </Routes>
        </Router>
    );
}

export default App;
