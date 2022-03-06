import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addressSelector, signerSelector, tokenSelector, providerSelector } from "../app/reducer/authSlice";
import { Button } from "react-bootstrap";
import axios from "axios";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.css";
import AIRDROP from "../abi/AirDrop.json";
import { AIRDROP_CONTRACT_ADDRESS, TOKEN_SYMBOL,TOKEN_CONTRACT_ADDRESS, DECIMAL } from "../const";
export default function Claim() {
    const address = useSelector(addressSelector);
    const signer = useSelector(signerSelector);
    const token = useSelector(tokenSelector);
    const provider = useSelector(providerSelector);
    const dispatch = useDispatch();
    const [currentAmount, setCurrentAmount] = useState(0);
    const [isClaimed, setIsClaimed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    useEffect(() => {
        const getCurrentAmount = async () => {
            try {
                const response = await axios.get("/amount/" + address);
                setCurrentAmount(response.data.amount);
                setIsClaimed(response.data.isClaimed);
            } catch (err) {
                console.log(err.response.data);
            }
        };
        getCurrentAmount();

        const airDropWatchContract = new ethers.Contract(
            AIRDROP_CONTRACT_ADDRESS,
            AIRDROP,
            provider
        );
        airDropWatchContract.on("Claim", (returnedAddress, amount) => {
            if (address.toLowerCase() == returnedAddress.toString().toLowerCase()) {
                setIsClaimed(true);
            }
        });
    }, [token]);
    useEffect(() => {
        const setClaimedToBE = async () => {
            const responsePut = await axios.put(
                "/amount/claim",
                { address: address },
                {
                    headers: {
                        "x-access-token": token,
                    },
                }
            );
        };
        if (isClaimed) {
            setClaimedToBE();
        }
    }, [isClaimed]);
    const handleClaim = async () => {
        setIsProcessing(true);
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
            const airDropContract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP, signer);
            const res = await airDropContract.claim(address, currentAmount, responsePost.data);
            if (res) {
                
            }
        } catch (err) {
            setIsProcessing(false);
            console.log(err);
            alert("Something went wrong! F12 to see err");
            
        }
    };
    const handleAddTokenToWallet = async() => {
        try {
            
            const wasAdded = await window.ethereum.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC20', 
                options: {
                  address: TOKEN_CONTRACT_ADDRESS, 
                  symbol: TOKEN_SYMBOL, 
                  decimals: DECIMAL, 
                  image: "", 
                },
              },
            });
          
            if (wasAdded) {
              console.log('Thanks for your interest!');
            } else {
              console.log('Your loss!');
            }
          } catch (error) {
            console.log(error);
          }
    }
    const handleClickTokenAddress = ()=>{
        window.open("https://testnet.bscscan.com/token/" + TOKEN_CONTRACT_ADDRESS, '_blank').focus();
    }
    return (
        <div className="Body-content">
            {isClaimed ? (
                <>
                <Button className="Main-btn" variant="success" onClick={handleAddTokenToWallet}>
                    Add To Wallet
                </Button>
                <div className="Amount-text">You have claimed: <span className="color-blue cursor-pointer" onClick={handleClickTokenAddress}>{currentAmount} {TOKEN_SYMBOL}</span></div>
                </>
            ) : (
                <>
                    {isProcessing ? (
                        <Button className="Main-btn" variant="secondary" disabled>
                            Processing
                        </Button>
                    ) : (
                        <Button className="Main-btn" variant="success" onClick={handleClaim}>
                            Claim
                        </Button>
                    )}
                    <div className="Amount-text">Click Claim to get: <span className="color-blue cursor-pointer" onClick={handleClickTokenAddress}>{currentAmount} {TOKEN_SYMBOL}</span></div>
                </>
            )}

            
        </div>
    );
}
