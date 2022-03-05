import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addressSelector, signerSelector, tokenSelector } from "../app/reducer/authSlice";
import { Button } from "react-bootstrap";
import axios from "axios";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.css";
import AIRDROP from "../abi/AirDrop.json";
export default function Claim() {
    const address = useSelector(addressSelector);
    const signer = useSelector(signerSelector);
    const token = useSelector(tokenSelector);
    const dispatch = useDispatch();
    const [currentAmount, setCurrentAmount] = useState(0);
    const [isClaimed, setIsClaimed] = useState(0);
    useEffect(() => {
        const getCurrentAmount = async () => {
            try {
                const response = await axios.get("/amount/" + address);
                setCurrentAmount(response.data.amount);
                setIsClaimed(response.data.isClaimed);
                console.log(response.data.isClaimed);
            } catch (err) {
                console.log(err.response.data);
            }
        };
        getCurrentAmount();
    }, [token]);

    const handleClaim = async () => {
        try {
            const responsePost = await axios.post(
                "/amount/claim",
                {
                    address: address,
                },
                {
                    headers: {
                        "x-access-token": token,
                    },
                }
            );
            console.log(responsePost.data);
            const airDropContract = new ethers.Contract("0x4308251514f5215504ea644A936167adDe994d91", AIRDROP, signer);
            const res = await airDropContract.redeem(address, currentAmount, responsePost.data);
            if (res) {
                const responsePut = await axios.put(
                    "/amount/claim",
                    { address: address },
                    {
                        headers: {
                            "x-access-token": token,
                        },
                    }
                );
            }
        } catch (err) {
            console.log(err);
            alert(err.response.data);
        }
    };

    return (
        <div className="Body-content">
            {isClaimed ? (
                <Button className="Main-btn" variant="secondary" disabled>
                    Claimed
                </Button>
            ) : (
                <Button className="Main-btn" variant="success" onClick={handleClaim}>
                    Claim
                </Button>
            )}

            <div className="Amount-text">Your current amount: {currentAmount} NDT</div>
        </div>
    );
}
