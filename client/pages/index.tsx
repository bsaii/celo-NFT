import Head from 'next/head';
import Image from 'next/image';
// import styles from '../styles/Home.module.css'
import { Notification } from '../components/ui/Notifications';
import Wallet from '../components/wallet';
import { useMinterContract } from '../hooks/useContract';
import NftList from '../components/minter';
import { Container, Nav } from 'react-bootstrap';
import { useCelo } from '@celo/react-celo';
import Cover from '../components/Cover';
import { Contract } from 'web3-eth-contract';
import { useBalance } from '../hooks/useBalance';
import BigNumber from 'bignumber.js';

const coverImg = '/nft_geo_cover.png';

export default function Home() {
  const { address, connect, disconnect } = useCelo();

  const { balance } = useBalance();
  const minterContract = useMinterContract();

  return (
    <>
      <Head>
        <title>Celo NFT Minter DApp</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Notification />

        {address ? (
          <Container fluid='md'>
            <Nav className='justify-content-end pt-3 pb-5'>
              <Nav.Item>
                {/*display user wallet*/}
                <Wallet
                  address={address}
                  balance={balance as BigNumber}
                  disconnect={disconnect}
                />
              </Nav.Item>
            </Nav>
            <main>
              {/*list NFTs*/}
              <NftList
                name='GEO Collection'
                minterContract={minterContract as Contract}
              />
            </main>
          </Container>
        ) : (
          //  if user wallet is not connected display cover page
          <Cover name='GEO Collection' coverImg={coverImg} connect={connect} />
        )}
      </main>
    </>
  );
}
