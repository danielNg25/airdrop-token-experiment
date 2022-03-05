import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addressSelector, signerSelector, tokenSelector } from "../app/reducer/authSlice";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
export default function Register() {
    const address = useSelector(addressSelector);
    const signer = useSelector(signerSelector);
    const token = useSelector(tokenSelector);
    const dispatch = useDispatch();
    const DAY_UNIX = 86400;
    const [currentAmount, setCurrentAmount] = useState(0);
    const [tokenToAdd, setTokenToAdd] = useState(0);
    const [nextTime, setNextTime] = useState(0);
    const [canRegister, setCanRegister] = useState(false);
    useEffect(() => {
        const getCurrentAmount = async () => {
            try {
                const response = await axios.get("/amount/" + address);
                setCurrentAmount(response.data.amount);
                const nextTimeRegister = response.data.lastTime + DAY_UNIX;
                setNextTime(nextTimeRegister);
                if (nextTimeRegister < Math.floor(Date.now() / 1000)) {
                    setCanRegister(true);
                }
            } catch (err) {
                console.log(err.response.data);
            }
        };
        getCurrentAmount();
    }, [token]);

    const handleRegister = async () => {
        const randomTokenAmount = Math.floor(Math.random() * 100) + 1;
        setTokenToAdd(randomTokenAmount);
        console.log(token);
        try {
            const response = await axios.put(
                "/amount",
                {
                    amount: randomTokenAmount,
                },
                {
                    headers: {
                        "x-access-token": token,
                    },
                }
            );
            setCurrentAmount(response.data.amount);
            const nextTimeRegister = response.data.lastTime + DAY_UNIX;
            setNextTime(nextTimeRegister);
            if (nextTimeRegister > Math.floor(Date.now() / 1000)) {
                setCanRegister(false);
            }
        } catch (err) {
            if ((err.response.status = 406)) {
                alert("It's not time to register yet");
            }
        }
    };

    const convertUnixTime = (unixTimeStamp) => {
        const date = new Date(unixTimeStamp * 1000);
        return date.toLocaleString();
    };

    return (
        <div className="Body-content">
            {canRegister ? (
                <>
                    <Button className="Main-btn" variant="success" onClick={handleRegister}>
                        Register
                    </Button>
                    <div className="Random-amount">Click to register to Airdrop (Random 1-100)!</div>
                </>
            ) : (
                <div className="Next-time-text">Next time at: {convertUnixTime(nextTime)}</div>
            )}
            {tokenToAdd != 0 && <div className="Random-amount">{tokenToAdd} NDT have added to your account!</div>}

            <div className="Amount-text">Your current amount: {currentAmount} NDT</div>

            <div className="Claim-time">Tokens can be claimed at {convertUnixTime(1646482969)}</div>
        </div>
    );
}
