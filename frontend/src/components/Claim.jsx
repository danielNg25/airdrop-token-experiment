import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addressSelector, signerSelector, tokenSelector } from "../app/reducer/authSlice";
import { Button } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
export default function Claim() {
    const address = useSelector(addressSelector);
    const signer = useSelector(signerSelector);
    const token = useSelector(tokenSelector);
    const dispatch = useDispatch();
    const [currentAmount, setCurrentAmount] = useState(0);
    useEffect(() => {
      const getCurrentAmount = async () => {
          try {
              const response = await axios.get("/amount/" + address);
              setCurrentAmount(response.data.amount);
          } catch (err) {
              console.log(err.response.data);
          }
      };
      getCurrentAmount();
  }, [token]);
    return (
        <div className="Body-content">
            <Button className="Main-btn" variant="success">
                Claim
            </Button>
            <div className="Amount-text">Your current amount: {currentAmount} NDT</div>
        </div>
    );
}
