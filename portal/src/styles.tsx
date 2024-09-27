import styled from 'styled-components';

export default styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;

  .page-content {
    flex: 1;
  }
  .app-header {
    display: flex;
    color: var(--text-color);
    align-items: center;
    padding: 20px;
  }
  .app-subheading {
    font-weight: 500;
  }
`;
