import * as React from "react";
import * as ReactDOM from "react-dom";

import { APPS } from "./ExportApp";
import { AppState, AppStateTransitions, MkAppState } from "./AppState";
import { AppRow, ErrorMessage, Header, Message, ShowMessage } from "./Fragments";
import { Environment } from "@craftdocs/craft-extension-api";
import { COLORS } from "./Constants";
import { useErrorMessage } from "./utils";

const STORAGE_KEY = "send-to-appstate";

/* ---- ENSURE DEV MODE WORKS -----
You can run this extension locally with `npm run dev` in order to have faster iteration cycles.
When running this way, the craft object won't be available and JS exception will occur
With this helper function you can ensure that no exceptions occur for craft api related calls.
/* ---------------------------------*/

const App: React.FC<{}> = () => {
  const [appState, setAppState] = React.useState<AppState>(MkAppState.full());
  const [darkModeEnabled, setDarkModeEnabled] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useErrorMessage(7000);

  React.useEffect(() => {
    craft.storageApi.get(STORAGE_KEY)
      .then(resp => {
        let appState = MkAppState.full();

        if (resp.status === "success") {
          const raw = JSON.parse(resp.data);
          const maybeAppState = MkAppState.validate(raw);
          if (maybeAppState != null) {
            appState = maybeAppState;
          }
        }

        setAppState(appState);
        craft.storageApi.put(STORAGE_KEY, JSON.stringify(appState));
      });
  }, []);

  const updateDarkMode = React.useCallback((currentEnv: Environment) => {
    const isDarkMode = currentEnv.colorScheme === "dark";
    setDarkModeEnabled(isDarkMode);
    document.body.style.backgroundColor = COLORS(isDarkMode).app;
  }, [setDarkModeEnabled]);

  React.useEffect(() => {
    craft.env.setListener(updateDarkMode);
    return () => craft.env.setListener(null);
  }, [updateDarkMode]);

  const toggleMessage = React.useCallback(() => {
    const nextState = AppStateTransitions.toggleMessage(appState)
    setAppState(nextState);

    craft.storageApi
      .put(STORAGE_KEY, JSON.stringify(nextState))
      .catch(() => setErrorMessage("Internal Craft API error"));
    
  }, [appState, setAppState, setErrorMessage]);

  const openURL = React.useCallback((url: string) => {
    craft.editorApi
      .openURL(url)
      .catch(() => setErrorMessage(`Cannot open URL: ${url}`))
  }, []);

  return <>
    <Header isDarkMode={darkModeEnabled} />

    {errorMessage && <ErrorMessage isDarkMode={darkModeEnabled} message={errorMessage} />}

    {appState.messageShown
      ? <Message isDarkMode={darkModeEnabled} toggle={toggleMessage} />
      : <ShowMessage isDarkMode={darkModeEnabled} toggle={toggleMessage} />
    }

    {APPS.map((app) => app.enabled && (
      <AppRow
        key={app.name}
        isDarkMode={darkModeEnabled}
        app={app}
        openHomePage={openURL}
      />
    ))}
  </>;
}

export function initApp() {
  ReactDOM.render(<App />, document.getElementById('react-root'));
}