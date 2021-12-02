import React from "react";
import styled, { css } from "styled-components";

export function clickableStyles() {
  return css`
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  `;
}

export const FlexRow = styled.div<{alignItems?: string, justifyContent?: string}>`
  display: flex;
  /* min-width to allow grow up to container from 0 size */
  min-width: 0px;
  align-items: ${props => props.alignItems || "flex-start"};
  justify-content: ${props => props.justifyContent || "normal"};
`;

export interface StyledTextSpanProps {
  xFontSize: number;
  weight?: number;
  textColor?: string;
  isWiderSpaced?: boolean;
}

export const StyledTextSpan = styled.span<StyledTextSpanProps>`
  user-select: none;
  font-size: ${props => props.xFontSize}px;
  ${props => props.weight != null ? `font-weight: ${props.weight};` : ""};
  ${props => props.textColor != null ? `color: ${props.textColor};` : ""};
  ${props => props.isWiderSpaced ? "letter-spacing: 0.3px;" : ""};
`;

export const StyledTextParagraph = styled.p<StyledTextSpanProps>`
  user-select: none;
  font-size: ${props => props.xFontSize}px;
  margin: 0px;
  ${props => props.weight != null ? `font-weight: ${props.weight};` : ""};
  ${props => props.textColor != null ? `color: ${props.textColor};` : ""};
  ${props => props.isWiderSpaced ? "letter-spacing: 0.3px;" : ""};
`;

const Image = styled.img<{ height: number }>`
  height: ${props => props.height}px;
`;

export const Icon: React.FC<{ src: string, alt: string }> = ({ src, alt }) => <Image src={src} alt={alt} height={24} />;

export const FixedWidthDiv = styled.div<{ xWidth: number }>`
  width: ${props => props.xWidth}px;
`;

export const FixedHeightDiv = styled.div<{xxHeight: number}>`
  max-height: ${props => props.xxHeight}px;
  min-height: ${props => props.xxHeight}px;
`;

export const Padded = styled.div<{ padding: number }>`
  padding: ${props => props.padding}px;
`;

export const PaddedXY = styled.div<{ paddingX: number, paddingY : number }>`
  padding-left: ${props => props.paddingX}px;
  padding-right: ${props => props.paddingX}px;
  padding-top: ${props => props.paddingY}px;
  padding-bottom: ${props => props.paddingY}px;
`;

export const Clickable = styled.div`
  ${clickableStyles()}
`;

export const BoxShadow = styled.div <{ borderRadius: number, shadow: string, hoverShadow?: string }>`
  box-shadow: 0px 1px 3px 0px ${props => props.shadow};
  border-radius: ${props => props.borderRadius}px;

  ${props => props.hoverShadow && css`
    transition: 0.1s ease;
    &:hover {
      box-shadow: 0px 2px 3px 0px ${props.hoverShadow};
    }
  `}

`;

interface CardProps {
  borderRadius: number;
  borderColor: string,
  backgroundColor?: string;
  hoverBg?: string;
}

export const Card = styled.div<CardProps>`
  box-sizing: border-box;
  border-radius: ${props => props.borderRadius}px;
  border: 1px solid ${props => props.borderColor};

  ${props => props.backgroundColor && css`background-color: ${props.backgroundColor}`};

  ${props => props.hoverBg && css`
    transition: 0.1s ease;
    &:hover {
      background-color: ${props.hoverBg};
    }
  `}
`;

export const TextColor = styled.div<{ xColor: string, hoverColor?: string }>`
  color: ${props => props.xColor};
  ${props => props.hoverColor && css`
    transition: 0.1s ease;
    &:hover {
      color: ${props.hoverColor};
    }
  `}
`;

export const Separator = styled.div<{ color: string }>`
  border-bottom: 1px solid ${props => props.color};
`;

export function mixSvgAttributes(props: { width: number }): Pick<React.SVGAttributes<SVGSVGElement>, "width" | "version" | "xmlns" | "xmlnsXlink"> {
  return {
    width: props.width,
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink"
  };
}

export const OutBox: React.FC<{ width: number }> = (props) => {
  const fillColor = "currentColor";
  return <svg {...mixSvgAttributes(props)} viewBox="0 0 11 12">
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path d="M8.91,11.14 C9.50,11.14 9.94,10.99 10.24,10.70 C10.54,10.40 10.69,9.96 10.69,9.38 L10.69,2.62 C10.69,2.04 10.54,1.60 10.24,1.31 C9.94,1.01 9.50,0.86 8.91,0.86 L2.19,0.86 C1.60,0.86 1.16,1.01 0.86,1.30 C0.56,1.60 0.41,2.04 0.41,2.62 L0.41,9.38 C0.41,9.97 0.56,10.41 0.86,10.70 C1.16,10.99 1.60,11.14 2.19,11.14 L8.91,11.14 Z M8.87,10.15 L2.23,10.15 C1.96,10.15 1.76,10.08 1.62,9.94 C1.48,9.80 1.41,9.59 1.41,9.31 L1.41,2.69 C1.41,2.42 1.48,2.21 1.62,2.07 C1.76,1.93 1.96,1.86 2.23,1.86 L8.87,1.86 C9.13,1.86 9.33,1.93 9.48,2.07 C9.62,2.21 9.69,2.42 9.69,2.69 L9.69,9.31 C9.69,9.59 9.62,9.80 9.48,9.94 C9.33,10.08 9.13,10.15 8.87,10.15 Z M3.83,8.15 C3.97,8.15 4.08,8.10 4.17,8.00 L6.17,6.02 L6.93,5.18 L6.85,6.02 L6.85,6.94 C6.85,7.08 6.89,7.19 6.97,7.27 C7.05,7.36 7.16,7.40 7.29,7.40 C7.41,7.40 7.52,7.36 7.60,7.27 C7.67,7.18 7.71,7.07 7.71,6.92 L7.71,4.33 C7.71,4.15 7.67,4.03 7.58,3.95 C7.49,3.87 7.36,3.83 7.20,3.83 L4.60,3.83 C4.46,3.83 4.34,3.86 4.26,3.94 C4.18,4.02 4.13,4.12 4.13,4.25 C4.13,4.39 4.18,4.49 4.26,4.57 C4.35,4.65 4.46,4.69 4.60,4.69 L5.58,4.69 L6.36,4.60 L5.52,5.38 L3.53,7.37 C3.43,7.46 3.38,7.57 3.38,7.69 C3.38,7.83 3.43,7.94 3.51,8.02 C3.59,8.11 3.70,8.15 3.83,8.15 Z" id="􀱁" fill={fillColor} fillRule="nonzero"></path>
    </g>
  </svg>;
};