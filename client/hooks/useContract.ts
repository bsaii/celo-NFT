import { useCelo } from '@celo/react-celo';
import { useState, useEffect, useCallback } from 'react';
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract';

import MyCELONFTAbi from '../utils/MyCELONFT.json'
const MyCELONFTContractAddress = '0xe58830d1a4a5Dc6691c5Fd504BAa002FBd1805E1'

export const useContract = (abi: AbiItem | AbiItem[], contractAddress: string | undefined) => {
  const { getConnectedKit, address } = useCelo();
  const [contract, setContract] = useState<Contract>();

  const getContract = useCallback(async () => {
    const kit = await getConnectedKit();

    // get a contract interface to interact with
    setContract(new kit.connection.web3.eth.Contract(abi, contractAddress) as unknown as Contract);
  }, [getConnectedKit, abi, contractAddress]);

  useEffect(() => {
    if (address) getContract();
  }, [address, getContract]);

  return contract;
};


export const useMinterContract = () => useContract(MyCELONFTAbi.abi as AbiItem[], MyCELONFTContractAddress)