import styled from 'styled-components';
import { Grid } from 'rsuite';

export default styled(Grid)`
  .rs-row {
    margin-left: 0;
  }
  .map--row {
    display: flex;
    height: 400px;
    gap: 5px;
  }

  .map--container {
    height: 100%;
    width: 100%;
  }
  .leaflet-control {
    z-index: 0 !important;
  }
  .leaflet-pane {
    z-index: 0 !important;
  }
  .leaflet-top,
  .leaflet-bottom {
    z-index: 0 !important;
  }
`;
