import React, { useRef, useState } from 'react';
import { Col, Row } from 'rsuite';
import { Feature, FeatureCollection } from 'geojson';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
  FeatureGroup
} from 'react-leaflet';
import L, { DrawEvents, LatLngExpression } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import SearchHeader from '../SearchHeader/SearchHeader';
import AreaOfInterestCode from '../AreaOfInterestCode/AreaOfInterestCode';
import ResultsTable from '../ResultsTable';
import StyledMapBase from './styles';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const MapBase: React.FC = () => {
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [uploadedFeature, setUploadedFeature] = useState<Feature[]>([]);
  const [searchArea, setSearchArea] = useState<Feature[]>([]);
  const [searchResults, setSearchResults] = useState<FeatureCollection>();
  const [selectedResults, setSelectedResults] = useState<Feature[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLayerAdd = (layer: DrawEvents.Created) => {
    const newFeature = layer.layer.toGeoJSON() as Feature;

    setSearchArea((prevSearchArea) => [...prevSearchArea, newFeature]);
  };

  const renderShape = (feature: Feature, index?: number) => {
    if (feature.geometry.type === 'Polygon') {
      return (
        <Polygon
          key={index}
          positions={
            feature.geometry.coordinates.map((coord) =>
              coord.map((c) => [c[1], c[0]])
            ) as LatLngExpression[][]
          }
        />
      );
    } else if (feature.geometry.type === 'MultiPolygon') {
      return (
        <Polygon
          key={index}
          positions={
            feature.geometry.coordinates.map((coord) =>
              coord.map((c) => c.map((cc) => [cc[1], cc[0]]))
            ) as LatLngExpression[][][]
          }
        />
      );
    } else if (feature.geometry.type === 'Point') {
      return (
        <Marker
          key={index}
          position={[
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
          ]}
        />
      );
    } else if (feature.geometry.type === 'LineString') {
      return (
        <Polyline
          key={index}
          positions={feature.geometry.coordinates as LatLngExpression[]}
        />
      );
    } else if (feature.geometry.type === 'MultiLineString') {
      return (
        <Polyline
          key={index}
          positions={
            feature.geometry.coordinates.map((coord) =>
              coord.map((c) => [c[1], c[0]])
            ) as LatLngExpression[][]
          }
        />
      );
    }
  };

  return (
    <StyledMapBase fluid>
      <SearchHeader
        searchArea={searchArea}
        setSearchArea={setSearchArea}
        setSearchResults={setSearchResults}
        setUploadedFeature={setUploadedFeature}
        loading={loading}
        setLoading={setLoading}
      />
      <br />
      <Row className='map--row'>
        <Col xs={18}>
          <MapContainer
            center={[39.622912, -104.826257]}
            zoom={5}
            className='map--container'
          >
            <TileLayer
              url='https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg'
              attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position='topright'
                draw={{
                  circlemarker: false,
                  circle: false
                }}
                edit={{
                  edit: false,
                  remove: false
                }}
                onCreated={handleLayerAdd}
              />
            </FeatureGroup>
            {uploadedFeature.map(renderShape)}
            <FeatureGroup
              pathOptions={{
                color: 'red'
              }}
            >
              {selectedResults && selectedResults.map(renderShape)}
            </FeatureGroup>
          </MapContainer>
        </Col>
        <Col xs={6}>
          <AreaOfInterestCode searchArea={searchArea} />
        </Col>
      </Row>
      <br />
      <ResultsTable
        searchResults={searchResults}
        setSelectedResults={setSelectedResults}
        loading={loading}
      />
    </StyledMapBase>
  );
};

export default MapBase;
