# Airdrop Token
### What is this?
A demo project for airdrop token purpose.
### How it works
Before airdrop's starting time, user can register for airdrop once per day to get 1 to 100 tokens until the airdrop start.  
When the airdrop start, user can claim the amount of tokens they have registered.

This project using "Signature" method: Receiver who have registed for airdrop will get a signed message with the minter's private key from backend and then use that message to claim token from smart contract. Smart contract will verify that message to check if the request is valid.

### Demo
Video: https://youtu.be/g0ox9IIRuok  
App: https://airdrop-demo.herokuapp.com/ 
