import React from "react";
import styled, { keyframes } from "styled-components";


const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;


const animate = keyframes`
  0% {
    transform: translateY(0px);
    color: transparent;
    -webkit-text-stroke: 1px hsl(211, 47%, 34%);
    text-shadow: none;
  }
  20% {
    transform: translateY(-60px);
    color: hsl(197, 38%, 37%);
    text-shadow: 0 0 5px #fff,
                 0 0 25px #fff,
                 0 0 50px #fff;
  }
  40%, 100% {
    transform: translateY(0px);
    color: transparent;
    -webkit-text-stroke: 1px #fff5;
    text-shadow: none;
  }
`;


const Loader = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-box-reflect: below -25px linear-gradient(transparent, rgba(0, 0, 0, 0.15));
  cursor: default;
`;

const Span = styled.span<{ $index: number }>` // Styled-components prop typing
  position: relative;
  display: inline-flex;
  font-size: 3em;
  color: transparent;
  font-weight: 800;
  animation: ${animate} 2s ease-in-out infinite;
  animation-delay: calc(0.15s * ${({ $index }) => $index});
  text-transform: uppercase;
`;

const LoadingOverlay: React.FC = () => {
  const text = "Loading...";

  return (
    <Overlay>
      <Loader>
        {text.split("").map((char, index) => (
          <Span key={index} $index={index + 1}>
            {char}
          </Span>
        ))}
      </Loader>
    </Overlay>
  );
};

export default LoadingOverlay;
