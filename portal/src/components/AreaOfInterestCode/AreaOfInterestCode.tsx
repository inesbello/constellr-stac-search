import React, { useEffect, useState } from 'react';
import { Feature } from 'geojson';
import { Header, Heading } from 'rsuite';
import ReactCodeMirror from '@uiw/react-codemirror';
import CodeIcon from '@rsuite/icons/Code';

import StyledAreaOfInterestCode from './styles';

interface IAreaOfInterestCodeProps {
  searchArea: Feature[];
}

const AreaOfInterestCode: React.FC<IAreaOfInterestCodeProps> = ({
  searchArea
}) => {
  const [geoJSON, setGeoJSON] = useState<string>('');

  useEffect(() => {
    setGeoJSON(
      JSON.stringify(
        {
          type: 'FeatureCollection',
          features: searchArea
        },
        null,
        2
      )
    );
  }, [searchArea]);

  return (
    <StyledAreaOfInterestCode>
      <Header className='area-of-interest--header'>
        <CodeIcon />
        <Heading id='area-of-interest--heading rs-theme-dark' level={5}>
          Area of Interest
        </Heading>
      </Header>
      <ReactCodeMirror
        value={geoJSON}
        theme='dark'
        editable={false}
        height='100%'
        className='area-of-interest--code-mirror'
      />
    </StyledAreaOfInterestCode>
  );
};

export default AreaOfInterestCode;
