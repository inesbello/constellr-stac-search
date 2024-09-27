import { Row } from 'rsuite';
import styled from 'styled-components';

export default styled(Row)`
  display: flex;
  align-items: flex-end;

  .flex-item--middle {
    padding: 0 10px;
  }
  .search-header--filters {
    height: 100%;
    align-items: stretch;
  }

  .search-header--btn--container {
    display: flex;
    align-items: stretch;
  }

  .search-header--btn {
    flex: 1;
    border-radius: 0;
    gap: 3px;
  }

  .search-header-filter--container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    border-radius: 0;
    flex-wrap: wrap;
    overflow: auto;

    .rs-panel-header {
      padding: 10px;
    }
  }

  .search-header--input-group {
    flex-wrap: wrap;
  }
  .search-header--container.date-picker {
    padding: 10px;
  }
  .search-header--date-picker {
    width: 175px;
    border-radius: 0;
  }

  .uploader--container {
    padding: 0 10px 0 2.5px;
  }
  #uploader--btn--container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 100px;
  }
  .uploader--more-info {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    .uploader--more-info--instructions {
      /* font-size: 1rem; */
    }

    .uploader--more-info--divider {
      margin: 0;
    }
  }
`;
