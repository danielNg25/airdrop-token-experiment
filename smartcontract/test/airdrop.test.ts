import chai, { expect } from 'chai';
import { ethers } from 'hardhat';
import { solidity } from 'ethereum-waffle';
import { Contract, ContractFactory, BigNumber, utils } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { SignerWithAddress } from 'hardhat-deploy-ethers/dist/src/signer-with-address';

import {
    ADDRESS_ZERO,
    advanceBlock,
    advanceTimeAndBlock,
    expandDecimals,
    MAX_UINT256,
    getLatestBlockTime,
    setNextBlockTimestamp,
    toWei,
    mineBlock,
    mineOneBlock,
    fromWei,
    
} from './shared/utils';
import { Address } from 'hardhat-deploy/dist/types';

chai.use(solidity);


describe("AirDrop.test", () => {
    const { provider } = ethers;
    const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
    const ZERO_BYTES = "0x0000000000000000000000000000000000000000000000000000000000000000"
    const decimals = 0;
    let operator: SignerWithAddress;
    let bob: SignerWithAddress;
    let carol: SignerWithAddress;
    let david: SignerWithAddress;
    let emma: SignerWithAddress;

    before('provider & accounts setting', async() => {
        // @ts-ignore
        [operator, bob, carol, david, emma] = await ethers.getSigners();
    });

    // core
    let AirDrop: ContractFactory;
    let MockERC20: ContractFactory;

    before('fetch contract factories', async() => {
        AirDrop = await ethers.getContractFactory('AirDrop');
        MockERC20 = await ethers.getContractFactory('MockERC20');
    });

    let airdrop: Contract;
    let token: Contract;
    let startingTime: BigNumber;
    before('deploy contracts', async() => {
        startingTime = BigNumber.from(await getLatestBlockTime(ethers)).add(3600);
        token = await MockERC20.connect(operator).deploy();
        airdrop = await AirDrop.connect(operator).deploy();
        await token.connect(operator).transfer(airdrop.address, expandDecimals(1000, decimals));
        await airdrop.connect(operator).initialize(startingTime, token.address, bob.address);
    });

    describe('#constructor', () => {
        it('should works correctly', async() => {
            expect(String(await airdrop.startingTime())).to.eq(startingTime.toString());
            expect(String(await token.balanceOf(airdrop.address))).to.eq(expandDecimals(1000, decimals).toString());
            expect(String(await airdrop.hasRole(MINTER_ROLE, bob.address))).to.eq('true');
        });
        
    });
    
    const sign = async(amountToSign:BigNumber, addressToSign:Address) => {
        const signature = await bob._signTypedData(
            // Domain
            {
                name: "Truong",
                version: "1.0.0",
                chainId: "1",
                verifyingContract: airdrop.address
            },
            // Types
            {
                TruongsAirDrop: [
                    { name: "amount", type: "uint256" },
                    { name: "account", type: "address" }
                ],
            },
            // Values
            {
                amount: amountToSign,
                account: addressToSign
            }
        )
        return signature;
    }
    describe('#claim airdrop', () =>{
        const amount = expandDecimals(100, decimals);
        const bigAmount = expandDecimals(10000, decimals);
        console.log(amount);
        it('should fail if claim too early', async()=>{
            await expect(airdrop.connect(carol).claim(carol.address, amount, ZERO_BYTES)).to.revertedWith('Too early');
        });
        it('should fail if provide wrong signature', async()=>{
            const signature = await sign(amount, david.address);
            await setNextBlockTimestamp(ethers, startingTime.toNumber() + 300);
            await expect(airdrop.connect(carol).claim(carol.address, amount, signature)).to.revertedWith('Invalid signature');
        })
        it('should claim successfully', async()=>{
            const signature =await sign(amount, carol.address);
            await expect(airdrop.connect(carol).claim(carol.address, amount, signature)).to.emit(airdrop, "Claim");
        });
        it('should failed if claim twice', async()=>{
            const signature =await sign(amount, carol.address);
            await expect(airdrop.connect(carol).claim(carol.address, amount, signature)).to.revertedWith('You have received this Air Drop');
        });
        it('should failed if out of tokens', async()=>{
            const signature =await sign(bigAmount, david.address);
            await expect(airdrop.connect(david).claim(david.address, bigAmount, signature)).to.revertedWith('Out of token');
        });
    })
})