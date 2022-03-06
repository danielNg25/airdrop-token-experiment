import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import {
    addressSelector,
    tokenSelector,
    setAddress,
    setSigner,
    setToken,
    setProvider
} from "../app/reducer/authSlice";

import axios from "axios";
export default function Header() {
    const address = useSelector(addressSelector);
    const token = useSelector(tokenSelector);

    const dispatch = useDispatch();

    const hanldeCreateUser = async (userAddress) => {
        try {
            const response = await axios.post("/auth/register", {
                address: userAddress,
            });
        } catch (err) {
            console.log(err.response);
            return;
        }
    };

    const handleAuthenticate = async (userAddress, signature) => {
        try {
            const response = await axios.post("/auth/authenticate", {
                address: userAddress,
                signature: signature,
            });
            return response.data.accessToken;
        } catch (err) {
            console.log(err.response);
            return;
        }
    };

    const handleSignMessage = async (etherSigner, nonce) => {
        const signature = await etherSigner.signMessage("Register to Truong's airdrop with nonce: " + nonce);
        return signature;
    };

    const handleOnclickConnect = async () => {
        if (typeof window.ethereum == "undefined") {
            console.log("MetaMask is not installed!");
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        const account = accounts[0];
        dispatch(setAddress(accounts[0]));
        const ethersSigner = provider.getSigner();
        dispatch(setAddress(account));
        dispatch(setSigner(ethersSigner));
        dispatch(setProvider(provider));
        console.log(account);
        let response;
        try {
            response = await axios.post("/auth/get-nonce", {
                address: account,
            });
            
        } catch (err) {
            console.log(err.response);
            if (err.response.status == 406) {
                await hanldeCreateUser(account);
                response = await axios.post("/auth/get-nonce", {
                    address: account,
                });
            }
        }finally{
            const signature = await handleSignMessage(ethersSigner, response.data.nonce);
            const accessToken = await handleAuthenticate(account, signature);
            if(accessToken){
              dispatch(setToken(accessToken));
            }else{
              console.log("Invalid Signature!")
            }
        }
    };

   
    return (
        <div className="Header">
            <div className="Header-title ">AIR DROP</div>
            {token == null ? (
                <Button variant="danger" className="Connect-btn" onClick={handleOnclickConnect}>
                    Connect
                </Button>
            ) : (
                <div className="Connect-btn">{address.slice(0, 5) + "..." + address.slice(38, 42)}</div>
            )}
        </div>
    );
}
