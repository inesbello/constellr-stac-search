import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import SearchIcon from '@rsuite/icons/Search';
import { TypeAttributes } from 'rsuite/esm/internals/types';
import { FileType } from 'rsuite/esm/Uploader';
import { Feature, FeatureCollection } from 'geojson';
import {
  Button,
  InputGroup,
  DatePicker,
  Panel,
  CheckboxGroup,
  Checkbox,
  FlexboxGrid,
  Col,
  Uploader,
  Grid,
  Divider
} from 'rsuite';

import environment from '../../environment';
import StyledSearchHeader from './styles';
import { IStacBody } from '../../assets/interfaces/IStac';

interface ISearchHeaderProps {
  searchArea: Feature[];
  setSearchArea: CallableFunction;
  setSearchResults: CallableFunction;
  setUploadedFeature: CallableFunction;
  defaultColor?: TypeAttributes.Color;
  setLoading: CallableFunction;
  loading: boolean;
}

const SearchHeader: React.FC<ISearchHeaderProps> = ({
  searchArea,
  setSearchResults,
  setSearchArea,
  setUploadedFeature,
  defaultColor,
  setLoading,
  loading
}) => {
  const [collections, setCollections] = useState<string[]>([
    'landsat-c2l1',
    'landsat-c2l2-st'
  ]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const limit = 1000;

  const renderDatetimeValue = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    const startISOString = startDate?.toISOString();
    const endISOString = endDate?.toISOString();

    if (!startISOString && !endISOString) {
      return;
    }

    const dateTimeInterval = `${startISOString ? startISOString : '..'}/${
      endISOString ? endISOString : '..'
    }`;

    return dateTimeInterval;
  };

  const handleSearch = async () => {
    if (!searchArea) {
      toast.warning('Please select an area of interest on the map');
      return;
    }

    if (collections.length === 0) {
      toast.warning('Please select at least one collection');
      return;
    }

    if (searchArea.length === 0) {
      toast.warning('Please select an area of interest on the map');
      return;
    }

    if (endDate && !startDate) {
      toast.warning('Please select a start date');
      return;
    }

    const geoJsonBody: IStacBody = {
      collections: collections,
      datetime: renderDatetimeValue(startDate, endDate),
      limit: limit,
      intersects: {
        type: 'GeometryCollection',
        geometries: searchArea.map((feature: Feature) => feature.geometry)
      }
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${environment.apiPath}api/search`,
        geoJsonBody,
        { ...environment.params }
      );
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    }
  };

  const uploadGeoJSON = async (geoJsonFile: FileType) => {
    setUploading(true);
    const { blobFile } = geoJsonFile;
    if (!blobFile) {
      console.error('No file provided');
      return;
    }

    const formData = new FormData();
    formData.append('file', blobFile);

    try {
      const response = await axios.post(
        `${environment.apiPath}upload-geojson`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setUploading(false);
      toast.success('Successfully uploaded GeoJSON file');
      setSearchArea((prevSearchArea: Feature[]) => [
        ...prevSearchArea,
        ...(response.data as FeatureCollection).features
      ]);
      setUploadedFeature((response.data as FeatureCollection).features);
    } catch (error: any) {
      setUploading(false);
      toast.error('Error uploading GeoJSON file');
      console.error(
        'Error uploading file',
        error.response?.data || error.message
      );
    }
  };

  return (
    <StyledSearchHeader>
      <Col xs={18}>
        <Grid fluid>
          <FlexboxGrid
            justify='space-between'
            className='search-header--filters'
          >
            <FlexboxGrid.Item
              colspan={3}
              className='search-header--btn--container'
            >
              <Button
                onClick={handleSearch}
                disabled={searchArea.length === 0 || uploading || loading}
                type='submit'
                startIcon={<SearchIcon />}
                className='search-header--btn'
                color={defaultColor ? defaultColor : 'orange'}
                appearance='primary'
              >
                Search
              </Button>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={10} className='flex-item--middle'>
              <Panel
                bordered
                header='Select collections'
                bodyProps={{
                  className: 'search-header--container date-picker'
                }}
                className='search-header-filter--container'
              >
                <CheckboxGroup
                  name='collections-checkbox'
                  className='search-header--input-group'
                  inline
                  aria-required
                  value={collections}
                  onChange={(v: any) => {
                    setCollections(v);
                  }}
                >
                  {['landsat-c2l1', 'landsat-c2l2-st'].map((option) => (
                    <Checkbox
                      key={option}
                      value={option}
                      color={defaultColor ? defaultColor : 'orange'}
                    >
                      {option}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </Panel>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={11}>
              <Panel
                bordered
                header='Select date'
                className='search-header-filter--container'
                bodyProps={{
                  className: 'search-header--container date-picker'
                }}
              >
                <InputGroup className='search-header--input-group'>
                  <DatePicker
                    format='yyyy-MM-dd'
                    block
                    value={startDate}
                    onChange={setStartDate}
                    className='search-header--date-picker'
                    oneTap
                  />
                  <InputGroup.Addon>to</InputGroup.Addon>
                  <DatePicker
                    format='yyyy-MM-dd'
                    block
                    value={endDate}
                    onChange={setEndDate}
                    oneTap
                    className='search-header--date-picker'
                  />
                </InputGroup>
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Grid>
      </Col>
      <Col xs={6} className='uploader--container'>
        <Uploader
          action='http://localhost:5000/upload-geojson'
          draggable
          fileListVisible={false}
          accept='.geojson,.json,application/geo+json'
          multiple={false}
          onUpload={(f) => uploadGeoJSON(f)}
        >
          <div typeof='button' id='uploader--btn--container'>
            <FileUploadIcon width={50} height={50} />
            <div className='uploader--more-info'>
              <span className='uploader--more-info--instructions'>
                Click or Drag a GeoJSON file here
              </span>
              <Divider className='uploader--more-info--divider'>
                Limit of 10MB per file
                <Divider vertical />
                JSON
              </Divider>
            </div>
          </div>
        </Uploader>
      </Col>
    </StyledSearchHeader>
  );
};

export default SearchHeader;
