import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import AddNfts from './Add';
import NftCard from './Card';
import Loader from '../ui/Loader';
import { NotificationSuccess, NotificationError } from '../ui/Notifications';
import {
  getNfts,
  createNft,
  fetchNftContractOwner,
  GetNFTs,
  CreateNFTData,
} from '../../utils/minter';
import { Row } from 'react-bootstrap';
import { Contract } from 'web3-eth-contract';
import { useCelo } from '@celo/react-celo';

type NFTListProps = {
  minterContract: Contract;
  name: string;
};

const NftList = ({ minterContract, name }: NFTListProps) => {
  /* performActions : used to run smart contract interactions in order
   * address : fetch the address of the connected wallet
   */
  const { performActions, address } = useCelo();
  const [nfts, setNfts] = useState<GetNFTs[]>([]);
  const [loading, setLoading] = useState(false);
  const [nftOwner, setNftOwner] = useState<string>();

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allNfts = await getNfts(minterContract);
      if (!allNfts) return;
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [minterContract]);

  const addNft = async (data: CreateNFTData) => {
    try {
      setLoading(true);

      // create an nft functionality
      await createNft(minterContract, performActions, data);
      toast(<NotificationSuccess text='Updating NFT list....' />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text='Failed to create an NFT.' />);
    } finally {
      setLoading(false);
    }
  };

  const fetchContractOwner = useCallback(async (minterContract: Contract) => {
    // get the address that deployed the NFT contract
    const _address = await fetchNftContractOwner(minterContract);
    setNftOwner(_address);
  }, []);

  useEffect(() => {
    try {
      if (address && minterContract) {
        getAssets();
        fetchContractOwner(minterContract);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, address, getAssets, fetchContractOwner]);
  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <h1 className='fs-4 fw-bold mb-0'>{name}</h1>

              {/* give the add NFT permission to user who deployed the NFT smart contract */}
              {nftOwner?.toLowerCase() === address ? (
                <AddNfts save={addNft} address={address} />
              ) : null}
            </div>
            <Row xs={1} sm={2} lg={3} className='g-3  mb-5 g-xl-4 g-xxl-5'>
              {/* display all NFTs */}
              {nfts.map((_nft) => (
                <NftCard
                  key={_nft.index}
                  nft={{
                    ..._nft,
                  }}
                />
              ))}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

export default NftList;
