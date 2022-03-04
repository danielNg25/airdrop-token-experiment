import React from 'react'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import { ethers } from 'ethers';
export default function Header() {


  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");
  async function requestAccount() {
    console.log('Requesting account...');
    if(window.ethereum) {
      console.log('detected');

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (error) {
        console.log('Error connecting...');
      }

    } else {
      alert('Meta Mask not detected');
    }
  }

  // Create a provider to interact with a smart contract
  async function connectWallet() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      await ethersProvider.send("eth_requestAccounts", []);
      const signer = ethersProvider.getSigner();
      setProvider(ethersProvider);
      console.log(signer);
    }
  }
  return (
    <div className='Header'>
        <div className='Header-title '>AIR DROP</div>
        <Button variant="danger" className='Connect-btn' onClick={connectWallet}>Connect</Button>
    </div>
  )
}
