import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { addressSelector, tokenSelector } from "../app/reducer/authSlice";
import axios from "axios";
import { TOKEN_SYMBOL, DAY_UNIX, STARTING_DAY, TOKEN_CONTRACT_ADDRESS } from "../const";
import { convertUnixTimeToHuman, convertToUnixTime } from "../utils.ts";
import "bootstrap/dist/css/bootstrap.css";
export default function Register() {
    const address = useSelector(addressSelector);
    const token = useSelector(tokenSelector);
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
                if (nextTimeRegister < convertToUnixTime(Date.now())) {
                    setCanRegister(true);
                }
            } catch (err) {
                console.log(err.response.data);
            }
        };

        getCurrentAmount();
    }, [token]);

    const handleRegister = async () => {
        
        try {
            const response = await axios.put(
                "/amount",
                {},
                {
                    headers: {
                        "x-access-token": token,
                    },
                }
            );
            setTokenToAdd(response.data.addedAmount);
            setCurrentAmount(response.data.amount);
            const nextTimeRegister = response.data.lastTime + DAY_UNIX;
            setNextTime(nextTimeRegister);
            if (nextTimeRegister > convertToUnixTime(Date.now())) {
                setCanRegister(false);
            }
        } catch (err) {
            if ((err.response.status = 406)) {
                alert("It's not time to register yet");
            }
        }
    };
    const handleClickTokenAddress = ()=>{
        window.open("https://testnet.bscscan.com/token/" + TOKEN_CONTRACT_ADDRESS, '_blank').focus();
    }
    return (
        <div className="Body-content">
            <div className="flex-9"> 
                {canRegister ? (
                    <>
                        <Button className="Main-btn" variant="success" onClick={handleRegister}>
                            Register
                        </Button>
                        <div className="Random-amount">Click to register to Airdrop (Random 1-100)!</div>
                    </>
                ) : (
                    <div className="Next-time-text">Comeback at: <span className="color-firebrick">{convertUnixTimeToHuman(nextTime)}</span> to Register</div>
                )}
                {tokenToAdd != 0 && (
                    <div className="Random-amount">
                        {tokenToAdd} {TOKEN_SYMBOL} have added to your account!
                    </div>
                )}

                <div className="Amount-text">
                    Your current amount: <span className="color-blue cursor-pointer" onClick={handleClickTokenAddress}>{currentAmount} {TOKEN_SYMBOL}</span> 
                </div>
            </div>

            <div className="Claim-time flex-1">Tokens can be claimed at {convertUnixTimeToHuman(STARTING_DAY)}</div>
        </div>
    );
}
