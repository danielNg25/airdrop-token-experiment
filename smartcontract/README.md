# Air Drop Contract

### Deployed Test contract


[Bsc Testnet](https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain)

| Contract | Address |
| -------- | ------- |
| AirDrop | [0xF36a873143F6A2a0363D5624E0267AC84bAD7Db5](https://testnet.bscscan.com/address/0xF36a873143F6A2a0363D5624E0267AC84bAD7Db5#code) |
| Token | [0xD6F42102D592061f273FAa8c6de20DeafC03AF49](https://testnet.bscscan.com/address/0xD6F42102D592061f273FAa8c6de20DeafC03AF49#code) |

Faucet to get free BNB testnet: https://testnet.binance.org/faucet-smart

### How to use
Test
```
npx hardhat test
```

Deploy
```
npx hardhat run scripts/deploy.ts --network <<network>>
```

Verify 
```
npx hardhat verify --network <<network>> DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```


