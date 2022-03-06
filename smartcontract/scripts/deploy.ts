import { ethers } from 'hardhat';
import {config as dotEnvConfig} from "dotenv";

dotEnvConfig();
async function main() {
    // We get the contract to deploy
    
    const AirDrop = await ethers.getContractFactory("AirDrop");
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockerc20 = await MockERC20.deploy();
    const airdrop = await AirDrop.deploy();
    
    console.log("airdrop deployed to:", airdrop.address);
    console.log("mockerc20 deployed to:", mockerc20.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });