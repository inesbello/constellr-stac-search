import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

import StyledToastContainer from './styles';

const Toast: React.FC = () => (
  <StyledToastContainer
    position='bottom-right'
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);

export default Toast;
