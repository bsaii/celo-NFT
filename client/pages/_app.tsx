// import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Alfajores, CeloProvider } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CeloProvider
      dapp={{
        name: 'CELO NFT minter dApp',
        description: 'My awesome description',
        url: 'https://example.com',
        icon: '',
      }}
      defaultNetwork={Alfajores.name}
      connectModal={{
        providersOptions: { searchable: true },
      }}
    >
      <Component {...pageProps} />
    </CeloProvider>
  );
}
