-include .env

.PHONY:all test deploy build-sepolia build dev remove-local remove-sepolia node verify

dev :;npm run deploy &&  npm run dev

node :; npx hardhat node

build :;npm run deploy && npm run build && npm run preview

verify-NFT :; npx hardhat verify --network sepolia 0x2906DEbC139f8334c37a58bCC888EdA87D854B3d 

verfiy-Marketplace :; npx hardhat verify --network sepolia 0x07E51342511b6d7ce815D1EE8C8A7E6F0003308A "1"

verfiy-All :; make verify-NFT && make verfiy-Marketplace

test :; npx hardhat test backend/test/NFTMarketplace.test.js

build-sepolia :;npm run deploy:sepolia && npm run build && npm run preview

remove-local :; npx hardhat clean && rm -rf backend/ignition/deployments/chain-31337 && rm -rf  src/contractsData

remove-sepolia :; npx hardhat clean && rm -rf backend/ignition/deployments/chain-11155111 && rm -rf src/contractsData

remove-all :; make remove-local && make remove-sepolia