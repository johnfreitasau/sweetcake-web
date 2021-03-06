import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #3e3b47;

  h1 {
    font-family: 'Sacramento', sans-serif;
    color: #e67e22;
    font-size: 64px;
    text-shadow: 1px 1px 0 #38312a;
  }
`;

export const FormContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: 80%;
  min-width: 100px;
  min-height: 280px;
  padding: 20px 40px;
  border-radius: 6px;
  box-shadow: 0px 8px 36px #000;
  background-color: #f4ede8;
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

  form {
    margin: 30px 0;
    width: 340px;
    text-align: center;

    h2 {
      margin-bottom: 24px;
      font-size: 20px;
    }
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
    color: #e67e22;
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
      color: ${shade(0.2, '#E67E22')};
    }
  }
`;
