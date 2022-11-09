import React from 'react';
import { ToastContainer } from 'react-toastify';

type NotificationsProps = {
  text: string;
};

const Notification = () => (
  <ToastContainer
    position='bottom-center'
    autoClose={5000}
    hideProgressBar
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable={false}
    pauseOnHover
  />
);

const NotificationSuccess = ({ text }: NotificationsProps) => (
  <div>
    <i className='bi bi-check-circle-fill text-success mx-2' />
    <span className='text-secondary mx-1'>{text}</span>
  </div>
);

const NotificationError = ({ text }: NotificationsProps) => (
  <div>
    <i className='bi bi-x-circle-fill text-danger mx-2' />
    <span className='text-secondary mx-1'>{text}</span>
  </div>
);

export { Notification, NotificationSuccess, NotificationError };
