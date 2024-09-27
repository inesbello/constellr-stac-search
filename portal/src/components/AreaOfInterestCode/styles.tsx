import styled from 'styled-components';
import { Container } from 'rsuite';

export default styled(Container)`
  height: 100%;

  .area-of-interest--header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font: 1.5em 'Fira Code', monospace;
    gap: 15px;
    background-color: hwb(220 60% 75% / 1);

    color: hsl(219 14% 90% / 1);
    padding-left: 10px;
  }

  .area-of-interest--code-mirror {
    flex: 1;
    overflow: hidden;
  }
`;
