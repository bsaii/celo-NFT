import {create} from 'ipfs-http-client'
import axios from "axios";
import {Web3File, Web3Storage} from 'web3.storage'
import { Contract } from 'web3-eth-contract';
import { UseCelo } from '@celo/react-celo';
import { ChangeEvent } from 'react';

// initialize IPFS
const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID || ''
const INFURA_SECRET_KEY= process.env.NEXT_PUBLIC_INFURA_SECRET_KEY || ''
const auth =
    'Basic ' + Buffer.from(INFURA_ID + ':' + INFURA_SECRET_KEY).toString('base64');
const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

export type CreateNFTData = {
  name: string;
  description: string;
  ipfsImage: string;
  ownerAddress: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

// mint an NFT
export const createNft = async (
    minterContract: Contract,
    performActions: UseCelo['performActions'],
    {name, description, ipfsImage, ownerAddress, attributes}: CreateNFTData
) => {
    await performActions(async (kit) => {
        if (!name || !description || !ipfsImage) return;
        const defaultAccount = kit.connection.defaultAccount

        // convert NFT metadata to JSON format
        const data = JSON.stringify({
            name,
            description,
            image: ipfsImage,
            owner: defaultAccount,
            attributes,
        });

        try {

            // save NFT metadata to IPFS
            const added = await client.add(data);

            // IPFS url for uploaded metadata
            const url = `https://infura-ipfs.io/ipfs/${added.path}`;

            // mint the NFT and save the IPFS url to the blockchain
            let transaction = await minterContract.methods
                .safeMint(ownerAddress, url)
                .send({from: defaultAccount});

            return transaction;
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    });
};


// function to upload a file to IPFS
export const uploadToIpfs = async (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const added = await client.add(file, {
            progress: (prog) => console.log(`received: ${prog}`),
        });
        return `https://ipfs.infura.io/ipfs/${added.path}`;
    } catch (error) {
        console.log("Error uploading file: ", error);
    }
};

// function to upload a file to IPFS via web3.storage
export const uploadFileToWebStorage = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Construct with token and endpoint
  const token = process.env.NEXT_PUBLIC_STORAGE_API_KEY as string

   if (!token) {
    throw new Error ('A token is needed. You can create one on https://web3.storage')
  }
    const client = new Web3Storage({token})

    const file = (e.target as HTMLInputElement).files;
    if (!file) return;
    // Pack files into a CAR and send to web3.storage
    const rootCid = await client.put(file) // Promise<CIDString>
    console.log('Content added with CID: ',rootCid);

    // Fetch and verify files from web3.storage
    const res = await client.get(rootCid) // Promise<Web3Response | null>
    const files = await res?.files() as Web3File[] // Promise<Web3File[]>

    return `https://infura-ipfs.io/ipfs/${files[0].cid}`;
}

export type GetNFTs = {
  index: number;
  owner: string;
  name: string;
  image: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

// fetch all NFTs on the smart contract
export const getNfts = async (minterContract: Contract) => {
    try {
        const nfts = [];
        const nftsLength = await minterContract.methods.totalSupply().call();
        for (let i = 0; i < Number(nftsLength); i++) {
            const nft = new Promise<GetNFTs>(async (resolve) => {
                const res = await minterContract.methods.tokenURI(i).call();
                const meta = await fetchNftMeta(res);
                const owner = await fetchNftOwner(minterContract, i);
                resolve({
                    index: i,
                    owner,
                    name: meta?.data.name,
                    image: meta?.data.image,
                    description: meta?.data.description,
                    attributes: meta?.data.attributes,
                });
            });
            nfts.push(nft);
        }
        return Promise.all(nfts);
    } catch (e) {
        console.log({e});
    }
};

// get the metedata for an NFT from IPFS
export const fetchNftMeta = async (ipfsUrl: string) => {
    try {
        if (!ipfsUrl) return null;
        const meta = await axios.get(ipfsUrl);
        return meta;
    } catch (e) {
        console.log({e});
    }
};


// get the owner address of an NFT
export const fetchNftOwner = async (minterContract: Contract, index: number) => {
    try {
        return await minterContract.methods.ownerOf(index).call();
    } catch (e) {
        console.log({e});
    }
};

// get the address that deployed the NFT contract
export const fetchNftContractOwner = async (minterContract: Contract) => {
    try {
        let owner = await minterContract.methods.owner().call();
        return owner;
    } catch (e) {
        console.log({e});
    }
};