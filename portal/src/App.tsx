import React from 'react';
import MapBase from './components/MapBase/MapBase';
import Toast from './components/Toast';

import StyledLayout from './styles';
import { CustomProvider, Divider, Header, Heading } from 'rsuite';

const App: React.FC = () => {
  return (
    <CustomProvider theme='dark'>
      <StyledLayout>
        <Toast />
        <Header className='app-header'>
          <Heading level={4} className='app-heading'>
            STAC Catalog Search
          </Heading>
          <Divider vertical />
          <Heading level={6} className='app-subheading'>
            Start by drawing a shape on the map or uploading a GeoJSON file
          </Heading>
        </Header>
        <div className='page-content'>
          <MapBase />
        </div>
      </StyledLayout>
    </CustomProvider>
  );
};

export default App;
