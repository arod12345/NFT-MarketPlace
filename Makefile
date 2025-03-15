-include .env

.PHONY:all test deploy build-sepolia build dev remove-local remove-sepolia node verify

dev :;npm run deploy &&  npm run dev

node :; npx hardhat node

build :;npm run deploy && npm run build && npm run preview

verify :; npx hardhat verify --network mainnet 

test :; npx hardhat test backend/test/NFTMarketplace.test.js

build-sepolia :;npm run deploy:sepolia && npm run build && npm run preview

remove-local :; npx hardhat clean && rm -rf backend/ignition/deployments/chain-31337 && rm -rf  src/contractsData

remove-sepolia :; npx hardhat clean && rm -rf backend/ignition/deployments/chain-11155111 && rm -rf src/contractsData