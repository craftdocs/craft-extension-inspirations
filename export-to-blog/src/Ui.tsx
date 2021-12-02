import React from "react";
import styled, { css } from "styled-components";
import { COLORS, CONFIG } from "./Constants";

export type DarkModeEnabled = { isDarkMode: boolean };

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
  decoration?: "underline";
}

export const StyledTextSpan = styled.span<StyledTextSpanProps>`
  user-select: none;
  font-size: ${props => props.xFontSize}px;
  ${props => props.weight != null ? `font-weight: ${props.weight};` : ""};
  ${props => props.textColor != null ? `color: ${props.textColor};` : ""};
  ${props => props.isWiderSpaced ? "letter-spacing: 0.3px;" : ""};
  ${props => props.decoration ? css`text-decoration: ${props.decoration};`: ""}
`;

export const StyledTextParagraph = styled.p<StyledTextSpanProps>`
  user-select: none;
  font-size: ${props => props.xFontSize}px;
  margin: 0px;
  ${props => props.weight != null ? `font-weight: ${props.weight};` : ""};
  ${props => props.textColor != null ? `color: ${props.textColor};` : ""};
  ${props => props.isWiderSpaced ? "letter-spacing: 0.3px;" : ""};
`;

const Image = styled.img<DarkModeEnabled & { height: number }>`
  ${props => props.isDarkMode && "filter: invert(1);"}
  height: ${props => props.height}px;
`;

export const Icon: React.FC<DarkModeEnabled & { src: string, alt: string }> = (
  { src, alt, isDarkMode }
) => <Image isDarkMode={isDarkMode} src={src} alt={alt} height={24} />;

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

const InputComp = styled.input<{ bgColor: string, caretColor: string, textColor: string }>`
  border: none;
  width: 100%;
  outline: none;
  font-size: 15;
  font-weight: 500;
  color: ${props => props.textColor};
  background-color: ${props => props.bgColor};
  caret-color: ${props => props.caretColor};
`;

export type InputProps = DarkModeEnabled &  {
  value: string | null;
  placeHolder: string;
  onChange: (newValue: string) => void;
}

export const Input: React.FC<InputProps> = (
  { isDarkMode, value, onChange, placeHolder }
) => {
  const onChangeI = React.useCallback(
    (
      { target: { value } }: React.ChangeEvent<HTMLInputElement>
    ) => onChange(value),
    [onChange]
  );

  return <InputComp
    value={value ?? ""}
    onChange={onChangeI}
    placeholder={placeHolder}
    bgColor={COLORS(isDarkMode).app}
    textColor={COLORS(isDarkMode).text.strong}
    caretColor={COLORS(isDarkMode).text.strong}
  />;
}

export const Clickable = styled.div<{ enabled?: boolean }>`
  ${props => props.enabled !== false && clickableStyles()}
`;

export interface BoxShadowProps {
  borderRadius: number;
  shadow: string;
  hoverShadow?: string;
}

export const BoxShadow = styled.div <BoxShadowProps>`
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

type ErrorMessageProps = DarkModeEnabled & { message: string };

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  isDarkMode,
  message
}) => (
  <Padded padding={8}>
    <Card
      borderRadius={CONFIG.ui.borderRadius}
      borderColor={COLORS(isDarkMode).border.error}
      backgroundColor={COLORS(isDarkMode).background.error}
    >
      <Padded padding={8}>
        <FlexRow alignItems={"center"} justifyContent={"center"}>
          <StyledTextSpan
            xFontSize={CONFIG.ui.emphasis.fontSize}
            weight={CONFIG.ui.emphasis.fontWeight}
            textColor={COLORS(isDarkMode).text.error}
          >
            {message}
          </StyledTextSpan>
        </FlexRow>
      </Padded>
    </Card>
  </Padded>
);

export function mixSvgAttributes(width: number): Pick<React.SVGAttributes<SVGSVGElement>, "width" | "version" | "xmlns" | "xmlnsXlink"> {
  return {
    width: width,
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink"
  };
}

export const ChevronBack: React.FC<{ width: number }> = ({ width }) => {
  const fillColor = "currentColor";
  return <svg {...mixSvgAttributes(width)} viewBox="0 0 7 10">
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path d="M5.64,9.86 C5.75,9.86 5.85,9.83 5.94,9.78 C6.03,9.73 6.10,9.66 6.15,9.57 C6.20,9.48 6.23,9.39 6.23,9.28 C6.23,9.12 6.17,8.98 6.05,8.86 L2.09,4.99 L6.05,1.12 C6.17,1.00 6.23,0.87 6.23,0.71 C6.23,0.60 6.20,0.50 6.15,0.41 C6.10,0.33 6.03,0.26 5.94,0.21 C5.85,0.16 5.75,0.13 5.64,0.13 C5.48,0.13 5.35,0.19 5.24,0.30 L0.88,4.56 C0.82,4.62 0.77,4.69 0.74,4.76 C0.71,4.83 0.69,4.91 0.69,4.99 C0.69,5.08 0.71,5.15 0.74,5.22 C0.77,5.30 0.82,5.36 0.88,5.43 L5.24,9.69 C5.35,9.80 5.48,9.86 5.64,9.86 Z" id="􀆉" fill={fillColor} fillRule="nonzero"></path>
    </g>
  </svg>;
};

export const ArrowRight: React.FC<{ width: number }> = ({ width }) => {
  const fillColor = "currentColor";
  return <svg {...mixSvgAttributes(width)} viewBox="0 0 11 10">
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path d="M6.55,9.24 C6.69,9.24 6.82,9.18 6.94,9.07 L10.61,5.40 C10.74,5.29 10.80,5.15 10.80,4.99 C10.80,4.83 10.74,4.69 10.61,4.58 L6.96,0.92 C6.89,0.86 6.82,0.81 6.76,0.78 C6.69,0.75 6.62,0.74 6.55,0.74 C6.39,0.74 6.26,0.79 6.16,0.89 C6.05,0.99 6.00,1.12 6.00,1.27 C6.00,1.35 6.01,1.42 6.04,1.49 C6.07,1.56 6.11,1.62 6.16,1.67 L7.40,2.93 L9.14,4.52 L7.83,4.44 L0.97,4.44 C0.80,4.44 0.67,4.49 0.56,4.59 C0.46,4.69 0.41,4.83 0.41,4.99 C0.41,5.15 0.46,5.29 0.56,5.39 C0.67,5.49 0.80,5.54 0.97,5.54 L7.83,5.54 L9.15,5.46 L7.40,7.05 L6.16,8.31 C6.11,8.36 6.07,8.42 6.04,8.49 C6.01,8.56 6.00,8.63 6.00,8.71 C6.00,8.86 6.05,8.99 6.16,9.09 C6.26,9.19 6.39,9.24 6.55,9.24 Z" id="􀄫" fill={fillColor} fillRule="nonzero"></path>
    </g>
  </svg>;
};

export const MediumLogo: React.FC<{ width: number }> = ({ width }) => (
  <svg {...mixSvgAttributes(width)} viewBox="0 0 1043.63 592.71">
    <g data-name="Layer 2">
      <g data-name="Layer 1">
        <path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94" fill={"currentColor"} />
      </g>
    </g>
  </svg>
);

export const TopLeftAbsolute = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
`;

export type BackArrowProps = { onClick: () => void };

export const BackArrow: React.FC<BackArrowProps> = ({ onClick }) => (
  <TopLeftAbsolute top={15} left={11}>
    <Clickable onClick={onClick}>
      <ChevronBack width={12} />
    </Clickable>
  </TopLeftAbsolute>
);

export const Code = styled.code<DarkModeEnabled>`
  color: ${props => COLORS(props.isDarkMode).text.full};
`;

type LogMessageProps = DarkModeEnabled & { text: string };

export const LogMessage: React.FC<LogMessageProps> = ({ isDarkMode, text }) => (
  <Padded padding={12}>
    <Code isDarkMode={isDarkMode}>{text}</Code>
  </Padded>
);