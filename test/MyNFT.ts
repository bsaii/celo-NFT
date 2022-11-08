import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyCELONFT", function () {
  this.timeout(50000);

  let myNFT: { owner: () => any; balanceOf: (arg0: any) => any; connect: (arg0: any) => { (): any; new(): any; safeMint: { (arg0: any, arg1: string): any; new(): any; }; }; tokenURI: (arg0: number) => any;};
  let owner: { address: any; };
  let acc1: { address: any; };
  let acc2: { address: any; };

  this.beforeEach(async function() {
      // This is executed before each test
      // Deploying the smart contract
      const MyNFT = await ethers.getContractFactory("MyCELONFT");
      [owner, acc1, acc2] = await ethers.getSigners();

      myNFT = await MyNFT.deploy();
  })

  it("Should set the right owner", async function () {
      expect(await myNFT.owner()).to.equal(owner.address);
  });

  it("Should mint one NFT", async function() {
      expect(await myNFT.balanceOf(acc1.address)).to.equal(0);
      
      const tokenURI = "https://example.com/1"
      const tx = await myNFT.connect(owner).safeMint(acc1.address, tokenURI);
      await tx.wait();

      expect(await myNFT.balanceOf(acc1.address)).to.equal(1);
  })

  it("Should set the correct tokenURI", async function() {
      const tokenURI_1 = "https://example.com/1"
      const tokenURI_2 = "https://example.com/2"

      const tx1 = await myNFT.connect(owner).safeMint(acc1.address, tokenURI_1);
      await tx1.wait();
      const tx2 = await myNFT.connect(owner).safeMint(acc2.address, tokenURI_2);
      await tx2.wait();

      expect(await myNFT.tokenURI(0)).to.equal(tokenURI_1);
      expect(await myNFT.tokenURI(1)).to.equal(tokenURI_2);
  })
});