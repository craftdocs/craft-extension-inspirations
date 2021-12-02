import React from "react";
import { COLORS, CONFIG, COPY } from "./Constants";
import { ExportApp } from "./ExportApp";
import { BoxShadow, Card, Clickable, FixedHeightDiv, FixedWidthDiv, FlexRow, OutBox, Padded, PaddedXY, Separator, StyledTextParagraph, StyledTextSpan, TextColor } from "./ui";

type DarkModeEnabled = { isDarkMode: boolean };

export const Header: React.FC<DarkModeEnabled> = ({ isDarkMode }) => (
  <>
    <FlexRow justifyContent={"center"} alignItems={"center"}>
      <FixedHeightDiv xxHeight={44} />
      <StyledTextSpan
        xFontSize={13}
        weight={700}
        textColor={COLORS(isDarkMode).text.strong}
      >
        {COPY.sendTo}
      </StyledTextSpan>
    </FlexRow>
    <Separator color={COLORS(isDarkMode).border.normal} />
  </>
);

type MessageProps = DarkModeEnabled & { toggle: () => void };

export const Message: React.FC<MessageProps> = ({ toggle, isDarkMode }) => (
  <Padded padding={8}>
    <BoxShadow
      borderRadius={CONFIG.ui.borderRadius}
      shadow={COLORS(isDarkMode).shadow.idle}
    >
      <Card
        borderRadius={CONFIG.ui.borderRadius}
        borderColor={COLORS(isDarkMode).border.normal}
        backgroundColor={COLORS(isDarkMode).background.idle.shaded}
      >
        <Padded padding={12}>
          <StyledTextParagraph
            xFontSize={CONFIG.ui.emphasis.fontSize}
            weight={CONFIG.ui.emphasis.fontWeight}
            textColor={COLORS(isDarkMode).text.strong}
          >
            {COPY.transferYourContent}
          </StyledTextParagraph>
          <FixedHeightDiv xxHeight={10} />
          <StyledTextParagraph
            xFontSize={CONFIG.ui.emphasis.fontSize}
            weight={CONFIG.ui.normal.fontWeight}
            textColor={COLORS(isDarkMode).text.pale}
          >
            {COPY.ifYouHaveBlocksSelected}
          </StyledTextParagraph>
          <FixedHeightDiv xxHeight={10} />
          <StyledTextParagraph
            xFontSize={CONFIG.ui.emphasis.fontSize}
            weight={CONFIG.ui.normal.fontWeight}
            textColor={COLORS(isDarkMode).text.pale}
          >
            {COPY.youllNeedToInstall}
          </StyledTextParagraph>
          <FixedHeightDiv xxHeight={10} />
          <Clickable onClick={toggle}>
            <Card
              borderRadius={CONFIG.ui.borderRadius}
              borderColor={COLORS(isDarkMode).border.normal}
              backgroundColor={COLORS(isDarkMode).background.idle.pale}
              hoverBg={COLORS(isDarkMode).background.hover.pale}
            >
              <Padded padding={8}>
                <FlexRow alignItems={"center"} justifyContent={"center"}>
                  <StyledTextSpan
                    xFontSize={CONFIG.ui.emphasis.fontSize}
                    weight={CONFIG.ui.emphasis.fontWeight}
                    textColor={COLORS(isDarkMode).text.medium}
                  >
                    {COPY.hideMessage}
                  </StyledTextSpan>
                </FlexRow>
              </Padded>
            </Card>
          </Clickable>
        </Padded>
      </Card>
    </BoxShadow>
  </Padded>
);

export const ShowMessage: React.FC<MessageProps> = ({ toggle, isDarkMode }) => (
  <Padded padding={8}>
    <Clickable onClick={toggle}>
      <Card
        borderRadius={CONFIG.ui.borderRadius}
        borderColor={COLORS(isDarkMode).border.normal}
        backgroundColor={COLORS(isDarkMode).background.idle.shaded}
        hoverBg={COLORS(isDarkMode).background.hover.shaded}
      >
        <Padded padding={8}>
          <FlexRow alignItems={"center"} justifyContent={"center"}>
            <StyledTextSpan
              xFontSize={CONFIG.ui.emphasis.fontSize}
              weight={CONFIG.ui.emphasis.fontWeight}
              textColor={COLORS(isDarkMode).text.medium}
            >
              {COPY.help}
            </StyledTextSpan>
          </FlexRow>
        </Padded>
      </Card>
    </Clickable>
  </Padded>
);

export type AppRowProps = DarkModeEnabled & {
  openHomePage: (url: string) => void;
  app: ExportApp,
}

export const AppRow: React.FC<AppRowProps> = ({ app, openHomePage, isDarkMode }) => (
  <Clickable onClick={app.runExport}>
    <PaddedXY paddingX={8} paddingY={4}>
      <BoxShadow
        borderRadius={CONFIG.ui.borderRadius}
        shadow={COLORS(isDarkMode).shadow.idle}
        hoverShadow={COLORS(isDarkMode).shadow.hover}
      >
        <Card
          borderRadius={CONFIG.ui.borderRadius}
          borderColor={COLORS(isDarkMode).border.normal}
        >
          <Padded padding={8}>
            <FlexRow alignItems={"center"} justifyContent={"space-between"}>
              <FlexRow alignItems={"center"}>
                {app.icon}
                <FixedWidthDiv xWidth={10} />
                <StyledTextSpan
                  xFontSize={CONFIG.ui.emphasis.fontSize}
                  weight={CONFIG.ui.emphasis.fontWeight}
                  textColor={COLORS(isDarkMode).text.strong}
                >
                  {app.name}
                </StyledTextSpan>
              </FlexRow>
              <FlexRow
                alignItems={"center"}
                style={{ opacity: 0.3 }}
                onClick={() => openHomePage(app.homepage)}
              >
                <TextColor
                  xColor={COLORS(isDarkMode).text.pale}
                  hoverColor={COLORS(isDarkMode).text.strong}
                >
                  <OutBox width={15} />
                </TextColor>
              </FlexRow>
            </FlexRow>
          </Padded>
        </Card>
      </BoxShadow>
    </PaddedXY>
  </Clickable>
);

type ErrorMessageProps = DarkModeEnabled & { message: string };

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ isDarkMode, message }) => (
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