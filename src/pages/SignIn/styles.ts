import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;

  flex-wrap: wrap;
  justify-content: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 700px;
`;

const appearFromLeft = keyframes`
from {
  opacity: 0;
  transform: translateX(-50px);
} 
to {
  opacity: 1;
  transform: translateX(0);
}
`;

export const ImageContainer = styled.div`
  flex: 1;
  display: grid;
  place-items: center;

  img {
    padding-left: 15px;
    width: 550px;
    height: 550px;
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromLeft} 1s;

  h1 {
    font-family: 'Sacramento', sans-serif;
    color: #bf7878;
    font-size: 64px;
  }

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
  }

  h2 {
    margin-bottom: 24px;
    font-size: 16px;
  }

  a {
    color: #666360;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.5, '#666360')};
    }
  }

  > a {
    color: #e5989b;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;
    transition: color 0.2s;
    svg {
      margin-right: 16px;
    }
    &:hover {
      color: ${shade(0.2, '#e5989b')};
    }
  }
`;
