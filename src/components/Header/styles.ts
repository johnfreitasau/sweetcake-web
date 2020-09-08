import styled from 'styled-components';

export const Container = styled.div`
  height: 60px;
  background: ${(props) => props.theme.colors.background};
  color: '#444';
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
`;
