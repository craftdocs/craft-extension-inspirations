import React from "react";
import { GhostState, MediumState } from "./BlogConfig";
import { COLORS, CONFIG, COPY } from "./Constants";
import {
  ArrowRight,
  BoxShadow,
  Card,
  Clickable,
  DarkModeEnabled,
  FixedHeightDiv,
  FlexRow,
  Icon,
  Input,
  MediumLogo,
  Padded,
  Separator,
  StyledTextParagraph,
  StyledTextSpan,
  TextColor
} from "./Ui";

import GhostLogo from "./assets/ghost.png";

export const Header: React.FC<DarkModeEnabled> = ({ isDarkMode }) => (
  <>
    <FlexRow justifyContent={"center"} alignItems={"center"}>
      <FixedHeightDiv xxHeight={44} />
      <StyledTextSpan
        xFontSize={13}
        weight={700}
        textColor={COLORS(isDarkMode).text.strong}
      >
        {COPY.appName}
      </StyledTextSpan>
    </FlexRow>
    <Separator color={COLORS(isDarkMode).border.normal} />
  </>
);

type MessageProps = DarkModeEnabled & {
    toggle: () => void
};

export type ShowProps = MessageProps & { label: string };

const ShowMessage: React.FC<ShowProps> = ({
    toggle,
    isDarkMode,
    label
}) => (
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
              {label}
            </StyledTextSpan>
          </FlexRow>
        </Padded>
      </Card>
    </Clickable>
  </Padded>
);

type AppCardProps = DarkModeEnabled & {
    enabled: boolean;
    publish: () => void;
};

type GhostCardProps = AppCardProps & {
  state: GhostState;
}

export type OpenerProps = DarkModeEnabled & {
  toggle: () => void;
}

export const GhostOpener: React.FC<OpenerProps> = ({ isDarkMode, toggle }) => (
  <Padded padding={8}>
    <BoxShadow
      shadow={COLORS(isDarkMode).shadow.idle}
      borderRadius={CONFIG.ui.borderRadius}
      hoverShadow={COLORS(isDarkMode).shadow.hover}
    >
      <Card
        borderRadius={CONFIG.ui.borderRadius}
        borderColor={COLORS(isDarkMode).border.normal}
      >
        <TextColor
          xColor={COLORS(isDarkMode).text.pale}
          hoverColor={COLORS(isDarkMode).text.medium}
        >
          <Clickable onClick={toggle}>
            <Padded padding={12}>
              <FlexRow justifyContent={"space-between"}>
                <Padded padding={8}>
                  <Icon
                    src={GhostLogo}
                    isDarkMode={isDarkMode}
                    alt={"Ghost"}
                  />
                </Padded>
                <ArrowRight width={20} />
              </FlexRow>
              <Padded padding={8}>
                <StyledTextParagraph
                  xFontSize={CONFIG.ui.emphasis.fontSize}
                  weight={CONFIG.ui.emphasis.fontWeight}
                  textColor={COLORS(isDarkMode).text.strong}
                >{COPY.blog.ghost}</StyledTextParagraph>
              </Padded>
              <Padded padding={8}>
                <StyledTextParagraph
                  xFontSize={CONFIG.ui.normal.fontSize}
                  weight={CONFIG.ui.normal.fontWeight}
                  textColor={COLORS(isDarkMode).text.medium}
                >{COPY.publish.ghost}</StyledTextParagraph>
              </Padded>
            </Padded>
          </Clickable>
        </TextColor>
      </Card>
    </BoxShadow>
  </Padded>
);

export const MediumOpener: React.FC<OpenerProps> = ({ isDarkMode, toggle }) => (
  <Padded padding={8}>
    <BoxShadow
      shadow={COLORS(isDarkMode).shadow.idle}
      borderRadius={CONFIG.ui.borderRadius}
      hoverShadow={COLORS(isDarkMode).shadow.hover}
    >
      <Card
        borderRadius={CONFIG.ui.borderRadius}
        borderColor={COLORS(isDarkMode).border.normal}
      >
        <TextColor
          xColor={COLORS(isDarkMode).text.pale}
          hoverColor={COLORS(isDarkMode).text.medium}
        >
          <Clickable onClick={toggle}>
            <Padded padding={12}>
              <FlexRow justifyContent={"space-between"}>
                <Padded padding={8}>
                  <TextColor xColor={COLORS(isDarkMode).text.full}>
                    <MediumLogo width={35} />
                  </TextColor>
                </Padded>
                <ArrowRight width={20} />
              </FlexRow>
              <Padded padding={8}>
                <StyledTextParagraph
                  xFontSize={CONFIG.ui.emphasis.fontSize}
                  weight={CONFIG.ui.emphasis.fontWeight}
                  textColor={COLORS(isDarkMode).text.strong}
                >{COPY.blog.medium}</StyledTextParagraph>
              </Padded>
              <Padded padding={8}>
                <StyledTextParagraph
                  xFontSize={CONFIG.ui.normal.fontSize}
                  weight={CONFIG.ui.normal.fontWeight}
                  textColor={COLORS(isDarkMode).text.medium}
                >{COPY.publish.medium}</StyledTextParagraph>
              </Padded>
            </Padded>
          </Clickable>
        </TextColor>
      </Card>
    </BoxShadow>
  </Padded>
);

export const GhostPage: React.FC<GhostCardProps> = (props) => {
  const { isDarkMode, enabled, publish, state } = props;

  const [configShown, setConfigShown] = React.useState<boolean>(() => (
    state.ghostConfig.key == null || state.ghostConfig.url == null
  ));

  return <Padded padding={8}>
    {configShown && <Padded padding={12}>
      <Card
        borderRadius={CONFIG.ui.borderRadius}
        borderColor={COLORS(isDarkMode).border.normal}
      >
        <Padded padding={5}>
          <Input
            isDarkMode={isDarkMode}
            placeHolder={COPY.apiKey}
            value={state.ghostConfig.key ?? ""}
            onChange={state.setKey}
          />
        </Padded>
        <Separator color={COLORS(isDarkMode).border.normal} />
        <Padded padding={5}>
          <Input
            placeHolder={COPY.siteURL}
            isDarkMode={isDarkMode}
            value={state.ghostConfig.url ?? ""}
            onChange={state.setUrl}
          />
        </Padded>
      </Card>
    </Padded>}
    <ConfigLabel
      isDarkMode={isDarkMode}
      toggle={() => setConfigShown(!configShown)}
      label={configShown ? COPY.config.hide : COPY.config.show}
    />
    <Padded padding={4}>
      <Clickable onClick={publish} enabled={enabled}>
        <Card
          borderRadius={CONFIG.ui.borderRadius}
          borderColor={COLORS(isDarkMode).border.normal}
          backgroundColor={COLORS(isDarkMode).craftBlue}
        >
          <Padded padding={8}>
            <FlexRow alignItems={"center"} justifyContent={"center"}>
              <StyledTextSpan
                xFontSize={CONFIG.ui.emphasis.fontSize}
                weight={CONFIG.ui.emphasis.fontWeight}
                textColor={COLORS(true).text.full}
              >{COPY.publish.ghost}</StyledTextSpan>
            </FlexRow>
          </Padded>
        </Card>
      </Clickable>
    </Padded>
  </Padded>;
};

type MediumCardProps = AppCardProps & {
  state: MediumState;
}

export const MediumPage: React.FC<MediumCardProps> = (props) => {
  const { isDarkMode, enabled, publish, state } = props;

  const [configShown, setConfigShown] = React.useState<boolean>(
    () => state.mediumConfig.token == null
  );

  return <Padded padding={8}>
    {configShown && <Padded padding={12}>
      <Card
        borderRadius={CONFIG.ui.borderRadius}
        borderColor={COLORS(isDarkMode).border.normal}
      >
        <Padded padding={5}>
          <Input
            placeHolder={COPY.apiKey}
            isDarkMode={isDarkMode}
            value={state.mediumConfig.token ?? ""}
            onChange={state.setToken}
          />
        </Padded>
      </Card>
    </Padded>}
    <ConfigLabel
      isDarkMode={isDarkMode}
      toggle={() => setConfigShown(!configShown)}
      label={configShown ? COPY.config.hide : COPY.config.show}
    />
    <Padded padding={4}>
      <Clickable onClick={publish} enabled={enabled}>
        <Card
          borderRadius={CONFIG.ui.borderRadius}
          borderColor={COLORS(isDarkMode).border.normal}
          backgroundColor={COLORS(isDarkMode).craftBlue}
        >
          <Padded padding={8}>
            <FlexRow alignItems={"center"} justifyContent={"center"}>
              <StyledTextSpan
                xFontSize={CONFIG.ui.emphasis.fontSize}
                weight={CONFIG.ui.emphasis.fontWeight}
                textColor={COLORS(true).text.full}
              >{COPY.publish.medium}</StyledTextSpan>
            </FlexRow>
          </Padded>
        </Card>
      </Clickable>
    </Padded>
  </Padded>;
};

export const PlatformHelp: React.FC<DarkModeEnabled> = ({ isDarkMode }) => (
    <Padded padding={8}>
        <StyledTextParagraph
            xFontSize={CONFIG.ui.emphasis.fontSize}
            weight={CONFIG.ui.normal.fontWeight}
            textColor={COLORS(isDarkMode).text.pale}
        >
            {COPY.platformHelp}
        </StyledTextParagraph>
    </Padded>
);

export const ConsoleLabel: React.FC<DarkModeEnabled> = ({ isDarkMode }) => (
  <Padded padding={12}>
    <StyledTextSpan
      weight={CONFIG.ui.normal.fontWeight}
      xFontSize={CONFIG.ui.normal.fontSize}
      textColor={COLORS(isDarkMode).text.medium}
    >{COPY.console}</StyledTextSpan>
  </Padded>
);

type ConfigLabelProps = DarkModeEnabled & {
  label: string;
  toggle: () => void;
}

export const ConfigLabel: React.FC<ConfigLabelProps> = ({
  isDarkMode,
  label,
  toggle
}) => (
  <Padded padding={8}>
    <FlexRow alignItems={"center"} justifyContent={"center"}>
      <Clickable onClick={toggle}>
        <StyledTextSpan
          weight={CONFIG.ui.normal.fontWeight}
          xFontSize={CONFIG.ui.normal.fontSize}
          textColor={COLORS(isDarkMode).text.medium}
          decoration={"underline"}
        >{label}</StyledTextSpan>
      </Clickable>
    </FlexRow>
  </Padded>
);