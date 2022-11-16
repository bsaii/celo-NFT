import React from 'react';
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { truncateAddress } from '../../utils';
import { Button } from 'react-bootstrap';

const Address = ({ address }: { address: string }) => {
  if (address) {
    return (
      <Button variant='outline-secondary' className='rounded-pill'>
        {/* format user wallet address to a more suitable display */}
        {truncateAddress(address)}
      </Button>
    );
  }

  return null;
};

export default Address;
