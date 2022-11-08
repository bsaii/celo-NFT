import { ethers } from "hardhat";

// MyCELONFT deployed to: 0xe58830d1a4a5Dc6691c5Fd504BAa002FBd1805E1

async function main() {
  const MyNFT = await ethers.getContractFactory("MyCELONFT");
  const myNFT = await MyNFT.deploy();

  await myNFT.deployed();

  console.log(`MyCELONFT deployed to: ${myNFT.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
