import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useState, useEffect, useCallback } from 'react';

export const useBalance = () => {
  const { address, kit } = useCelo();
  const [balance, setBalance] = useState<BigNumber>();


  const getBalance = useCallback(async () => {

    // fetch a connected wallet celo balance
    const celo = await kit.contracts.getGoldToken();
    const _balance = await celo.balanceOf(address as string)
    setBalance(_balance);
  }, [address, kit]);

  useEffect(() => {
    if (address) getBalance();
  }, [address, getBalance]);

  return {
    balance,
    getBalance,
  };
};