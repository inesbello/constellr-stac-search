import styled from 'styled-components';
import { Row } from 'rsuite';

export default styled(Row)`
  .results-table--container {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
  }

  .results-table--header.header--text {
    white-space: nowrap;
    font-weight: 500;
  }

  .results-table--header.header--btn {
    .rs-table-cell-content {
      padding: 0;
    }

    .results-table--checkbox--container {
      line-height: 40px;
    }

    .results-table--checkbox {
      margin: 0;
    }
  }

  .results-table--cell {
    .rs-table-cell-content {
      padding: 0;
    }

    .results-table--checkbox--container {
      line-height: 46px;
    }

    .results-table--checkbox {
      margin: 0;
      padding: 0;
    }
  }

  .results-table--custom-span {
    padding-left: 15px;
  }

  .pagination--container {
    padding: 20px;
  }
`;
