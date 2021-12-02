import { Environment } from "@craftdocs/craft-extension-api";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Tokens, Blog, persistTokens, readTokens } from "./AppState";
import {
  ghostConfigValid,
  mediumConfigValid,
  useGhostConfig,
  useMediumConfig
} from "./BlogConfig";
import {
  ConsoleLabel,
  GhostPage,
  GhostOpener,
  Header,
  MediumPage,
  MediumOpener,
  PlatformHelp
} from "./Fragments";
import { publishToGhost, publishToMedium } from "./Publish";
import { withCraft } from "./utils";

import { COLORS, COPY } from "./Constants";
import { Console, useConsole } from "./Console";
import { BackArrow, LogMessage, TextColor } from "./Ui";

const App: React.FC<{}> = () => {
  const { entries, log, clear } = useConsole();

  const ghostState = useGhostConfig();
  const mediumState = useMediumConfig();

  const { ghostConfig } = ghostState;
  const { mediumConfig } = mediumState;

  const [currentBlog, setCurrentBlog] = React.useState<Blog | null>(null);
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);
  const [
    isPlatformSupported,
    setIsPlatformSupported
  ] = React.useState<boolean | null>(true);

  const toggleBlog = React.useCallback((blog: Blog) => {
    clear();
    const nextBlog = blog === currentBlog ? null : blog;
    setCurrentBlog(nextBlog);
  }, [currentBlog, setCurrentBlog, clear]);

  const updateDarkMode = React.useCallback((isDarkMode: boolean) => {
    setIsDarkMode(isDarkMode);
    document.body.style.backgroundColor = COLORS(isDarkMode).app;
  }, [setIsDarkMode]);

  const onEnvChange = React.useCallback((env: Environment) => {
    updateDarkMode(env.colorScheme === "dark");
    setIsPlatformSupported(env.platform !== "Web");
  }, [setIsPlatformSupported, updateDarkMode]);

  React.useEffect(() => withCraft(api => {
    api.env.setListener(onEnvChange);
    readTokens(api)
      .then(state => {
        ghostState.setGhostConfig({
          key: state.ghostToken,
          url: state.ghostUrl
        });
        if (state.mediumToken != null) {
          mediumState.setToken(state.mediumToken);
        }
      })
      .catch(() => log({
        entry: <LogMessage
          isDarkMode={isDarkMode}
          text={"Cannot read local storage"}
        />
      }));
    return () => api.env.setListener(null);
  }), []);

  const saveAppState = React.useCallback(async () => await withCraft(api => {
    return persistTokens(api, {
      ghostToken: ghostConfig.key,
      ghostUrl: ghostConfig.url,
      mediumToken: mediumConfig.token
    });
  }), [ghostConfig, mediumConfig]);

  const publishToMediumI = React.useCallback(
    async () => {
      if (mediumConfigValid(mediumConfig)) {
        await saveAppState();
        log({
          entry: <LogMessage
            isDarkMode={isDarkMode}
            text={COPY.exporting("Medium")}
          />
        });
        return await publishToMedium(mediumConfig)
          .then(() => log({
            entry: <LogMessage isDarkMode={isDarkMode}
              text={COPY.epxorted("Medium")}
            />
          }))
          .catch(() => log({
            entry: <LogMessage isDarkMode={isDarkMode}
              text={COPY.problem("Medium")}
            />
          }));
      }
    },
    [mediumConfig, saveAppState]
  );

  const publishToGhostI = React.useCallback(
    async () => {
      if (ghostConfigValid(ghostConfig)) {
        await saveAppState();
        log({
          entry: <LogMessage isDarkMode={isDarkMode}
            text={COPY.exporting("Ghost")}
          />
        });
        return await publishToGhost(ghostConfig)
          .then(() => log({
            entry: <LogMessage isDarkMode={isDarkMode}
              text={COPY.epxorted("Ghost")}
            />
          }))
          .catch(() => log({
            entry: <LogMessage isDarkMode={isDarkMode}
              text={COPY.problem("Ghost")}
            />
          }));
      }
    },
    [ghostConfig, saveAppState]
  );

  const section = React.useCallback((blog: Blog) => {
    if (blog === "Ghost") {
      return <GhostPage
        state={ghostState}
        enabled={ghostConfigValid(ghostState.ghostConfig)}
        isDarkMode={isDarkMode}
        publish={publishToGhostI}
      />;
    }

    if (blog === "Medium") {
      return <MediumPage
        state={mediumState}
        enabled={mediumConfigValid(mediumConfig)}
        isDarkMode={isDarkMode}
        publish={publishToMediumI}
      />;
    }
  }, [ghostConfigValid, mediumConfigValid, toggleBlog, isDarkMode, ghostState, publishToMediumI, publishToGhostI, currentBlog, ])

  if (!isPlatformSupported) {
    return <>
      <Header isDarkMode={isDarkMode} />
      <PlatformHelp isDarkMode={isDarkMode} />
    </>;
  }

  return <>
    {currentBlog != null &&
      <TextColor
        xColor={COLORS(isDarkMode).text.medium}
      >
        <BackArrow onClick={() => toggleBlog(currentBlog)} />
      </TextColor>
    }
    <Header isDarkMode={isDarkMode} />

    {currentBlog != null
      ? section(currentBlog)
      : <>
        <GhostOpener
          isDarkMode={isDarkMode}
          toggle={() => toggleBlog("Ghost")}
        />

        <MediumOpener
          isDarkMode={isDarkMode}
          toggle={() => toggleBlog("Medium")}
        />
      </>}

    {
      currentBlog != null &&
      <>
        <ConsoleLabel isDarkMode={isDarkMode} />
        <Console entries={entries} isDarkMode={isDarkMode} />
      </>
    }
  </>;
}

export function initApp() {
  ReactDOM.render(<App />, document.getElementById("react-root"))
}
