import hre from "hardhat"

const {ethers} = hre

const URI="https://arb-mainnet.g.alchemy.com/v2/LAMMU-hnOlNUzvFAqaNI7euqUJoxMDlr"

const provider=new ethers.JsonRpcProvider(URI)

const wallet=new ethers.Wallet("wallet Address",provider)

const signtaure = await wallet.signMessage("It is hereby declared,on 2025/01/16,that I/we own the address 0x2ab74df18b051faa89ac97626713c7c8f22f01ee.Serial Code:791462");

console.log(signtaure)